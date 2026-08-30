import type { DatabaseService } from '#database/base.mjs';
import type { Contract } from '#generated/prisma/contract.d.js';
import { getCacheAdapter } from '#utils/cache.mjs';
import { DatabaseError } from '#utils/errorHandler.mjs';
import type postgres from '@prisma/orm-postgres/runtime';

export const SeasonServiceKey = Symbol.for('ISeasonService');

export interface SeasonData {
  season: string;
  flexScheduleLink: string | null;
  showPPVColumn: boolean;
  hasNoTVGames: boolean;
  independents: string | null;
  conferenceListBase: string | null;
  hasPostseason: boolean;
}

export interface ISeasonService extends DatabaseService<ISeasonService> {
  getSeasonData(season: string): Promise<SeasonData>;
}

const SEASON_CACHE_MAX = 200;

export class SeasonService implements ISeasonService {
  private client: ReturnType<typeof postgres<Contract>>;
  private cache = getCacheAdapter('seasondata', SEASON_CACHE_MAX);
  private ttlSeconds = Number(process.env.SEASON_CACHE_TTL ?? '0') || undefined;

  constructor(client: ReturnType<typeof postgres<Contract>>) {
    this.client = client;
  }

  public async getSeasonData(season: string): Promise<SeasonData> {
    try {
      const data = await this.cache.getOrSet(
        season,
        async () => {
          const response = await this.client.orm.mattsarzsports.seasondata
            .where((row) => row.season.eq(season))
            .select(
              'season',
              'flexScheduleLink',
              'showPPVColumn',
              'hasNoTVGames',
              'independents',
              'conferenceListBase',
              'hasPostseason'
            )
            .first();
          if (!response) {
            throw new Error(`No data found for season: ${season}`);
          }
          return response;
        },
        this.ttlSeconds
      );

      return data as SeasonData;
    } catch (error: unknown) {
      throw new DatabaseError('Failed to fetch season data', error as Error);
    }
  }

  public async clearCache(): Promise<void> {
    await this.cache.clear();
  }

  public transaction(client: ReturnType<typeof postgres<Contract>>): SeasonService {
    return new SeasonService(client);
  }
}
