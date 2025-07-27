import type { DatabaseService } from '#database/services.mjs';
import { PrismaClient, type weeklydates } from '#generated/prisma/client.mjs';
import { DatabaseError } from '#utils/errorHandler.mjs';

export const WeeklyDatesServiceKey = Symbol.for('IWeeklyDatesService');

export interface IWeeklyDatesService extends DatabaseService<IWeeklyDatesService> {
  getConferenceGames(season: string): Promise<weeklydates[]>;
}

export class WeeklyDatesService implements IWeeklyDatesService {
  private client: PrismaClient;

  constructor(client: PrismaClient) {
    this.client = client;
  }

  public async getConferenceGames(season: string): Promise<weeklydates[]> {
    try {
      return await this.client.weeklydates.findMany({ where: { season }, orderBy: { week: 'asc' } });
    } catch (error) {
      throw new DatabaseError('Failed to fetch weekly dates', error as Error);
    }
  }

  public transaction(client: PrismaClient): WeeklyDatesService {
    return new WeeklyDatesService(client);
  }
}
