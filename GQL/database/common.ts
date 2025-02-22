import { TvGamesInput } from '../__generated__/graphql';
import { Prisma, PrismaClient, football, basketball } from '../__generated__/prisma';
import { DatabaseService } from './services';

export const CommonServiceKey = Symbol.for('ICommonService');

export interface ICommonService extends DatabaseService<ICommonService> {
  getTvGames(request: TvGamesInput): Promise<(football | basketball)[]>;
  getDailyTvGames(request: GetDailyTvGamesRequest): Promise<(football | basketball)[]>;
}

export interface GetDailyTvGamesRequest {
  sport: string;
  startDate: Date;
  endDate: Date;
}

export class CommonService implements ICommonService {
  constructor(private client: PrismaClient | Prisma.TransactionClient) {}

  public async getDailyTvGames(request: GetDailyTvGamesRequest): Promise<(football | basketball)[]> {
    const criteria = {
      where: {
        mediaindicator: {
          in: ['T', 'W']
        },
        timewithoffset: {
          lte: request.endDate,
          gte: request.startDate
        }
      },
      orderBy: [
        {
          timewithoffset: Prisma.SortOrder.asc
        },
        {
          listorder: Prisma.SortOrder.asc
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

  public async getTvGames(request: TvGamesInput): Promise<(football | basketball)[]> {
    const criteria = {
      where: {
        week: request.week,
        season: request.season,
        mediaindicator: {
          in: ['T', 'W']
        }
      },
      orderBy: [
        {
          timewithoffset: Prisma.SortOrder.asc
        },
        {
          listorder: Prisma.SortOrder.asc
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
