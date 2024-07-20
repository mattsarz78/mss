import { NoTvGamesInput, TvGamesInput } from '../__generated__/graphql';
import { Prisma, PrismaClient, Football } from '../__generated__/prisma';
import { DatabaseService } from './services';

export const FootballServiceKey = Symbol.for('IFootballService');

export interface IFootballService extends DatabaseService<IFootballService> {
  getConferenceGames(request: any): Promise<Football[]>;
  getTvGames(request: TvGamesInput): Promise<Football[]>;
  getDailyTvGames(request: any): Promise<Football[]>;
  getNoTvGames(request: NoTvGamesInput): Promise<any[]>;
}

export class FootballService implements IFootballService {
  constructor(private client: PrismaClient | Prisma.TransactionClient) {}
  public getConferenceGames(request: any): Promise<Football[]> {
    return this.client.football.findMany({
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
  }

  public getDailyTvGames(request: any): Promise<Football[]> {
    return this.client.football.findMany({
      where: {
        Season: request.season,
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
          TimeWithOffset: 'asc'
        },
        {
          ListOrder: 'asc'
        }
      ]
    });
  }

  public getTvGames(request: TvGamesInput): Promise<Football[]> {
    return this.client.football.findMany({
      where: {
        Week: request.week,
        Season: request.season,
        MediaIndicator: {
          in: ['T', 'W']
        }
      },
      orderBy: [
        {
          TimeWithOffset: 'asc'
        },
        {
          ListOrder: 'asc'
        }
      ]
    });
  }

  public getNoTvGames(request: NoTvGamesInput): Promise<any[]> {
    return this.client
      .$queryRaw`select fb.[GameTitle],fb.[VisitingTeam],fb.[HomeTeam],fb.[Location],fb.[Conference],at.[TVOptions], fb.[TimeWithOffset], fb.[FCS]
from [dbo].[Football] fb, [dbo].[AvailableTV] at
where fb.week = ${request.week}
and fb.season = ${request.season}
and fb.conference = at.conference
and fb.season = at.season
AND fb.week = at.week
and fb.Mediaindicator = 'N'
order by fb.[Conference]`;
  }

  public transaction(client: Prisma.TransactionClient) {
    return new FootballService(client);
  }
}
