import type { DatabaseService } from '#database/services.mjs';
import { PrismaClient, type seasondata } from '#generated/prisma/client.mjs';
import { DatabaseError } from '#utils/errorHandler.mjs';

export const SeasonServiceKey = Symbol.for('ISeasonService');

export interface ISeasonService extends DatabaseService<ISeasonService> {
  getSeasonData(season: string): Promise<seasondata>;
}

export class SeasonService implements ISeasonService {
  private client: PrismaClient;

  constructor(client: PrismaClient) {
    this.client = client;
  }

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
