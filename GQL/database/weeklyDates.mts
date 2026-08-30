import type { DatabaseService } from '#database/base.mjs';
import type { Contract } from '#generated/prisma/contract.d.js';
import { getCacheAdapter } from '#utils/cache.mjs';
import { DatabaseError } from '#utils/errorHandler.mjs';
import postgres from '@prisma/orm-postgres/runtime';

export const WeeklyDatesServiceKey = Symbol.for('IWeeklyDatesService');

export interface WeeklyDate {
  season: string;
  week: number;
  startdate: string | null;
  enddate: string | null;
  postseasonind: string | null;
}

export interface IWeeklyDatesService extends DatabaseService<IWeeklyDatesService> {
  getWeeklyDates(season: string): Promise<WeeklyDate[]>;
}

const WEEKLYDATES_CACHE_MAX = 200;

export class WeeklyDatesService implements IWeeklyDatesService {
  private client: ReturnType<typeof postgres<Contract>>;
  private cache = getCacheAdapter('weeklydates', WEEKLYDATES_CACHE_MAX);
  private ttlSeconds = Number(process.env.WEEKLYDATES_CACHE_TTL ?? '0') || undefined;

  constructor(client: ReturnType<typeof postgres<Contract>>) {
    this.client = client;
  }

  public async getWeeklyDates(season: string): Promise<WeeklyDate[]> {
    try {
      const data = await this.cache.getOrSet(
        season,
        async () => {
          const results = await this.client.orm.mattsarzsports.weeklydates
            .where((row) => row.season.eq(season))
            .orderBy((row) => row.week.asc())
            .select('season', 'week', 'startdate', 'enddate', 'postseasonind')
            .all();

          return results.map((row) => ({
            ...row,
            startdate: row.startdate ? row.startdate.replace(' ', 'T') + '.000Z' : null,
            enddate: row.enddate ? row.enddate.replace(' ', 'T') + '.000Z' : null
          }));
        },
        this.ttlSeconds
      );

      return data as WeeklyDate[];
    } catch (error) {
      throw new DatabaseError('Failed to fetch weekly dates', error as Error);
    }
  }

  public async clearCache(): Promise<void> {
    await this.cache.clear();
  }

  public transaction(client: ReturnType<typeof postgres<Contract>>): WeeklyDatesService {
    return new WeeklyDatesService(client);
  }
}
