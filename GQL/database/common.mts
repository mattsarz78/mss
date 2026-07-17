import { type DatabaseService } from '#database/services.mjs';
import { type TvGamesInput } from '#generated/graphql.mjs';
import { Prisma, PrismaClient, type basketball, type football } from '#generated/prisma/client.mjs';
import { DatabaseError } from '#utils/errorHandler.mjs';

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

type WhereClause = {
  mediaindicator: { in: readonly ['T', 'W'] };
  time?: { gte: Date; lte: Date };
  season?: string | number;
  week?: string | number;
};

export class CommonService implements ICommonService {
  private client: PrismaClient;

  constructor(client: PrismaClient) {
    this.client = client;
  }

  private buildCriteria<T extends SportType>(
    request: GetDailyTvGamesRequest | TvGamesInput,
    isDaily: boolean
  ): FindManyArgs<T> {
    const where: WhereClause = { mediaindicator: { in: ['T', 'W'] as const } };

    if (isDaily) {
      const dailyRequest = request as GetDailyTvGamesRequest;
      where.time = { gte: dailyRequest.startDate, lte: dailyRequest.endDate };
    } else {
      const weeklyRequest = request as TvGamesInput;
      where.season = weeklyRequest.season;
      where.week = weeklyRequest.week;
    }

    const select = {
      gametitle: true,
      visitingteam: true,
      hometeam: true,
      location: true,
      timewithoffset: true,
      mediaindicator: true,
      network: true,
      networkjpg: true,
      coveragenotes: true,
      ppv: true,
      tvtype: true,
      conference: true,
      ...(isDaily && { season: true })
    } satisfies Record<string, boolean>;

    return {
      where,
      orderBy: [{ timewithoffset: 'asc' }, { listorder: 'asc' } as const],
      select
    } as unknown as FindManyArgs<T>;
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
