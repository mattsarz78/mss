import type { DatabaseService } from '#database/services.mjs';
import type { NoTvGamesInput } from '#generated/graphql.mjs';
import { PrismaClient, type football } from '#generated/prisma/client.mjs';
import { noTvGames } from '#generated/prisma/sql/noTvGames.mjs';
import { DatabaseError } from '#utils/errorHandler.mjs';

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
  private client: PrismaClient;

  constructor(client: PrismaClient) {
    this.client = client;
  }

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
      return await this.client.$queryRawTyped(noTvGames(request.week, request.season));
    } catch (error) {
      throw new DatabaseError('Failed to fetch no TV games', error as Error);
    }
  }

  public transaction(client: PrismaClient): FootballService {
    return new FootballService(client);
  }
}
