import { PrismaClient, weeklydates } from '@generated/prisma/client';
import { DatabaseError } from '@utils/errorHandler';
import { DatabaseService } from '@database/services';

export const WeeklyDatesServiceKey = Symbol.for('IWeeklyDatesService');

export interface IWeeklyDatesService extends DatabaseService<IWeeklyDatesService> {
  getConferenceGames(season: string): Promise<weeklydates[]>;
}

export class WeeklyDatesService implements IWeeklyDatesService {
  constructor(private client: PrismaClient) {}

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
