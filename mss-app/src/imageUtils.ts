import { coverageMapLinks } from './constants/coverageMapLinks';
import {
  AFFILIATES,
  BLACKOUTMAP,
  CHANNELFINDER,
  COVERAGEMAP,
  COVERAGEMAP506,
  imagesForUrls,
  SPECIALCOVERAGENOTE
} from './constants/imagesForUrls';
import { specialCoverageNotes } from './constants/specialCoverageNotes';
import { syndicationLinks } from './constants/syndicationLinks';

export const formatNetworkJpgAndCoverage = (input: string, season: string): string => {
  let networks = input.split(',');
  let imagesString: string[] = [];
  let imageHyperlinkString: string[] = [];
  let textHyperlinksString: string[] = [];
  let textString: string[] = [];
  let infoLinksString: string[] = [];

  const { images, imageHyperlinks, textHyperlinks, infoLinks, strings } = validateFieldData(networks);

  if (images.length) {
    images.forEach((image) => {
      imagesString.push(`<img class=\"imageDimensions\" src=\"/images/${image}\" />`);
    });
  }

  if (imageHyperlinks.length) {
    imageHyperlinks.forEach((imageHyperlink) => {
      const imageArray = imagesForUrls.filter((x) => imageHyperlink.includes(x.link));

      if (imageArray.length > 1) {
        switch (season) {
          case '2020r':
          case '2021s':
            season = '2020';
            break;
          default:
            break;
        }

        let imageUrl = '';

        for (let image of imageArray) {
          let doNotUse = false;

          if (image.yearEnd) {
            var years = image.yearEnd.split('|');
            var yearToCompare = years.find((x) => x.length === season.length)![0];
            doNotUse = parseInt(season) > parseInt(yearToCompare);
            imageUrl = doNotUse ? '' : image.image;
            if (imageUrl !== '') {
              break;
            }
          } else {
            imageUrl = image.image;
          }
        }

        imageHyperlinkString.push(
          `<a href=\"${imageHyperlink}\" target=\"_blank\" ><img class=\"imageDimensions\" src=\"/images/${imageUrl}\" /></a>`
        );
      } else {
        imageHyperlinkString.push(
          `<a href=\"${imageHyperlink}\" target=\"_blank\" ><img class=\"imageDimensions\" src=\"/images/${imageArray[0].image}\" /></a>`
        );
      }
    });
  }

  let combinedImagesString = imagesString.concat(imageHyperlinkString);

  let counter = 0;
  combinedImagesString.forEach((_, index) => {
    counter++;
    if (counter % 3 === 0 && (counter === 4 || counter >= 7)) {
      combinedImagesString.splice(index, 0, '<br>');
    }
  });

  if (textHyperlinks.length) {
    textHyperlinks.forEach((textHyperlink, index) => {
      if (index % 2 !== 0) {
        textHyperlinksString.push('<br>');
      }
      textHyperlinksString.push(`<a class="linkblock" href="${textHyperlink}" target="_blank">Live Video</a>`);
    });
  }

  if (strings.length) {
    strings.forEach((str, index) => {
      if (index % 2 !== 0) {
        textString.push('<br>');
      }
      textString.push(str);
    });
  }

  if (infoLinks.length) {
    infoLinks.forEach((infoLink, index) => {
      let infoLinkValue = 'Live Video';
      if (isSyndAffiliates(infoLink)) infoLinkValue = AFFILIATES;
      else if (isCoverageMap(infoLink)) infoLinkValue = COVERAGEMAP;
      else if (isThe506CoverageMap(infoLink)) infoLinkValue = COVERAGEMAP506;
      else if (isGamePlanMap(infoLink)) infoLinkValue = BLACKOUTMAP;
      else if (isBTN(infoLink) || isP12Networks(infoLink)) infoLinkValue = CHANNELFINDER;
      else if (isSpecialCoverageNote(infoLink)) infoLinkValue = SPECIALCOVERAGENOTE;
      if (index % 2 !== 0) {
        infoLinksString.push('<br>');
      }
      infoLinksString.push(`<a class="linkblock" href="${infoLink}" target="_blank">${infoLinkValue}</a>`);
    });
  }

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

  return (
    `${combinedImagesString.length ? combinedImagesString.join('') : ''}${textHyperlinksString.length ? textHyperlinksString.join('') : ''}` +
    `${infoLinksString.length ? infoLinksString.join('') : ''}${textString.length ? textString.join('') : ''}`
  );
};

function validateFieldData(networks: string[]): {
  images: string[];
  imageHyperlinks: string[];
  infoLinks: string[];
  textHyperlinks: string[];
  strings: string[];
} {
  let images: string[] = [];
  let imageHyperlinks: string[] = [];
  let textHyperlinks: string[] = [];
  let strings: string[] = [];
  let infoLinks: string[] = [];

  networks.forEach((network) => {
    if (isImage(network)) images.push(network);
    else if (isImageHyperlink(network)) imageHyperlinks.push(network);
    else if (isInformationLink(network)) infoLinks.push(network);
    else if (isHyperlink(network)) textHyperlinks.push(network);
    else strings.push(network);
  });

  return { images, imageHyperlinks, infoLinks, textHyperlinks, strings };
}

function isImage(network: string): boolean {
  return (
    network.endsWith('jpg') &&
    !network.includes('assets.espn') &&
    !network.includes('espncdn') &&
    !network.includes('espngameplan')
  );
}

function isHyperlink(network: string) {
  return network.includes('http') || network.includes('.com');
}

function isImageHyperlink(network: string): boolean {
  return imagesForUrls.some((x) => network.includes(x.link));
}

function isInformationLink(network: string): boolean {
  return (
    isSyndAffiliates(network) || isCoverageMap(network) || isGamePlanMap(network) || isSpecialCoverageNote(network)
  );
}

function isSyndAffiliates(network: string): boolean {
  return (
    network.includes('acctourney.theacc.com') ||
    network.includes('theacc.com/live') ||
    network.includes('raycomsports') ||
    network.includes('SECNetWk') ||
    network.includes('Big12NetWk') ||
    (network.includes('wacsports') && !network.includes('wacsports.com/live')) ||
    network.includes('theacc.com/news') ||
    network.includes('BigEastWk') ||
    network.includes('http://tinyurl.com/slctvstations') ||
    network.includes('theacc.com/sports') ||
    IsASNLink(network)
  );
}

function IsASNLink(network: string): boolean {
  return syndicationLinks.some((x) => x === network);
}
function isCoverageMap(network: string): boolean {
  return (
    coverageMapLinks.some((x) => x === network) ||
    network.includes('http://assets.espn.go.com/photo/') ||
    (network.includes('espncdn') && !network.includes('blackout')) ||
    network.includes('http://www.seminoles.com/blog/Screen%20Shot%202013-11-07%20at%2011.42.17%20AM.png') ||
    network.includes('https://espnpressroom.com/us/files/2013/08/CF_Oct29_Maps_MZ.pdf')
  );
}
function isGamePlanMap(network: string): boolean {
  return (
    network.includes('http://assets.espn.go.com/gameplan/') ||
    network.includes('http://assets.espn.go.com/espn3/') ||
    network.includes('espngameplan.espn.com') ||
    network.includes('blackout')
  );
}
function isSpecialCoverageNote(network: string): boolean {
  return specialCoverageNotes.some((x) => x === network);
}
function isThe506CoverageMap(network: string): boolean {
  return network.includes('http://www.the506.com');
}

function isBTN(network: string): boolean {
  return network.includes('bigtennetwork.com') || network.includes('btn.com');
}

function isP12Networks(network: string): boolean {
  return network.includes('http://pac-12.com/AboutPac-12Enterprises/ChannelFinder.aspx');
}
