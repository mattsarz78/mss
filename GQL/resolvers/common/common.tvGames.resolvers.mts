import type { IContext } from '#/context.mjs';
import { CommonServiceKey } from '#database/common.mjs';
import { SeasonServiceKey } from '#database/seasonData.mjs';
import type { TvGameData, TvGamesInput } from '#generated/graphql.mjs';
import type { basketball, football } from '#generated/prisma/client.mjs';
import { BadRequestError, handleError } from '#utils/errorHandler.mjs';
import { formatNetworkJpgAndCoverage } from '#utils/image.mjs';

export interface TvGamesArgs {
  input: TvGamesInput;
}

export const tvGames = async (_1: unknown, { input }: TvGamesArgs, context: IContext): Promise<TvGameData> => {
  try {
    if (!input.season || !input.sport || (!input.week && input.week !== 0)) {
      throw new BadRequestError('Season, sport, and week are required');
    }

    let seasonDataResult = context.seasonDataCache.get(input.season);
    if (!seasonDataResult) {
      seasonDataResult = await context.services[SeasonServiceKey].getSeasonData(input.season);
      context.seasonDataCache.set(input.season, seasonDataResult);
    }
    const results = await context.services[CommonServiceKey].getTvGames(input);

    const response = {
      showPPVColumn: seasonDataResult.showPPVColumn,
      hasNoTVGames: seasonDataResult.hasNoTVGames,
      tvGames: results.map((result: football | basketball) => ({
        season: result.season ?? '',
        gameTitle: result.gametitle ?? '',
        visitingTeam: (result.visitingteam ?? '').split(','),
        homeTeam: (result.hometeam ?? '').split(','),
        location: result.location ?? '',
        network: result.network ?? '',
        networkJpg: formatNetworkJpgAndCoverage(result.networkjpg ?? '', input.season),
        coverageNotes: formatNetworkJpgAndCoverage(result.coveragenotes ?? '', input.season),
        ppv: formatNetworkJpgAndCoverage(result.ppv ?? '', input.season),
        mediaIndicator: result.mediaindicator ?? '',
        timeWithOffset: result.timewithoffset ? result.timewithoffset.toISOString() : ''
      }))
    };

    return response;
  } catch (err: unknown) {
    throw handleError(err);
  }
};
