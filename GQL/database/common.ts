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
  constructor(private client: PrismaClient) {}

  private buildCriteria(request: GetDailyTvGamesRequest | TvGamesInput, isDaily: boolean) {
    const baseCriteria = {
      where: {
        mediaindicator: {
          in: ['T', 'W']
        },
        timewithoffset: undefined as unknown as {
          lte?: Date;
          gte?: Date;
        },
        season: undefined as unknown as string,
        week: undefined as unknown as number
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

    if (isDaily) {
      baseCriteria.where.timewithoffset = {
        lte: (request as GetDailyTvGamesRequest).endDate,
        gte: (request as GetDailyTvGamesRequest).startDate
      };
    } else {
      baseCriteria.where.week = (request as TvGamesInput).week;
      baseCriteria.where.season = (request as TvGamesInput).season;
    }

    return baseCriteria;
  }

  public async getDailyTvGames(request: GetDailyTvGamesRequest): Promise<(football | basketball)[]> {
    const criteria = this.buildCriteria(request, true);

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
    const criteria = this.buildCriteria(request, false);

    try {
      return request.sport === 'football'
        ? await this.client.football.findMany(criteria)
        : await this.client.basketball.findMany(criteria);
    } catch (error) {
      console.error('Error fetching TV games:', error);
      throw error;
    }
  }

  public transaction(client: PrismaClient): CommonService {
    return new CommonService(client);
  }
}
