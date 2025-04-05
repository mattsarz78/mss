import { Prisma, PrismaClient, weeklydates } from '../__generated__/prisma';
import { DatabaseService } from './services';

export const WeeklyDatesServiceKey = Symbol.for('IWeeklyDatesService');

export interface IWeeklyDatesService extends DatabaseService<IWeeklyDatesService> {
  getConferenceGames(season: string): Promise<weeklydates[]>;
}

export class WeeklyDatesService implements IWeeklyDatesService {
  constructor(private client: PrismaClient | Prisma.TransactionClient) {}

  public async getConferenceGames(season: string): Promise<weeklydates[]> {
    try {
      return await this.client.weeklydates.findMany({ where: { season: season }, orderBy: { week: 'asc' } });
    } catch (error) {
      console.error(`Error fetching conference games for season: ${season}`, error);
      throw error;
    }
  }

  public transaction(client: Prisma.TransactionClient): WeeklyDatesService {
    return new WeeklyDatesService(client);
  }
}
