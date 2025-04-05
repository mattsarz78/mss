import { IContext } from '../../context';
import { DateTime } from 'luxon';
import { DailyTvGamesInput, TvGame } from '../../__generated__/graphql';
import { CommonServiceKey } from '../../database/common';
import { basketball, football } from '__generated__/prisma';

export interface DailyTvGamesArgs {
  input: DailyTvGamesInput;
}

const zeroHour = { hour: 0, minute: 0, seconds: 0, milliseconds: 0 };
const endOfDay = { hour: 4, minute: 59, seconds: 59, milliseconds: 0 };

export const getDailyTvGames = async (
  _1: unknown,
  { input }: DailyTvGamesArgs,
  context: IContext
): Promise<TvGame[] | string> => {
  const startDate = DateTime.fromISO(input.startDate).set(zeroHour).toJSDate();
  const endDate = DateTime.fromISO(input.startDate).plus({ days: 1 }).set(endOfDay).toJSDate();

  try {
    const results = await context.services[CommonServiceKey].getDailyTvGames({
      startDate,
      endDate,
      sport: input.sport
    });

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
      timeWithOffset: result.timewithoffset ? DateTime.fromJSDate(result.timewithoffset).toISO() ?? '' : ''
    }));
  } catch (error: unknown) {
    console.error(`Error fetching daily TV games: ${(error as Error).message}`);
    return (error as Error).message;
  }
};

export default {
  Query: {
    dailyTvGames: getDailyTvGames
  }
};
