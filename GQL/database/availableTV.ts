import { AvailableTvInput } from '__generated__/graphql';
import { Prisma, PrismaClient, AvailableTV } from '../__generated__/prisma';
import { DatabaseService } from './services';

export const AvailableTvServiceKey = Symbol.for('IAvailableTVService');

export interface IAvailableTvService extends DatabaseService<IAvailableTvService> {
  getAvailableTv(request: AvailableTvInput): Promise<AvailableTV[]>;
}

export class AvailableTvService implements IAvailableTvService {
  constructor(private client: PrismaClient | Prisma.TransactionClient) {}
  public async getAvailableTv(request: any): Promise<AvailableTV[]> {
    try {
      return await this.client.availableTV.findMany({
        where: {
          Season: request.season,
          Conference: request.conference,
          Week: request.week
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
