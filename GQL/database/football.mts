import type { DatabaseService } from '#database/base.mjs';
import type { NoTvGamesInput } from '#generated/graphql.mjs';
import type { Contract } from '#generated/prisma/contract.d.js';
import { DatabaseError } from '#utils/errorHandler.mjs';
import postgres from '@prisma/orm-postgres/runtime';

export const FootballServiceKey = Symbol.for('IFootballService');

export interface IFootballService extends DatabaseService<IFootballService> {
  getConferenceGames(request: GetConferenceGamesRequest): Promise<ConferenceGame[]>;
  getNoTvGames(request: NoTvGamesInput): Promise<NoTVGames[]>;
}

export interface GetConferenceGamesRequest {
  season: string;
  conference: string;
}

export interface ConferenceGame {
  gametitle: string | null;
  visitingteam: string | null;
  hometeam: string | null;
  location: string | null;
  timewithoffset: Temporal.Instant | null;
  mediaindicator: string | null;
  networkjpg: string | null;
  tvtype: string | null;
  conference: string | null;
}

export interface NoTVGames {
  gametitle: string | null;
  visitingteam: string | null;
  hometeam: string | null;
  location: string | null;
  conference: string | null;
  tvoptions: string | null;
  timewithoffset: Date | null;
  fcs: string | null;
}

export class FootballService implements IFootballService {
  private client: ReturnType<typeof postgres<Contract>>;

  constructor(client: ReturnType<typeof postgres<Contract>>) {
    this.client = client;
  }

  public async getConferenceGames(request: GetConferenceGamesRequest): Promise<ConferenceGame[]> {
    try {
      return await this.client.orm.mattsarzsports.football
        .where((row) => row.season.eq(request.season))
        .where((row) => row.conference.eq(request.conference))
        .where((row) => row.mediaindicator.in(['T', 'W']))
        .orderBy((row) => row.timewithoffset.asc())
        .select(
          'gametitle',
          'visitingteam',
          'hometeam',
          'location',
          'timewithoffset',
          'mediaindicator',
          'networkjpg',
          'tvtype',
          'conference'
        )
        .all();
    } catch (error) {
      throw new DatabaseError('Failed to fetch conference games', error as Error);
    }
  }

  public async getNoTvGames(request: NoTvGamesInput): Promise<NoTVGames[]> {
    try {
      const plan = this.client.sql.mattsarzsports.football
        .as('fb')
        .innerJoin(this.client.sql.mattsarzsports.availabletv.as('at'), (f, fns) =>
          fns.and(
            fns.eq(f.at.conference, f.fb.conference),
            fns.eq(f.at.season, f.fb.season),
            fns.eq(f.at.week, f.fb.week)
          )
        )
        .select((f) => ({
          gametitle: f.fb.gametitle,
          visitingteam: f.fb.visitingteam,
          hometeam: f.fb.hometeam,
          location: f.fb.location,
          conference: f.fb.conference,
          tvoptions: f.at.tvoptions,
          timewithoffset: f.fb.timewithoffset,
          fcs: f.fb.fcs
        }))
        .where((f, fns) =>
          fns.and(
            fns.eq(f.fb.season, request.season),
            fns.eq(f.fb.week, request.week),
            fns.eq(f.fb.mediaindicator, 'N')
          )
        )
        .orderBy((f) => f.fb.time, { direction: 'asc' })
        .orderBy((f) => f.fb.conference, { direction: 'asc' })
        .build();

      const result = await this.client.runtime().query(plan);
      return result as unknown as NoTVGames[];
    } catch (error) {
      throw new DatabaseError('Failed to fetch no TV games', error as Error);
    }
  }

  public transaction(client: ReturnType<typeof postgres<Contract>>): FootballService {
    return new FootballService(client);
  }
}
