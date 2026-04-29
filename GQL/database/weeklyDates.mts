import type { DatabaseService } from '#database/services.mjs';
import { PrismaClient, type weeklydates } from '#generated/prisma/client.mjs';
import { getCacheAdapter } from '#utils/cache.mjs';
import { DatabaseError } from '#utils/errorHandler.mjs';

export const WeeklyDatesServiceKey = Symbol.for('IWeeklyDatesService');

export interface IWeeklyDatesService extends DatabaseService<IWeeklyDatesService> {
  getConferenceGames(season: string): Promise<weeklydates[]>;
}

const WEEKLYDATES_CACHE_MAX = 200;

export class WeeklyDatesService implements IWeeklyDatesService {
  private client: PrismaClient;
  private cache = getCacheAdapter('weeklydates', WEEKLYDATES_CACHE_MAX);
  private ttlSeconds = Number(process.env.WEEKLYDATES_CACHE_TTL ?? '0') || undefined;

  constructor(client: PrismaClient) {
    this.client = client;
  }

  public async getConferenceGames(season: string): Promise<weeklydates[]> {
    try {
      const data = await this.cache.getOrSet(
        season,
        async () => {
          return await this.client.weeklydates.findMany({
            where: { season },
            select: { season: true, week: true, startdate: true, enddate: true, postseasonind: true },
            orderBy: { week: 'asc' }
          });
        },
        this.ttlSeconds
      );

      return data as weeklydates[];
    } catch (error) {
      throw new DatabaseError('Failed to fetch weekly dates', error as Error);
    }
  }

  public async clearCache(): Promise<void> {
    await this.cache.clear();
  }

  public transaction(client: PrismaClient): WeeklyDatesService {
    return new WeeklyDatesService(client);
  }
}
