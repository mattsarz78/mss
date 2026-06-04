import { formatTime } from '#utils/dateFormatting.mjs';

interface GameLike {
  visitingTeam?: string | string[];
  homeTeam?: string | string[];
  location?: string;
}

/**
 * Format game matchup information
 * Handles both array and string formats for teams
 * Uses "vs." for home games (with location) and "at" for away games
 */
export const formatGame = (game: GameLike): string => {
  const visiting = Array.isArray(game.visitingTeam) ? game.visitingTeam : [game.visitingTeam];
  const home = Array.isArray(game.homeTeam) ? game.homeTeam : [game.homeTeam];

  return (
    visiting
      ?.map((team, index) => {
        if (!home?.[index]) {
          throw new Error('homeTeam is undefined or mismatched length');
        }
        return `${team} ${game.location ? 'vs.' : 'at'} ${home[index]}`;
      })
      .join('<br />OR ') ?? ''
  );
};

export { formatTime };
