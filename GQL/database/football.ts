import { NoTvGamesInput } from '../__generated__/graphql';
import { PrismaClient, football } from '../__generated__/prisma';
import { DatabaseError } from '../utils/errorHandler';
import { DatabaseService } from './services';

export const FootballServiceKey = Symbol.for('IFootballService');

export interface IFootballService extends DatabaseService<IFootballService> {
  getConferenceGames(request: GetConferenceGamesRequest): Promise<football[]>;
  getNoTvGames(request: NoTvGamesInput): Promise<NoTVGames[]>;
}

export interface GetConferenceGamesRequest {
  season: string;
  conference: string;
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
  constructor(private client: PrismaClient) {}

  public async getConferenceGames(request: GetConferenceGamesRequest): Promise<football[]> {
    try {
      return await this.client.football.findMany({
        where: { season: request.season, conference: request.conference, mediaindicator: { in: ['T', 'W'] } },
        orderBy: { timewithoffset: 'asc' }
      });
    } catch (error) {
      throw new DatabaseError('Failed to fetch conference games', error as Error);
    }
  }

  public async getNoTvGames(request: NoTvGamesInput): Promise<NoTVGames[]> {
    try {
      return await this.client.$queryRaw<NoTVGames[]>`
        SELECT fb.gametitle, fb.visitingteam, fb.hometeam, fb.location, fb.conference, at.tvoptions, fb.timewithoffset, fb.fcs
        FROM mattsarzsports.football fb, mattsarzsports.availabletv at
        WHERE fb.week = ${request.week}
          AND fb.season = ${request.season}
          AND fb.conference = at.conference
          AND fb.season = at.season
          AND fb.week = at.week
          AND fb.mediaindicator = 'N'
        ORDER BY fb.timewithoffset, fb.conference;`;
    } catch (error) {
      throw new DatabaseError('Failed to fetch no TV games', error as Error);
    }
  }

  public transaction(client: PrismaClient): FootballService {
    return new FootballService(client);
  }
}
