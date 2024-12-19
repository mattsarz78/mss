import { Prisma, PrismaClient, WeeklyDates } from '../__generated__/prisma';
import { DatabaseService } from './services';

export const WeeklyDatesServiceKey = Symbol.for('IWeeklyDatesService');

export interface IWeeklyDatesService extends DatabaseService<IWeeklyDatesService> {
  getConferenceGames(request: any): Promise<WeeklyDates[]>;
}

export class WeeklyDatesService implements IWeeklyDatesService {
  constructor(private client: PrismaClient | Prisma.TransactionClient) {}
  public async getConferenceGames(season: string): Promise<WeeklyDates[]> {
    try {
      return await this.client.weeklyDates.findMany({
        where: {
          Season: season
        },
        orderBy: {
          Week: 'asc'
        }
      });
    } catch (error) {
      console.error('Error fetching conference games:', error);
      throw error;
    }
  }
  public transaction(client: Prisma.TransactionClient) {
    return new WeeklyDatesService(client);
  }
}
