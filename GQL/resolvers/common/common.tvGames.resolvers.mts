import type { IContext } from '#/context.mjs';
import { CommonServiceKey } from '#database/common.mjs';
import { SeasonServiceKey } from '#database/seasonData.mjs';
import type { TvGameData, TvGamesInput } from '#generated/graphql.mjs';
import type { basketball, football } from '#generated/prisma/client.mjs';
import { BadRequestError, handleError } from '#utils/errorHandler.mjs';
import { formatNetworkJpgAndCoverage } from '#utils/image.mjs';
import { DateTime } from 'luxon';

export interface TvGamesArgs {
  input: TvGamesInput;
}

export const tvGames = async (_1: unknown, { input }: TvGamesArgs, context: IContext): Promise<TvGameData> => {
  try {
    if (!input.season || !input.sport || (!input.week && input.week !== 0)) {
      throw new BadRequestError('Season, sport, and week are required');
    }
    const seasonDataResult = await context.services[SeasonServiceKey].getSeasonData(input.season);
    const results = await context.services[CommonServiceKey].getTvGames(input);

    const response = {
      showPPVColumn: seasonDataResult.showPPVColumn,
      hasNoTVGames: seasonDataResult.hasNoTVGames,
      tvGames: results.map((result: football | basketball) => ({
        season: result.season?.trim() ?? '',
        gameTitle: result.gametitle?.trim() ?? '',
        visitingTeam: result.visitingteam?.trim().split(',') ?? [],
        homeTeam: result.hometeam?.trim().split(',') ?? [],
        location: result.location?.trim() ?? '',
        network: result.network?.trim() ?? '',
        networkJpg: formatNetworkJpgAndCoverage(result.networkjpg?.trim() ?? '', input.season),
        coverageNotes: formatNetworkJpgAndCoverage(result.coveragenotes?.trim() ?? '', input.season),
        ppv: formatNetworkJpgAndCoverage(result.ppv?.trim() ?? '', input.season),
        mediaIndicator: result.mediaindicator?.trim() ?? '',
        timeWithOffset: result.timewithoffset ? (DateTime.fromJSDate(result.timewithoffset).toISO() ?? '') : ''
      }))
    };

    return response;
  } catch (err: unknown) {
    throw handleError(err);
  }
};
