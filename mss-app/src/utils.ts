import { validSportYears } from './constants/validSportYears';
import { flexScheduleLinks } from './constants/flexScheduleLinks';
import { conferenceCasing } from './constants/conferenceCasing';
import { contractData } from './constants/conference-data';
import type { ConferenceGame, NoTvGame, TvGame, WeekInfo } from './graphQl';
import { DateTime } from 'luxon';

export const conferenceListBase = (sport: string, year: string): string => {
  return sport === 'football' && year !== '2021s'
    ? validSportYears.find((validSportYear) => validSportYear.season === year)?.conferenceListBase!
    : '';
};

export const getIndependentSchools = (year: string): string => {
  return validSportYears.find((validSportYear) => validSportYear.season === year)?.independents! as string;
};

export const flexScheduleLink = (year: string): string => {
  return (flexScheduleLinks as any[]).find((link) => link.season === year)?.url;
};

export const adjustNavBar = () => {
  const widthAddition = window.innerWidth >= 641 ? 20 : 25;
  const paddingAddition = document.querySelector('.navbar')!.clientHeight + widthAddition;

  document.querySelector('#Main')!.setAttribute('style', `padding-top: ${paddingAddition}px`);
};

export const adjustWebExclusives = () => {
  document
    .querySelectorAll<HTMLElement>('.webGame')
    .forEach((webgame: HTMLElement) =>
      webgame.style.display === 'none' ? (webgame.style.display = '') : (webgame.style.display = 'none')
    );

  const buttonTitle = document.querySelector('#btnWebGames')!.getAttribute('value');

  buttonTitle?.startsWith('Show')
    ? document.querySelector('#btnWebGames')!.setAttribute('value', 'Hide Web Exclusive Games')
    : document.querySelector('#btnWebGames')!.setAttribute('value', 'Show Web Exclusive Games');
};

export const getConferenceCasing = (conference: string) => conferenceCasing.find((x) => x?.id === conference);

export const getConferenceCasingBySlug = (conference: string) => conferenceCasing.find((x) => x?.slug === conference);

export const getConferenceContractData = (conference: string, season: string) => {
  return contractData
    .find((contract) => contract.season === season)
    ?.conferenceData.find((data) => data.id === conference)?.data;
};

export const hasBasketballPostseason = (year: string): boolean => {
  return validSportYears.find((validSportYear) => validSportYear.season === year)?.hasPostseason!;
};

export const hasNoTVGames = (year: string): boolean => {
  return validSportYears.find((validSportYear) => validSportYear.season === year)?.hasNoTVGames!;
};

export const getBasketballSeason = (year: string): string => {
  return `${year.substring(0, 4)}${year.substring(5)}`;
};

export const isBowlGameWeek = (sport: string, contents: WeekInfo[], week: number): boolean => {
  return sport === 'football' && contents[contents.length - 1].week === week;
};

export const isBasketballPostseason = (sport: string, contents: WeekInfo[], week: number): boolean => {
  return sport === 'basketball' && contents.some((x) => x.week === week && x.postseasonInd);
};

export const isFirstWeek = (contents: WeekInfo[], week: number): boolean => {
  return contents[0].week === week;
};

export const isNextWeekBasketballPostseason = (sport: string, contents: WeekInfo[], week: number): boolean => {
  const nextWeek = (week += 1);
  return sport === 'basketball' && contents.some((x) => x.week === nextWeek && x.postseasonInd);
};

export const isNextWeekBowlGameWeek = (sport: string, contents: WeekInfo[], week: number): boolean => {
  const nextWeek = (week += 1);
  return sport === 'football' && contents[contents.length - 1].week === nextWeek;
};

export const shouldShowPpvColumn = (year: string): boolean => {
  return validSportYears.find((x) => x.season === year)?.showPPVColumn!;
};

export const updatedTvOptions = (game: NoTvGame): string => {
  if (game.conference === 'American' && (game.homeTeam === 'Navy' || game.homeTeam === 'Army West Point')) {
    return game.tvOptions.replace(' or ESPN+', ' or CBS Sports Network');
  }

  if (game.conference === 'MWC') {
    if (game.homeTeam === "Hawai'i" || game.visitingTeam === "Hawai'i") {
      return game.tvOptions.replace('MW Network', 'Spectrum PPV');
    }

    if (game.visitingTeam === 'Boise State') {
      return 'CBS or CBS Sports Network';
    }
  }

  if (game.homeTeam === 'Boise State') {
    return 'FOX, FS1 or FS2';
  }
  return game.tvOptions;
};

export const formatGame = (game: TvGame | ConferenceGame): string => {
  let formattedGame = `${game.visitingTeam![0]} ${game.location ? 'vs.' : 'at'} ${game.homeTeam![0]}`;
  for (let i = 1; i < game.visitingTeam!.length; i++) {
    formattedGame += `<br>OR ${game.visitingTeam![i]} ${game.location ? 'vs.' : 'at'} ${game.homeTeam![i]}`;
  }
  return formattedGame;
};

export const formatTime = (timeWithOffset: string) => {
  const easternTime = DateTime.fromISO(timeWithOffset).setZone('America/New_York').toFormat('t');
  return easternTime === '12:00 AM' ? 'TBA' : DateTime.fromISO(timeWithOffset).toLocal().toFormat('t');
};

export const checkAllTextRows = () => {
  const elements = document.querySelectorAll('.checkBoxRow');
  const rows = document.querySelectorAll('tr.gamerow');
  elements.forEach((element: any) => (element.checked = true));
  rows.forEach((row) => {
    row.setAttribute('style', 'background-color: #CCC');
    row.setAttribute('class', 'gamerow DOPrint rowstyle');
  });
};

export const clearAllSelectedTextRows = () => {
  const elements = document.querySelectorAll('.checkBoxRow');
  const rows = document.querySelectorAll('tr.gamerow');
  elements.forEach((element: any) => (element.checked = false));
  rows.forEach((row) => {
    row.setAttribute('style', 'background-color: #FFF');
    row.setAttribute('class', 'gamerow DONTPrint rowstyle');
  });
};
