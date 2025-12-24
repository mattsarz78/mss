import { type IContext } from '#/context.mjs';
import { CommonServiceKey } from '#database/common.mjs';
import { SeasonServiceKey } from '#database/seasonData.mts';
import { type DailyTvGamesInput, type TvGameData } from '#generated/graphql.mjs';
import { type basketball, type football } from '#generated/prisma/client.mjs';
import { BadRequestError, handleError } from '#utils/errorHandler.mjs';
import { formatNetworkJpgAndCoverage } from '#utils/image.mjs';
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
      seasonDataResult = await context.services[SeasonServiceKey].getSeasonData(results[0].season ?? '');
    }
    return {
      showPPVColumn: seasonDataResult?.showPPVColumn ?? false,
      hasNoTVGames: seasonDataResult?.hasNoTVGames ?? false,
      flexScheduleLink: seasonDataResult?.flexScheduleLink,
      tvGames: results.map((result: football | basketball) => ({
        season: result.season ?? '',
        gameTitle: result.gametitle ?? '',
        visitingTeam: (result.visitingteam ?? '').split(','),
        homeTeam: (result.hometeam ?? '').split(','),
        location: result.location ?? '',
        network: result.network ?? '',
        networkJpg: formatNetworkJpgAndCoverage(result.networkjpg ?? '', ''),
        coverageNotes: formatNetworkJpgAndCoverage(result.coveragenotes ?? '', ''),
        ppv: formatNetworkJpgAndCoverage(result.ppv ?? '', ''),
        mediaIndicator: result.mediaindicator ?? '',
        timeWithOffset: result.timewithoffset ? (DateTime.fromJSDate(result.timewithoffset).toISO() ?? '') : ''
      }))
    };
  } catch (err: unknown) {
    throw handleError(err);
  }
};
