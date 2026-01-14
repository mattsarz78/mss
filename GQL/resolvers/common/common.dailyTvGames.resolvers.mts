import { type IContext } from '#/context.mjs';
import { CommonServiceKey } from '#database/common.mjs';
import { SeasonServiceKey } from '#database/seasonData.mts';
import { type DailyTvGamesInput, type TvGameData } from '#generated/graphql.mjs';
import { type basketball, type football } from '#generated/prisma/client.mjs';
import { BadRequestError, handleError } from '#utils/errorHandler.mjs';
import { formatNetworkBatch } from '#utils/image.mjs';
import { splitComma } from '#utils/string.mjs';
import { DateTime } from 'luxon';

export interface DailyTvGamesArgs {
  input: DailyTvGamesInput;
}

const zeroHour = { hour: 0, minute: 0, seconds: 0, milliseconds: 0 };
const endOfDay = { hour: 4, minute: 59, seconds: 59, milliseconds: 0 };

export const dailyTvGames = async (
  _1: unknown,
  { input }: DailyTvGamesArgs,
  context: IContext
): Promise<TvGameData> => {
  try {
    if (!input.startDate || !input.sport) {
      throw new BadRequestError('Start date and sport are required');
    }

    const startDate = DateTime.fromISO(input.startDate).set(zeroHour).toJSDate();
    const endDate = DateTime.fromISO(input.startDate).plus({ days: 1 }).set(endOfDay).toJSDate();

    const results = await context.services[CommonServiceKey].getDailyTvGames({
      startDate,
      endDate,
      sport: input.sport
    });

    let seasonDataResult;
    if (results.length !== 0) {
      const season = results[0].season ?? '';
      seasonDataResult = await context.services[SeasonServiceKey].getSeasonData(season);
    }
    const pairs: Array<{ input: string; season: string }> = [];
    results.forEach((result: football | basketball) => {
      pairs.push({ input: result.networkjpg ?? '', season: '' });
      pairs.push({ input: result.coveragenotes ?? '', season: '' });
      pairs.push({ input: result.ppv ?? '', season: '' });
    });

    const batch = await formatNetworkBatch(pairs);

    const tvGames = results.map((result: football | basketball) => ({
      season: result.season ?? '',
      gameTitle: result.gametitle ?? '',
      visitingTeam: splitComma(result.visitingteam ?? ''),
      homeTeam: splitComma(result.hometeam ?? ''),
      location: result.location ?? '',
      network: result.network ?? '',
      networkJpg: batch.get(`${result.networkjpg ?? ''}::`) ?? '',
      coverageNotes: batch.get(`${result.coveragenotes ?? ''}::`) ?? '',
      ppv: batch.get(`${result.ppv ?? ''}::`) ?? '',
      mediaIndicator: result.mediaindicator ?? '',
      timeWithOffset: result.timewithoffset ? result.timewithoffset.toISOString() : ''
    }));

    return {
      showPPVColumn: seasonDataResult?.showPPVColumn ?? false,
      hasNoTVGames: seasonDataResult?.hasNoTVGames ?? false,
      flexScheduleLink: seasonDataResult?.flexScheduleLink,
      tvGames
    };
  } catch (err: unknown) {
    throw handleError(err);
  }
};
