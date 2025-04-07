import { DateTime } from 'luxon';
import type { NoTvGame, TvGame, ConferenceGame, WeekInfo } from '../graphQl';

export const updatedTvOptions = (game: NoTvGame): string => {
  const conferenceOptions: Record<string, (game: NoTvGame) => string> = {
    American: (game) =>
      game.homeTeam === 'Navy' || game.homeTeam === 'Army West Point'
        ? game.tvOptions.replace(' or ESPN+', ' or CBS Sports Network')
        : game.tvOptions,
    MWC: (game) => {
      if (game.homeTeam === "Hawai'i" || game.visitingTeam === "Hawai'i") {
        return game.tvOptions.replace('MW Network', 'Spectrum PPV');
      }
      if (game.visitingTeam === 'Boise State') {
        return 'CBS or CBS Sports Network';
      }
      return game.homeTeam === 'Boise State' ? 'FOX, FS1 or FS2' : game.tvOptions;
    }
  };

  const conferenceOption = conferenceOptions[game.conference];
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return conferenceOption ? conferenceOption(game) : game.tvOptions;
};

export const formatGame = (game: TvGame | ConferenceGame): string => {
  return (
    game.visitingTeam
      ?.map((team, index) => {
        if (!game.homeTeam) {
          throw new Error('homeTeam is undefined');
        }
        return `${team} ${game.location ? 'vs.' : 'at'} ${game.homeTeam[index]}`;
      })
      .join('<br>OR ') ?? ''
  );
};

export const formatTime = (timeWithOffset: string): string => {
  const easternTime = DateTime.fromISO(timeWithOffset).setZone('America/New_York').toFormat('t');
  return easternTime === '12:00 AM' ? 'TBA' : DateTime.fromISO(timeWithOffset).toLocal().toFormat('t');
};

export const isBowlGameWeek = (sport: string, contents: WeekInfo[], week: number): boolean => {
  return sport === 'football' && contents[contents.length - 1].week === week;
};

export const isBasketballPostseason = (sport: string, contents: WeekInfo[], week: number): boolean => {
  return sport === 'basketball' && contents.some((x) => x.week === week && x.postseasonInd);
};
