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
      return await this.client.seasondata.findFirstOrThrow({ where: { season } });
    } catch (error: unknown) {
      throw new DatabaseError('Failed to fetch season data', error as Error);
    }
  }

  public transaction(client: PrismaClient): SeasonService {
    return new SeasonService(client);
  }
}
