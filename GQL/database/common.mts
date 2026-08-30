import { type DatabaseService } from '#database/base.mjs';
import { type TvGamesInput } from '#generated/graphql.mjs';
import type { Contract } from '#generated/prisma/contract.d.js';
import { DatabaseError } from '#utils/errorHandler.mjs';
import type { RawGameResult } from '#utils/tvGamesTransform.mjs';
import postgres from '@prisma/orm-postgres/runtime';

export const CommonServiceKey = Symbol.for('ICommonService');

export interface ICommonService extends DatabaseService<ICommonService> {
  getTvGames(request: TvGamesInput): Promise<RawGameResult[]>;
  getDailyTvGames(request: GetDailyTvGamesRequest): Promise<RawGameResult[]>;
}

export interface GetDailyTvGamesRequest {
  sport: string;
  startDate: Date;
  endDate: Date;
}

export class CommonService implements ICommonService {
  private client: ReturnType<typeof postgres<Contract>>;

  constructor(client: ReturnType<typeof postgres<Contract>>) {
    this.client = client;
  }

  private toPgDateString(date: Date): Temporal.Instant {
    return Temporal.Instant.fromEpochMilliseconds(date.getTime());
  }

  public async getDailyTvGames(request: GetDailyTvGamesRequest): Promise<RawGameResult[]> {
    try {
      // 1. Dynamically select the model based on sport
      const model =
        request.sport === 'football'
          ? this.client.orm.mattsarzsports.football
          : this.client.orm.mattsarzsports.basketball;

      const startInstant = this.toPgDateString(request.startDate);
      const endInstant = this.toPgDateString(request.endDate);

      // 2. Chain conditions and execute
      return await model
        .where((row) => row.mediaindicator.in(['T', 'W']))
        .where((row) => row.time.gte(startInstant))
        .where((row) => row.time.lte(endInstant))
        .orderBy((row) => row.timewithoffset.asc())
        .orderBy((row) => row.listorder.asc())
        .select(
          'gametitle',
          'visitingteam',
          'hometeam',
          'location',
          'timewithoffset',
          'mediaindicator',
          'network',
          'networkjpg',
          'coveragenotes',
          'ppv',
          'tvtype',
          'conference',
          'season'
        )
        .all();
    } catch (error) {
      throw new DatabaseError('Failed to fetch daily TV games', error as Error);
    }
  }

  public async getTvGames(request: TvGamesInput): Promise<RawGameResult[]> {
    try {
      const model =
        request.sport === 'football'
          ? this.client.orm.mattsarzsports.football
          : this.client.orm.mattsarzsports.basketball;

      return await model
        .where((row) => row.mediaindicator.in(['T', 'W']))
        .where((row) => row.season.eq(request.season))
        .where((row) => row.week.eq(request.week))
        .orderBy((row) => row.timewithoffset.asc())
        .orderBy((row) => row.listorder.asc())
        .select(
          'gametitle',
          'visitingteam',
          'hometeam',
          'location',
          'timewithoffset',
          'mediaindicator',
          'network',
          'networkjpg',
          'coveragenotes',
          'ppv',
          'tvtype',
          'conference'
        )
        .all();
    } catch (error) {
      throw new DatabaseError('Failed to fetch TV games', error as Error);
    }
  }

  public transaction(client: ReturnType<typeof postgres<Contract>>): CommonService {
    return new CommonService(client);
  }
}
