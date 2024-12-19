import { TvGamesInput } from '../__generated__/graphql';
import { Prisma, PrismaClient, Football, Basketball } from '../__generated__/prisma';
import { DatabaseService } from './services';

export const CommonServiceKey = Symbol.for('ICommonService');

export interface ICommonService extends DatabaseService<ICommonService> {
  getTvGames(request: TvGamesInput): Promise<(Football | Basketball)[]>;
  getDailyTvGames(request: GetDailyTvGamesRequest): Promise<(Football | Basketball)[]>;
}

export interface GetDailyTvGamesRequest {
  sport: string;
  startDate: Date;
  endDate: Date;
}

export class CommonService implements ICommonService {
  constructor(private client: PrismaClient | Prisma.TransactionClient) {}

  public async getDailyTvGames(request: GetDailyTvGamesRequest): Promise<(Football | Basketball)[]> {
    const criteria = {
      where: {
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
          TimeWithOffset: Prisma.SortOrder.asc
        },
        {
          ListOrder: Prisma.SortOrder.asc
        }
      ]
    };

    try {
      return request.sport === 'football'
        ? await this.client.football.findMany(criteria)
        : await this.client.basketball.findMany(criteria);
    } catch (error) {
      console.error('Error fetching daily TV games:', error);
      throw error;
    }
  }

  public async getTvGames(request: TvGamesInput): Promise<(Football | Basketball)[]> {
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
          TimeWithOffset: Prisma.SortOrder.asc
        },
        {
          ListOrder: Prisma.SortOrder.asc
        }
      ]
    };

    try {
      return request.sport === 'football'
        ? await this.client.football.findMany(criteria)
        : await this.client.basketball.findMany(criteria);
    } catch (error) {
      console.error('Error fetching TV games:', error);
      throw error;
    }
  }

  public transaction(client: Prisma.TransactionClient): CommonService {
    return new CommonService(client);
  }
}
