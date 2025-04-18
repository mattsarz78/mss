import { AvailableTvInput } from '../__generated__/graphql';
import { PrismaClient, availabletv } from '../__generated__/prisma';
import { DatabaseService } from './services';
import { DatabaseError } from '../utils/errorHandler';

export const AvailableTvServiceKey = Symbol.for('IAvailableTvService');

export interface IAvailableTvService extends DatabaseService<IAvailableTvService> {
  getAvailableTv(request: AvailableTvInput): Promise<availabletv[]>;
}

export class AvailableTvService implements IAvailableTvService {
  constructor(private client: PrismaClient) {}

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
