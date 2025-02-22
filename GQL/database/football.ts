import { NoTvGamesInput, TvGamesInput } from '../__generated__/graphql';
import { Prisma, PrismaClient, football } from '../__generated__/prisma';
import { DatabaseService } from './services';

export const FootballServiceKey = Symbol.for('IFootballService');

export interface IFootballService extends DatabaseService<IFootballService> {
  getConferenceGames(request: GetConferenceGamesRequest): Promise<football[]>;
  getNoTvGames(request: NoTvGamesInput): Promise<any[]>;
}

export interface GetConferenceGamesRequest {
  season: string;
  conference: string;
}

export class FootballService implements IFootballService {
  constructor(private client: PrismaClient | Prisma.TransactionClient) {}
  public async getConferenceGames(request: GetConferenceGamesRequest): Promise<football[]> {
    try {
      return await this.client.football.findMany({
        where: {
          season: request.season,
          conference: request.conference,
          mediaindicator: {
            in: ['T', 'W']
          }
        },
        orderBy: {
          timewithoffset: 'asc'
        }
      });
    } catch (error) {
      console.error('Error fetching conference games:', error);
      throw error;
    }
  }

  public async getNoTvGames(request: NoTvGamesInput): Promise<any[]> {
    try {
      return await this.client.$queryRaw`
          SELECT fb.gametitle, fb.visitingteam, fb.hometeam, fb.location, fb.conference, at.tvoptions, fb.timewithoffset, fb.fcs
          FROM mattsarzsports.football fb, mattsarzsports.availabletv at
          WHERE fb.week = ${request.week}
            AND fb.season = ${request.season}
            AND fb.conference = at.conference
            AND fb.season = at.season
            AND fb.week = at.week
            AND fb.mediaindicator = 'N'
          ORDER BY fb.conference`;
    } catch (error) {
      console.error('Error fetching no TV games:', error);
      throw error;
    }
  }

  public transaction(client: Prisma.TransactionClient) {
    return new FootballService(client);
  }
}
