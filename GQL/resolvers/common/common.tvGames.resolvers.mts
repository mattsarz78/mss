import type { IContext } from '#/context.mjs';
import { CommonServiceKey } from '#database/common.mjs';
import { SeasonServiceKey } from '#database/seasonData.mjs';
import type { TvGameData, TvGamesInput } from '#generated/graphql.mjs';
import type { basketball, football } from '#generated/prisma/client.mjs';
import { BadRequestError, handleError } from '#utils/errorHandler.mjs';
import { formatNetworkBatch } from '#utils/image.mjs';
import { splitComma } from '#utils/string.mjs';

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

    // Batch fetch formatted strings to avoid many concurrent promises and reduce Redis/CPU load
    const pairs: Array<{ input: string; season: string }> = [];
    results.forEach((result: football | basketball) => {
      pairs.push({ input: result.networkjpg ?? '', season: input.season });
      pairs.push({ input: result.coveragenotes ?? '', season: input.season });
      pairs.push({ input: result.ppv ?? '', season: input.season });
    });

    const batch = await formatNetworkBatch(pairs);

    const tvGames = results.map((result: football | basketball) => ({
      season: result.season ?? '',
      gameTitle: result.gametitle ?? '',
      visitingTeam: splitComma(result.visitingteam ?? ''),
      homeTeam: splitComma(result.hometeam ?? ''),
      location: result.location ?? '',
      network: result.network ?? '',
      networkJpg: batch.get(`${result.networkjpg ?? ''}::${input.season}`) ?? '',
      coverageNotes: batch.get(`${result.coveragenotes ?? ''}::${input.season}`) ?? '',
      ppv: batch.get(`${result.ppv ?? ''}::${input.season}`) ?? '',
      mediaIndicator: result.mediaindicator ?? '',
      timeWithOffset: result.timewithoffset ? result.timewithoffset.toISOString() : ''
    }));

    const response = {
      showPPVColumn: seasonDataResult.showPPVColumn,
      hasNoTVGames: seasonDataResult.hasNoTVGames,
      tvGames
    };

    return response;
  } catch (err: unknown) {
    throw handleError(err);
  }
};
