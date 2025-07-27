import { type DatabaseService } from '#database/services.mjs';
import { type AvailableTvInput } from '#generated/graphql.mjs';
import { PrismaClient, type availabletv } from '#generated/prisma/client.mjs';
import { DatabaseError } from '#utils/errorHandler.mjs';

export const AvailableTvServiceKey = Symbol.for('IAvailableTvService');

export interface IAvailableTvService extends DatabaseService<IAvailableTvService> {
  getAvailableTv(request: AvailableTvInput): Promise<availabletv[]>;
}

export class AvailableTvService implements IAvailableTvService {
  private client: PrismaClient;

  constructor(client: PrismaClient) {
    this.client = client;
  }

  public async getAvailableTv(request: AvailableTvInput): Promise<availabletv[]> {
    try {
      return await this.client.availabletv.findMany({
        where: { season: request.season, conference: request.conference, week: request.week }
      });
    } catch (error) {
      throw new DatabaseError('Failed to fetch available TV listings', error as Error);
    }
  }

  public transaction(client: PrismaClient): AvailableTvService {
    return new AvailableTvService(client);
  }
}
