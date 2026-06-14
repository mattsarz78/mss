import { type IContext } from '#/context.mjs';
import { CommonServiceKey } from '#database/common.mjs';
import { SeasonServiceKey } from '#database/seasonData.mts';
import { type DailyTvGamesInput, type TvGameData } from '#generated/graphql.mjs';
import { BadRequestError, handleError } from '#utils/errorHandler.mjs';
import { transformTvGamesResponse } from '#utils/tvGamesTransform.mts';

export interface DailyTvGamesArgs {
  input: DailyTvGamesInput;
}

const zeroHour = { hour: 0, minute: 0, second: 0, millisecond: 0 };
const endOfDay = { hour: 4, minute: 59, second: 59, millisecond: 0 };

export const dailyTvGames = async (
  _1: unknown,
  { input }: DailyTvGamesArgs,
  context: IContext
): Promise<TvGameData> => {
  try {
    if (!input.startDate || !input.sport) {
      throw new BadRequestError('Start date and sport are required');
    }

    const inputDate = Temporal.PlainDate.from(input.startDate);

    const startDate = new Date(
      inputDate.toPlainDateTime(zeroHour).toZonedDateTime('UTC').toInstant().epochMilliseconds
    );
    const endDate = new Date(
      inputDate.add({ days: 1 }).toPlainDateTime(endOfDay).toZonedDateTime('UTC').toInstant().epochMilliseconds
    );

    // Fetch daily games first to get season
    const results = await context.services[CommonServiceKey].getDailyTvGames({
      startDate,
      endDate,
      sport: input.sport
    });

    // If no results, return empty response
    if (results.length === 0) {
      return { showPPVColumn: false, hasNoTVGames: false, flexScheduleLink: undefined, tvGames: [] };
    }

    // Only fetch season data if we have results; use empty string for season in cache key
    const season = results[0].season ?? '';
    const seasonData = await context.services[SeasonServiceKey].getSeasonData(season);

    // Transform results using shared utility
    return transformTvGamesResponse(results, season, seasonData);
  } catch (err: unknown) {
    throw handleError(err);
  }
};
