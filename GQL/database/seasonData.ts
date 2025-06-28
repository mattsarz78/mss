import { PrismaClient, seasondata } from '../__generated__/prisma/client';
import { DatabaseError } from '../utils/errorHandler';
import { DatabaseService } from './services';

export const SeasonServiceKey = Symbol.for('ISeasonService');

export interface ISeasonService extends DatabaseService<ISeasonService> {
  getSeasonData(season: string): Promise<seasondata>;
}

export class SeasonService implements ISeasonService {
  constructor(private client: PrismaClient) {}

  public async getSeasonData(season: string): Promise<seasondata> {
    try {
      const response = await this.client.seasondata.findFirst({ where: { season } });
      if (!response) {
        throw new Error(`No data found for season: ${season}`);
      }
      return response;
    } catch (error: unknown) {
      throw new DatabaseError('Failed to fetch season data', error as Error);
    }
  }

  public transaction(client: PrismaClient): SeasonService {
    return new SeasonService(client);
  }
}
