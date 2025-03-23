import { PrismaClient, rsnlist } from '../__generated__/prisma';
import { DatabaseService } from './services';

export const RsnListServiceKey = Symbol.for('IRsnListService');

export interface IRsnListService extends DatabaseService<IRsnListService> {
  getRsnList(season: string): Promise<rsnlist[]>;
}

export class RsnListService implements IRsnListService {
  constructor(private client: PrismaClient) {}

  public async getRsnList(season: string): Promise<rsnlist[]> {
    try {
      return await this.client.rsnlist.findMany({
        where: {
          season: season
        }
      });
    } catch (error) {
      console.error(`Error fetching RSN list for season: ${season}`, error);
      throw error;
    }
  }

  public transaction(client: PrismaClient): RsnListService {
    return new RsnListService(client);
  }
}
