import { Prisma, PrismaClient, AvailableTV } from '../__generated__/prisma';
import { DatabaseService } from './services';

export const AvailableTvServiceKey = Symbol.for('IAvailableTVService');

export interface IAvailableTvService extends DatabaseService<IAvailableTvService> {
  getAvailableTv(request: any): Promise<AvailableTV[]>;
}

export class AvailableTvService implements IAvailableTvService {
  constructor(private client: PrismaClient | Prisma.TransactionClient) {}
  public getAvailableTv(request: any): Promise<AvailableTV[]> {
    return this.client.availableTV.findMany({
      where: {
        Season: request.season,
        Conference: request.conference,
        Week: request.week
      }
    });
  }
  public transaction(client: Prisma.TransactionClient) {
    return new AvailableTvService(client);
  }
}
