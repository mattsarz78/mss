import type { TvGameData } from '#generated/graphql.mjs';
import { formatNetworkBatch } from '#utils/image.mjs';
import { splitComma } from '#utils/string.mjs';

export interface RawGameResult {
  season: string | null;
  gametitle: string | null;
  visitingteam: string | null;
  hometeam: string | null;
  location: string | null;
  network: string | null;
  networkjpg: string | null;
  coveragenotes: string | null;
  ppv: string | null;
  mediaindicator: string | null;
  timewithoffset: Temporal.Instant | null;
  tvtype?: string | null;
  conference?: string | null;
}

export interface TransformedGame {
  season: string;
  gameTitle: string;
  visitingTeam: string[];
  homeTeam: string[];
  location: string;
  network: string;
  networkJpg: string;
  coverageNotes: string;
  ppv: string;
  mediaIndicator: string;
  timeWithOffset: string;
}

export interface SeasonMetadata {
  showPPVColumn?: boolean;
  hasNoTVGames?: boolean;
  flexScheduleLink?: string | null;
}

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
  results: RawGameResult[],
  season: string,
  seasonData: SeasonMetadata | undefined
): Promise<TvGameData> => {
  // Prepare pairs for batch formatting
  const pairs: Array<{ input: string; season: string }> = [];
  results.forEach((result: RawGameResult) => {
    pairs.push({ input: result.networkjpg ?? '', season });
    pairs.push({ input: result.coveragenotes ?? '', season });
    pairs.push({ input: result.ppv ?? '', season });
  });

  // Batch fetch formatted strings in single operation
  const batch = await formatNetworkBatch(pairs);

  // Transform results to GraphQL format
  const tvGames = results.map((result: RawGameResult) => ({
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
    timeWithOffset: result.timewithoffset ? result.timewithoffset.toString() : ''
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
