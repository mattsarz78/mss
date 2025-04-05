import { IContext } from '../../context';
import { DateTime } from 'luxon';
import { TvGame, TvGamesInput } from '../../__generated__/graphql';
import { CommonServiceKey } from '../../database/common';
import { basketball, football } from '__generated__/prisma';

export interface TvGamesArgs {
  input: TvGamesInput;
}

export const getTvGames = async (
  _1: unknown,
  { input }: TvGamesArgs,
  context: IContext
): Promise<TvGame[] | string> => {
  try {
    const results = await context.services[CommonServiceKey].getTvGames(input);

    return results.map((result: football | basketball) => ({
      season: result.season?.trim() ?? '',
      gameTitle: result.gametitle?.trim() ?? '',
      visitingTeam: result.visitingteam?.trim().split(',') ?? [],
      homeTeam: result.hometeam?.trim().split(',') ?? [],
      location: result.location?.trim() ?? '',
      network: result.network?.trim() ?? '',
      networkJpg: result.networkjpg ?? '',
      coverageNotes: result.coveragenotes?.trim() ?? '',
      ppv: result.ppv?.trim() ?? '',
      mediaIndicator: result.mediaindicator?.trim() ?? '',
      timeWithOffset: result.timewithoffset ? (DateTime.fromJSDate(result.timewithoffset).toISO() ?? '') : ''
    }));
  } catch (error: unknown) {
    console.error(`Error fetching TV games: ${(error as Error).message}`);
    return (error as Error).message;
  }
};

export default {
  Query: {
    tvGames: getTvGames
  }
};
