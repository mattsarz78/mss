import type { TvGameData } from '#generated/graphql.mjs';
import type { basketball, football, seasondata } from '#generated/prisma/client.mjs';
import { formatNetworkBatch } from '#utils/image.mjs';
import { splitComma } from '#utils/string.mjs';

/**
 * Transform raw TV game results into formatted GraphQL response
 * Shared logic between tvGames and dailyTvGames resolvers
 *
 * @param results - Raw game results from database
 * @param season - Season identifier for batch formatting cache key
 * @param seasonData - Season metadata (showPPVColumn, hasNoTVGames, etc)
 * @returns Formatted TvGameData response ready for GraphQL
 */
export const transformTvGamesResponse = async (
  results: (football | basketball)[],
  season: string,
  seasonData: Partial<seasondata> | undefined
): Promise<TvGameData> => {
  // Prepare pairs for batch formatting
  const pairs: Array<{ input: string; season: string }> = [];
  results.forEach((result: football | basketball) => {
    pairs.push({ input: result.networkjpg ?? '', season });
    pairs.push({ input: result.coveragenotes ?? '', season });
    pairs.push({ input: result.ppv ?? '', season });
  });

  // Batch fetch formatted strings in single operation
  const batch = await formatNetworkBatch(pairs);

  // Transform results to GraphQL format
  const tvGames = results.map((result: football | basketball) => ({
    season: result.season ?? '',
    gameTitle: result.gametitle ?? '',
    visitingTeam: splitComma(result.visitingteam ?? ''),
    homeTeam: splitComma(result.hometeam ?? ''),
    location: result.location ?? '',
    network: result.network ?? '',
    networkJpg: batch.get(`${result.networkjpg ?? ''}::${season}`) ?? '',
    coverageNotes: batch.get(`${result.coveragenotes ?? ''}::${season}`) ?? '',
    ppv: batch.get(`${result.ppv ?? ''}::${season}`) ?? '',
    mediaIndicator: result.mediaindicator ?? '',
    timeWithOffset: result.timewithoffset ? result.timewithoffset.toISOString() : ''
  }));

  // Build response with season metadata
  const response: TvGameData = {
    showPPVColumn: seasonData?.showPPVColumn ?? false,
    hasNoTVGames: seasonData?.hasNoTVGames ?? false,
    tvGames
  };

  // Add flexScheduleLink if available (dailyTvGames only)
  if (seasonData?.flexScheduleLink !== undefined) {
    response.flexScheduleLink = seasonData.flexScheduleLink;
  }

  return response;
};
