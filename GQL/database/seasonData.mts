import type { DatabaseService } from '#database/services.mjs';
import { PrismaClient, type seasondata } from '#generated/prisma/client.mjs';
import { getCacheAdapter } from '#utils/cache.mjs';
import { DatabaseError } from '#utils/errorHandler.mjs';

export const SeasonServiceKey = Symbol.for('ISeasonService');

export interface ISeasonService extends DatabaseService<ISeasonService> {
  getSeasonData(season: string): Promise<seasondata>;
}

const SEASON_CACHE_MAX = 200;

export class SeasonService implements ISeasonService {
  private client: PrismaClient;
  private cache = getCacheAdapter('seasondata', SEASON_CACHE_MAX);
  private ttlSeconds = Number(process.env.SEASON_CACHE_TTL ?? '0') || undefined;

  constructor(client: PrismaClient) {
    this.client = client;
  }

  public async getSeasonData(season: string): Promise<seasondata> {
    try {
      const data = await this.cache.getOrSet(
        season,
        async () => {
          const response = await this.client.seasondata.findFirst({
            where: { season },
            select: {
              season: true,
              flexScheduleLink: true,
              showPPVColumn: true,
              hasNoTVGames: true,
              independents: true,
              conferenceListBase: true,
              hasPostseason: true
            }
          });
          if (!response) {
            throw new Error(`No data found for season: ${season}`);
          }
          return response as seasondata;
        },
        this.ttlSeconds
      );

      return data as seasondata;
    } catch (error: unknown) {
      throw new DatabaseError('Failed to fetch season data', error as Error);
    }
  }

  public async clearCache(): Promise<void> {
    await this.cache.clear();
  }

  public transaction(client: PrismaClient): SeasonService {
    return new SeasonService(client);
  }
}
