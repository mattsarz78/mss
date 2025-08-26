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

const seasonMap: Record<string, string> = { '2020r': '2020', '2021s': '2020' };

interface ImagesForUrl {
  link: string;
  image: string;
  yearEnd?: string;
}

export const formatNetworkJpgAndCoverage = (input: string, season: string): string => {
  const networks = input.split(',');
  const imagesString: string[] = [];
  const imageHyperlinkString: string[] = [];
  const textHyperlinksString: string[] = [];
  const textString: string[] = [];
  const infoLinksString: string[] = [];

  const { images, imageHyperlinks, textHyperlinks, infoLinks, strings } = validateFieldData(networks);

  images.forEach((image) => {
    imagesString.push(
      `<picture>
        <source media="only screen and (max-width: 640px)" srcset="/images/${image.replace('.jpg', '-small.jpg')}" sizes="43w" />
        <img class="imgBorder" loading="lazy" src="/images/${image}" sizes="66w"/>
      </picture>`
    );
  });

  imageHyperlinks.forEach((imageHyperlink) => {
    const imageArray = (imagesForUrls as ImagesForUrl[]).filter((x: ImagesForUrl) => imageHyperlink.includes(x.link));
    const imageUrl = getImageUrl(imageArray, season);
    imageHyperlinkString.push(
      `<a href="${imageHyperlink}" target="_blank" rel="noopener">
      <picture>
        <source media="only screen and (max-width: 640px)" srcset="/images/${imageUrl.replace('.jpg', '-small.jpg')}" sizes="43w" />
        <img class="imgBorder" loading="lazy" src="/images/${imageUrl}" sizes="66w" />
      </picture>
      </a>`
    );
  });

  const combinedImagesString = imagesString.concat(imageHyperlinkString);
  addLineBreaks(combinedImagesString);

  textHyperlinks.forEach((textHyperlink, index) => {
    if (index % 2 !== 0) textHyperlinksString.push('<br>');
    textHyperlinksString.push(`<a class="linkblock" href="${textHyperlink}" target="_blank" rel="noopener">Live Video</a>`);
  });

  strings.forEach((str, index) => {
    if (index % 2 !== 0) textString.push('<br>');
    textString.push(str);
  });

  infoLinks.forEach((infoLink, index) => {
    const infoLinkValue = getInfoLinkValue(infoLink);
    if (index % 2 !== 0) infoLinksString.push('<br>');
    infoLinksString.push(`<a class="linkblock" href="${infoLink}" target="_blank" rel="noopener">${infoLinkValue}</a>`);
  });

  ensureLineBreaks(combinedImagesString, textHyperlinksString, textString, infoLinksString);

  return `${combinedImagesString.join('')}${textHyperlinksString.join('')}${infoLinksString.join('')}${textString.join('')}`;
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
  return (imagesForUrls as ImagesForUrl[]).some((x: ImagesForUrl) => network.includes(x.link));
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
  return syndicationLinks.some((x) => x === network);
};

const isCoverageMap = (network: string): boolean => {
  return (
    coverageMapLinks.some((x) => x === network) ||
    network.includes('http://assets.espn.go.com/photo/') ||
    (network.includes('espncdn') && !network.includes('blackout')) ||
    network.includes('http://www.seminoles.com/blog/Screen%20Shot%202013-11-07%20at%2011.42.17%20AM.png') ||
    network.includes('https://espnpressroom.com/us/files/2013/08/CF_Oct29_Maps_MZ.pdf')
  );
};

const isGamePlanMap = (network: string): boolean => {
  return (
    network.includes('http://assets.espn.go.com/gameplan/') ||
    network.includes('http://assets.espn.go.com/espn3/') ||
    network.includes('espngameplan.espn.com') ||
    network.includes('blackout')
  );
};

const isSpecialCoverageNote = (network: string): boolean => {
  return specialCoverageNotes.some((x) => x === network);
};

const isThe506CoverageMap = (network: string): boolean => {
  return network.includes('http://www.the506.com');
};

const isBTN = (network: string): boolean => {
  return network.includes('bigtennetwork.com') || network.includes('btn.com');
};

const isP12Networks = (network: string): boolean => {
  return network.includes('http://pac-12.com/AboutPac-12Enterprises/ChannelFinder.aspx');
};

const getImageUrl = (imageArray: { link: string; image: string; yearEnd?: string }[], season: string): string => {
  if (imageArray.length > 1) {
    season = seasonMap[season] || season;
    for (const image of imageArray) {
      if (image.yearEnd) {
        const years = image.yearEnd.split('|');
        const yearToCompare = years.find((x) => x.length === season.length);
        if (yearToCompare) {
          if (parseInt(season) <= parseInt(yearToCompare[0])) {
            return image.image;
          }
        }
        if (yearToCompare && parseInt(season) <= parseInt(yearToCompare)) {
          return image.image;
        }
      } else {
        return image.image;
      }
    }
  }
  return imageArray[0].image;
};

const addLineBreaks = (combinedImagesString: string[]): void => {
  let counter = 0;
  combinedImagesString.forEach((_, index) => {
    counter++;
    if (counter % 3 === 0 && (counter === 4 || counter >= 7)) {
      combinedImagesString.splice(index, 0, '<br>');
    }
  });
};

const ensureLineBreaks = (
  combinedImagesString: string[],
  textHyperlinksString: string[],
  textString: string[],
  infoLinksString: string[]
): void => {
  if (
    combinedImagesString.length &&
    !combinedImagesString.join('').endsWith('<br>') &&
    (textHyperlinksString.length || textString.length || infoLinksString.length)
  ) {
    combinedImagesString.push('<br>');
  }

  if (textHyperlinksString.length && !textHyperlinksString.join('').endsWith('<br>')) {
    textHyperlinksString.push('<br>');
  }

  if (infoLinksString.length && !infoLinksString.join('').endsWith('<br>')) {
    infoLinksString.push('<br>');
  }

  if (textString.length && !textString.join('').endsWith('<br>')) {
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
