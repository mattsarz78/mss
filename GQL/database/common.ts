import { TvGamesInput } from '../__generated__/graphql';
import { Prisma, PrismaClient, football, basketball } from '../__generated__/prisma';
import { DatabaseService } from './services';
import { DatabaseError } from '../utils/errorHandler';

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

type SportType = 'football' | 'basketball';
type FindManyArgs<T extends SportType> = T extends 'football'
  ? Prisma.footballFindManyArgs
  : Prisma.basketballFindManyArgs;

export class CommonService implements ICommonService {
  constructor(private client: PrismaClient) {}

  private buildCriteria<T extends SportType>(
    request: GetDailyTvGamesRequest | TvGamesInput,
    isDaily: boolean
  ): FindManyArgs<T> {
    const where = { mediaindicator: { in: ['T', 'W'] as const } };

    if (isDaily) {
      const dailyRequest = request as GetDailyTvGamesRequest;
      Object.assign(where, { timewithoffset: { gte: dailyRequest.startDate, lte: dailyRequest.endDate } });
    } else {
      const weeklyRequest = request as TvGamesInput;
      Object.assign(where, { season: weeklyRequest.season, week: weeklyRequest.week });
    }

    return { where, orderBy: [{ timewithoffset: 'asc' }, { listorder: 'asc' } as const] } as unknown as FindManyArgs<T>;
  }

  public async getDailyTvGames(request: GetDailyTvGamesRequest): Promise<(football | basketball)[]> {
    try {
      const criteria =
        request.sport === 'football'
          ? this.buildCriteria<'football'>(request, true)
          : this.buildCriteria<'basketball'>(request, true);

      return request.sport === 'football'
        ? await this.client.football.findMany(criteria as Prisma.footballFindManyArgs)
        : await this.client.basketball.findMany(criteria as Prisma.basketballFindManyArgs);
    } catch (error) {
      throw new DatabaseError('Failed to fetch daily TV games', error as Error);
    }
  }

  public async getTvGames(request: TvGamesInput): Promise<(football | basketball)[]> {
    try {
      const criteria =
        request.sport === 'football'
          ? this.buildCriteria<'football'>(request, false)
          : this.buildCriteria<'basketball'>(request, false);

      return request.sport === 'football'
        ? await this.client.football.findMany(criteria as Prisma.footballFindManyArgs)
        : await this.client.basketball.findMany(criteria as Prisma.basketballFindManyArgs);
    } catch (error) {
      throw new DatabaseError('Failed to fetch TV games', error as Error);
    }
  }

  public transaction(client: PrismaClient): CommonService {
    return new CommonService(client);
  }
}
