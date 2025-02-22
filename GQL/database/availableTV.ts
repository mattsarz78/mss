import { AvailableTvInput } from '__generated__/graphql';
import { Prisma, PrismaClient, availabletv } from '../__generated__/prisma';
import { DatabaseService } from './services';

export const AvailableTvServiceKey = Symbol.for('IAvailableTVService');

export interface IAvailableTvService extends DatabaseService<IAvailableTvService> {
  getAvailableTv(request: AvailableTvInput): Promise<availabletv[]>;
}

export class AvailableTvService implements IAvailableTvService {
  constructor(private client: PrismaClient | Prisma.TransactionClient) {}
  public async getAvailableTv(request: any): Promise<availabletv[]> {
    try {
      return await this.client.availabletv.findMany({
        where: {
          season: request.season,
          conference: request.conference,
          week: request.week
        }
      });
    } catch (error) {
      console.error('Error fetching available TV:', error);
      throw error;
    }
  }
  public transaction(client: Prisma.TransactionClient): AvailableTvService {
    return new AvailableTvService(client);
  }
}
