import type { ConferenceGame, TvGame } from '#/graphQl.mjs';
import { formatTime } from '#utils/dateFormatting.mts';

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

export { formatTime };
