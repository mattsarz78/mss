import { DateTime } from 'luxon';
import type { TvGame, ConferenceGame, WeekInfo } from '../graphQl';

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
