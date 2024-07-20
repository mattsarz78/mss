import { TvGamesInput } from '../__generated__/graphql';
import { Prisma, PrismaClient, Football, Basketball } from '../__generated__/prisma';
import { DatabaseService } from './services';

export const CommonServiceKey = Symbol.for('ICommonService');

export interface ICommonService extends DatabaseService<ICommonService> {
  getTvGames(request: TvGamesInput): Promise<(Football | Basketball)[]>;
  getDailyTvGames(request: any): Promise<(Football | Basketball)[]>;
}

export class CommonService implements ICommonService {
  constructor(private client: PrismaClient | Prisma.TransactionClient) {}

  public getDailyTvGames(request: any): Promise<(Football | Basketball)[]> {
    const criteria = {
      where: {
        Season: request.season,
        MediaIndicator: {
          in: ['T', 'W']
        },
        TimeWithOffset: {
          lte: request.endDate,
          gte: request.startDate
        }
      },
      orderBy: [
        {
          TimeWithOffset: 'asc'
        },
        {
          ListOrder: 'asc'
        }
      ]
    } as any;

    return request.sport === 'football'
      ? this.client.football.findMany(criteria)
      : this.client.basketball.findMany(criteria);
  }

  public getTvGames(request: TvGamesInput): Promise<(Football | Basketball)[]> {
    const criteria = {
      where: {
        Week: request.week,
        Season: request.season,
        MediaIndicator: {
          in: ['T', 'W']
        }
      },
      orderBy: [
        {
          TimeWithOffset: 'asc'
        },
        {
          ListOrder: 'asc'
        }
      ]
    } as any;

    return request.sport === 'football'
      ? this.client.football.findMany(criteria)
      : this.client.basketball.findMany(criteria);
  }

  public transaction(client: Prisma.TransactionClient) {
    return new CommonService(client);
  }
}
