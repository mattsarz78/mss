import { Prisma, PrismaClient, RSNList } from '../__generated__/prisma';
import { DatabaseService } from './services';

export const RsnListServiceKey = Symbol.for('IRsnListService');

export interface IRsnListService extends DatabaseService<IRsnListService> {
  getRsnList(request: any): Promise<RSNList[]>;
}

export class RsnListService implements IRsnListService {
  constructor(private client: PrismaClient | Prisma.TransactionClient) {}
  public async getRsnList(season: string): Promise<RSNList[]> {
    try {
      return await this.client.rSNList.findMany({
        where: {
          Season: season
        }
      });
    } catch (error) {
      console.error('Error fetching RSN list:', error);
      throw error;
    }
  }
  public transaction(client: Prisma.TransactionClient) {
    return new RsnListService(client);
  }
}
