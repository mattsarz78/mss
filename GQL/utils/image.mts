import {
  AFFILIATES,
  BLACKOUTMAP,
  CHANNELFINDER,
  COVERAGEMAP,
  COVERAGEMAP506,
  coverageMapLinks,
  SPECIALCOVERAGENOTE,
  specialCoverageNotes,
  syndicationLinks
} from '#staticData/constants.mjs';
import imagesForUrls from '#staticData/imagesForUrls.json' with { type: 'json' };
import { createClient } from 'redis';

const seasonMap: Record<string, string> = { '2020r': '2020', '2021s': '2020' };

// Cache image links for O(1) lookup instead of O(n) array iteration
const imageLinksCache = new Set((imagesForUrls as ImagesForUrl[]).map((x: ImagesForUrl) => x.link));

// Build image URL map for O(1) lookup instead of filtering 200+ items per hyperlink
const imageUrlMap = new Map<string, ImagesForUrl[]>();
(imagesForUrls as ImagesForUrl[]).forEach((img) => {
  if (!imageUrlMap.has(img.link)) {
    imageUrlMap.set(img.link, []);
  }
  imageUrlMap.get(img.link)!.push(img);
});

// Cache specialized link sets for faster lookups
const coverageMapLinksSet = new Set(coverageMapLinks);
const specialCoverageNotesSet = new Set(specialCoverageNotes);
const syndicationLinksSet = new Set(syndicationLinks);

// Small bounded cache for formatted network/html strings to avoid recomputation
const FORMAT_CACHE_MAX = 2000;
const formatCache = new Map<string, string>();

// Redis L2 cache configuration
const CACHE_VERSION = 'v1';
const REDIS_CACHE_TTL = process.env.IMAGE_CACHE_TTL ? parseInt(process.env.IMAGE_CACHE_TTL, 10) : 3600; // seconds
let redisClient: ReturnType<typeof createClient> | null = null;

if (process.env.REDIS_URL) {
  redisClient = createClient({ url: process.env.REDIS_URL });
  redisClient.on('error', (err: unknown) => {
    // Do not crash the process if redis is unavailable
     
    console.error('Redis error in image.mts:', err);
  });
  (async () => {
    try {
      await redisClient!.connect();
    } catch (err) {
       
      console.error('Failed to connect to Redis in image.mts:', err);
      redisClient = null;
    }
  })();
}

const makeCacheKey = (input: string, season: string) => `${CACHE_VERSION}::${input}::${season}`;

interface ImagesForUrl {
  link: string;
  image: string;
  yearEnd?: string;
}

export const computeFormatNetworkJpgAndCoverage = (input: string, season: string): string => {
  const networks = input.split(',');
  const combinedImagesString: string[] = [];
  const textHyperlinksString: string[] = [];
  const textString: string[] = [];
  const infoLinksString: string[] = [];

  const { images, imageHyperlinks, textHyperlinks, infoLinks, strings } = validateFieldData(networks);

  // Push images directly into the combined array to avoid intermediate arrays
  for (const image of images) {
    const webpImage = image.replace('.jpg', '.webp');
    const smallImage = webpImage.replace('.webp', '-small.webp');
    combinedImagesString.push(
      `<picture>
        <source media="only screen and (max-width: 640px)" srcset="/images/${smallImage}" sizes="43w" />
        <img class="imgBorder" loading="lazy" src="/images/${webpImage}" sizes="66w"/>
      </picture>`
    );
  }

  for (const imageHyperlink of imageHyperlinks) {
    // Look up in pre-built map instead of filtering 200+ items
    let imageArray: ImagesForUrl[] = [];
    for (const [link, images] of imageUrlMap) {
      if (imageHyperlink.includes(link)) {
        imageArray = images;
        break;
      }
    }
    const webpUrl = getImageUrl(imageArray, season).replace('.jpg', '.webp');
    const smallUrl = webpUrl.replace('.webp', '-small.webp');
    combinedImagesString.push(
      `<a href="${imageHyperlink}" target="_blank" rel="noopener">
      <picture>
        <source media="only screen and (max-width: 640px)" srcset="/images/${smallUrl}" sizes="43w" />
        <img class="imgBorder" loading="lazy" src="/images/${webpUrl}" sizes="66w" />
      </picture>
      </a>`
    );
  }

  addLineBreaks(combinedImagesString);

  for (let i = 0; i < textHyperlinks.length; i++) {
    const textHyperlink = textHyperlinks[i];
    if (i % 2 !== 0) textHyperlinksString.push('<br>');
    textHyperlinksString.push(
      `<a class="linkblock" href="${textHyperlink}" target="_blank" rel="noopener">Live Video</a>`
    );
  }

  for (let i = 0; i < strings.length; i++) {
    const str = strings[i];
    if (i % 2 !== 0) textString.push('<br>');
    textString.push(str);
  }

  for (let i = 0; i < infoLinks.length; i++) {
    const infoLink = infoLinks[i];
    const infoLinkValue = getInfoLinkValue(infoLink);
    if (i % 2 !== 0) infoLinksString.push('<br>');
    infoLinksString.push(`<a class="linkblock" href="${infoLink}" target="_blank" rel="noopener">${infoLinkValue}</a>`);
  }

  ensureLineBreaks(combinedImagesString, textHyperlinksString, textString, infoLinksString);

  return `${combinedImagesString.join('')}${textHyperlinksString.join('')}${infoLinksString.join('')}${textString.join('')}`;
};

export const formatNetworkJpgAndCoverageAsync = async (input: string, season: string): Promise<string> => {
  const cacheKey = makeCacheKey(input, season);

  // L1 in-process cache
  const cachedLocal = formatCache.get(cacheKey);
  if (cachedLocal) return cachedLocal;

  // L2 Redis cache
  if (redisClient) {
    try {
      const cachedRedis = await redisClient.get(cacheKey);
      if (cachedRedis) {
        formatCache.set(cacheKey, cachedRedis);
        return cachedRedis;
      }
    } catch (err) {
      // ignore Redis errors
       
      console.error('Redis GET error in image.mts:', err);
    }
  }

  // Compute result synchronously
  const result = computeFormatNetworkJpgAndCoverage(input, season);

  // Populate caches
  formatCache.set(cacheKey, result);
  if (formatCache.size > FORMAT_CACHE_MAX) {
    const oldest = formatCache.keys().next().value as string | undefined;
    if (oldest) formatCache.delete(oldest);
  }

  if (redisClient) {
    try {
      await redisClient.set(cacheKey, result, { EX: REDIS_CACHE_TTL });
    } catch (err) {
      // ignore Redis set errors
       
      console.error('Redis SET error in image.mts:', err);
    }
  }

  return result;
};

/**
 * Batch formatting helper
 * Accepts an array of { input, season } pairs, and returns a Map keyed by "input::season" -> formatted string
 * Strategy: check L1 cache, then L2 mGet, compute remaining synchronously, then pipeline SET for Redis.
 */
export const formatNetworkBatch = async (
  pairs: Array<{ input: string; season: string }>
): Promise<Map<string, string>> => {
  // Normalize and dedupe simple keys (input::season)
  const simpleKeys = Array.from(new Set(pairs.map((p) => `${p.input}::${p.season}`)));
  const out = new Map<string, string>();

  // Map simpleKey -> cacheKey
  const keyMap = new Map<string, string>();
  for (const sk of simpleKeys) {
    const sep = sk.lastIndexOf('::');
    const input = sep !== -1 ? sk.slice(0, sep) : sk;
    const season = sep !== -1 ? sk.slice(sep + 2) : '';
    keyMap.set(sk, makeCacheKey(input, season));
  }

  // L1 hits
  const missingKeys: string[] = [];
  for (const sk of simpleKeys) {
    const cacheKey = keyMap.get(sk)!;
    const v = formatCache.get(cacheKey);
    if (v) {
      out.set(sk, v);
    } else {
      missingKeys.push(sk);
    }
  }

  // L2 mGet (fetch by cacheKey)
  if (redisClient && missingKeys.length) {
    try {
      const cacheKeys = missingKeys.map((sk) => keyMap.get(sk)!);
      const vals = await redisClient.mGet(cacheKeys);
      vals.forEach((val, i) => {
        if (val !== null) {
          const sk = missingKeys[i];
          const cacheKey = cacheKeys[i];
          out.set(sk, val);
          // populate L1
          formatCache.set(cacheKey, val);
        }
      });
      // remove fulfilled keys from missingKeys
      for (let i = missingKeys.length - 1; i >= 0; i--) {
        if (out.has(missingKeys[i])) missingKeys.splice(i, 1);
      }
    } catch (err) {
       
      console.error('Redis MGET error in image.mts:', err);
    }
  }

  // Compute remaining missing keys synchronously and pipeline SET to Redis
  if (missingKeys.length) {
    // compute
    for (const sk of missingKeys) {
      const cacheKey = keyMap.get(sk)!;
      const sep = sk.lastIndexOf('::');
      const input = sep !== -1 ? sk.slice(0, sep) : sk;
      const season = sep !== -1 ? sk.slice(sep + 2) : '';
      const res = computeFormatNetworkJpgAndCoverage(input, season);
      out.set(sk, res);
      // populate L1
      formatCache.set(cacheKey, res);
    }

    // pipeline SET with EX
    if (redisClient) {
      try {
        const multi = redisClient.multi();
        for (const sk of missingKeys) {
          const cacheKey = keyMap.get(sk)!;
          const val = out.get(sk)!;
          multi.set(cacheKey, val, { EX: REDIS_CACHE_TTL });
        }
        await multi.exec();
      } catch (err) {
         
        console.error('Redis pipeline SET error in image.mts:', err);
      }
    }
  }

  return out;
};

const validateFieldData = (
  networks: string[]
): {
  images: string[];
  imageHyperlinks: string[];
  infoLinks: string[];
  textHyperlinks: string[];
  strings: string[];
} => {
  const images: string[] = [];
  const imageHyperlinks: string[] = [];
  const textHyperlinks: string[] = [];
  const strings: string[] = [];
  const infoLinks: string[] = [];

  networks.forEach((network) => {
    if (isImage(network)) images.push(network);
    else if (isImageHyperlink(network)) imageHyperlinks.push(network);
    else if (isInformationLink(network)) infoLinks.push(network);
    else if (isHyperlink(network)) textHyperlinks.push(network);
    else strings.push(network);
  });

  return { images, imageHyperlinks, infoLinks, textHyperlinks, strings };
};

const isImage = (network: string): boolean => {
  return (
    network.endsWith('jpg') &&
    !network.includes('assets.espn') &&
    !network.includes('espncdn') &&
    !network.includes('espngameplan')
  );
};

const isHyperlink = (network: string): boolean => {
  return network.includes('http') || network.includes('.com');
};

const isImageHyperlink = (network: string): boolean => {
  // Check if network contains any of the cached image links
  for (const link of imageLinksCache) {
    if (network.includes(link)) {
      return true;
    }
  }
  return false;
};

const isInformationLink = (network: string): boolean => {
  return (
    isSyndAffiliates(network) ||
    isCoverageMap(network) ||
    isGamePlanMap(network) ||
    isSpecialCoverageNote(network) ||
    isBTN(network)
  );
};

const isSyndAffiliates = (network: string): boolean => {
  return (
    network.includes('acctourney.theacc.com') ||
    network.includes('theacc.com/live') ||
    network.includes('raycomsports') ||
    network.includes('SECNetWk') ||
    network.includes('Big12NetWk') ||
    (network.includes('wacsports') && !network.includes('wacsports.com/live') && !network.includes('swacsports')) ||
    network.includes('theacc.com/news') ||
    network.includes('BigEastWk') ||
    network.includes('http://tinyurl.com/slctvstations') ||
    network.includes('theacc.com/sports') ||
    IsASNLink(network)
  );
};

const IsASNLink = (network: string): boolean => {
  return syndicationLinksSet.has(network);
};

const isCoverageMap = (network: string): boolean => {
  if (coverageMapLinksSet.has(network)) return true;
  if (network.includes('http://assets.espn.go.com/photo/')) return true;
  if (network.includes('espncdn') && !network.includes('blackout')) return true;
  if (network.includes('http://www.seminoles.com/blog/Screen%20Shot%202013-11-07%20at%2011.42.17%20AM.png'))
    return true;
  if (network.includes('https://espnpressroom.com/us/files/2013/08/CF_Oct29_Maps_MZ.pdf')) return true;
  return false;
};

const isGamePlanMap = (network: string): boolean => {
  if (network.includes('http://assets.espn.go.com/gameplan/')) return true;
  if (network.includes('http://assets.espn.go.com/espn3/')) return true;
  if (network.includes('espngameplan.espn.com')) return true;
  if (network.includes('blackout')) return true;
  return false;
};

const isSpecialCoverageNote = (network: string): boolean => {
  return specialCoverageNotesSet.has(network);
};

const isThe506CoverageMap = (network: string): boolean => {
  return network.includes('http://www.the506.com');
};

const endsWithBr = (arr: string[]): boolean => {
  return arr.length > 0 && arr[arr.length - 1] === '<br>';
};

const isBTN = (network: string): boolean => {
  return network.includes('bigtennetwork.com') || network.includes('btn.com');
};

const isP12Networks = (network: string): boolean => {
  return network.includes('http://pac-12.com/AboutPac-12Enterprises/ChannelFinder.aspx');
};

const getImageUrl = (imageArray: { link: string; image: string; yearEnd?: string }[], season: string): string => {
  if (!imageArray || imageArray.length === 0) return '';

  if (imageArray.length > 1) {
    season = seasonMap[season] || season;
    const seasonInt = parseInt(season);
    for (const image of imageArray) {
      if (image.yearEnd) {
        const years = image.yearEnd.split('|');
        const yearToCompare = years.find((x) => x.length === season.length);
        if (yearToCompare) {
          const yearNum = parseInt(yearToCompare);
          if (!Number.isNaN(yearNum) && seasonInt <= yearNum) {
            return image.image;
          }
        }
      } else {
        return image.image;
      }
    }
  }
  return imageArray[0].image;
};

const addLineBreaks = (combinedImagesString: string[]): void => {
  // Rebuild array instead of using splice to avoid O(n²) reallocation
  const result: string[] = [];
  combinedImagesString.forEach((item, index) => {
    result.push(item);
    const counter = index + 1;
    if (counter % 3 === 0 && (counter === 4 || counter >= 7)) {
      result.push('<br>');
    }
  });
  // Replace contents of original array
  combinedImagesString.length = 0;
  combinedImagesString.push(...result);
};

const ensureLineBreaks = (
  combinedImagesString: string[],
  textHyperlinksString: string[],
  textString: string[],
  infoLinksString: string[]
): void => {
  if (
    combinedImagesString.length &&
    !endsWithBr(combinedImagesString) &&
    (textHyperlinksString.length || textString.length || infoLinksString.length)
  ) {
    combinedImagesString.push('<br>');
  }

  if (textHyperlinksString.length && !endsWithBr(textHyperlinksString)) {
    textHyperlinksString.push('<br>');
  }

  if (infoLinksString.length && !endsWithBr(infoLinksString)) {
    infoLinksString.push('<br>');
  }

  if (textString.length && !endsWithBr(textString)) {
    textString.push('<br>');
  }
};

const getInfoLinkValue = (infoLink: string): string => {
  if (isSyndAffiliates(infoLink)) return AFFILIATES;
  if (isCoverageMap(infoLink)) return COVERAGEMAP;
  if (isThe506CoverageMap(infoLink)) return COVERAGEMAP506;
  if (isGamePlanMap(infoLink)) return BLACKOUTMAP;
  if (isBTN(infoLink) || isP12Networks(infoLink)) return CHANNELFINDER;
  if (isSpecialCoverageNote(infoLink)) return SPECIALCOVERAGENOTE;
  return 'Live Video';
};
