import { NoTvGamesInput, TvGamesInput } from '../__generated__/graphql';
import { Prisma, PrismaClient, Football } from '../__generated__/prisma';
import { DatabaseService } from './services';

export const FootballServiceKey = Symbol.for('IFootballService');

export interface IFootballService extends DatabaseService<IFootballService> {
  getConferenceGames(request: GetConferenceGamesRequest): Promise<Football[]>;
  getNoTvGames(request: NoTvGamesInput): Promise<any[]>;
}

export interface GetConferenceGamesRequest {
  season: string;
  conference: string;
}

export class FootballService implements IFootballService {
  constructor(private client: PrismaClient | Prisma.TransactionClient) {}
  public async getConferenceGames(request: GetConferenceGamesRequest): Promise<Football[]> {
    try {
      return await this.client.football.findMany({
        where: {
          Season: request.season,
          Conference: request.conference,
          MediaIndicator: {
            in: ['T', 'W']
          }
        },
        orderBy: {
          TimeWithOffset: 'asc'
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
          SELECT fb.[GameTitle], fb.[VisitingTeam], fb.[HomeTeam], fb.[Location], fb.[Conference], at.[TVOptions], fb.[TimeWithOffset], fb.[FCS]
          FROM [dbo].[Football] fb, [dbo].[AvailableTV] at
          WHERE fb.week = ${request.week}
            AND fb.season = ${request.season}
            AND fb.conference = at.conference
            AND fb.season = at.season
            AND fb.week = at.week
            AND fb.Mediaindicator = 'N'
          ORDER BY fb.[Conference]`;
    } catch (error) {
      console.error('Error fetching no TV games:', error);
      throw error;
    }
  }

  public transaction(client: Prisma.TransactionClient) {
    return new FootballService(client);
  }
}
