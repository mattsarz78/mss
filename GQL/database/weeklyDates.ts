import { Prisma, PrismaClient, WeeklyDates } from '../__generated__/prisma';
import { DatabaseService } from './services';

export const WeeklyDatesServiceKey = Symbol.for('IWeeklyDatesService');

export interface IWeeklyDatesService extends DatabaseService<IWeeklyDatesService> {
  getConferenceGames(request: any): Promise<WeeklyDates[]>;
}

export class WeeklyDatesService implements IWeeklyDatesService {
  constructor(private client: PrismaClient | Prisma.TransactionClient) {}
  public getConferenceGames(season: string): Promise<WeeklyDates[]> {
    return this.client.weeklyDates.findMany({
      where: {
        Season: season
      },
      orderBy: {
        Week: 'asc'
      }
    });
  }
  public transaction(client: Prisma.TransactionClient) {
    return new WeeklyDatesService(client);
  }
}
