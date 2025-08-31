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

export const dailyTvGames = async (_1: unknown, { input }: DailyTvGamesArgs, context: IContext): Promise<TvGameData> => {
  try {
    if (!input.startDate || !input.sport) {
      throw new BadRequestError('Start date and sport are required');
    }

    const dateTimeEast = DateTime.now().setZone('America/New_York');

    const startDate = dateTimeEast.hour <= 4 ? DateTime.fromISO(input.startDate).minus({ days: 1}).set(zeroHour).toJSDate() : DateTime.fromISO(input.startDate).set(zeroHour).toJSDate();
    const endDate = dateTimeEast.hour <= 4 ? DateTime.fromISO(input.startDate).set(endOfDay).toJSDate():  DateTime.fromISO(input.startDate).plus({ days: 1 }).set(endOfDay).toJSDate();

    const results = await context.services[CommonServiceKey].getDailyTvGames({
      startDate,
      endDate,
      sport: input.sport
    });

    const seasonDataResult = await context.services[SeasonServiceKey].getSeasonData(results[0].season?.trim() ?? '');

    return {
      showPPVColumn: seasonDataResult.showPPVColumn,
      hasNoTVGames: seasonDataResult.hasNoTVGames,
      flexScheduleLink: seasonDataResult.flexScheduleLink,
      tvGames: results.map((result: football | basketball) => ({
        season: result.season?.trim() ?? '',
        gameTitle: result.gametitle?.trim() ?? '',
        visitingTeam: result.visitingteam?.trim().split(',') ?? [],
        homeTeam: result.hometeam?.trim().split(',') ?? [],
        location: result.location?.trim() ?? '',
        network: result.network?.trim() ?? '',
        networkJpg: formatNetworkJpgAndCoverage(result.networkjpg?.trim() ?? '', ''),
        coverageNotes: formatNetworkJpgAndCoverage(result.coveragenotes?.trim() ?? '', ''),
        ppv: formatNetworkJpgAndCoverage(result.ppv?.trim() ?? '', ''),
        mediaIndicator: result.mediaindicator?.trim() ?? '',
        timeWithOffset: result.timewithoffset ? (DateTime.fromJSDate(result.timewithoffset).toISO() ?? '') : ''
      }))
    }
  } catch (err: unknown) {
    throw handleError(err);
  }
};
