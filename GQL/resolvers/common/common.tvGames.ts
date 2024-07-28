import { IContext } from '../../context';
import { DateTime } from 'luxon';
import { TvGame, TvGamesInput } from '../../__generated__/graphql';
import { CommonServiceKey } from '../../database/common';
import { Basketball, Football } from '__generated__/prisma';

export type TvGamesArgs = {
  input: TvGamesInput;
};

export const getTvGames = async (_1: unknown, args: TvGamesArgs, context: IContext): Promise<TvGame[] | string> => {
  try {
    return (await context.services[CommonServiceKey].getTvGames(args.input)).map((result: Football | Basketball) => {
      return {
        season: result.Season,
        gameTitle: result.GameTitle?.trim(),
        visitingTeam: result.VisitingTeam?.trim().split(',') ?? [],
        homeTeam: result.HomeTeam?.trim().split(',') ?? [],
        location: result.Location?.trim(),
        network: result.Network?.trim(),
        networkJpg: result.NetworkJPG?.trim(),
        coverageNotes: result.CoverageNotes?.trim(),
        ppv: result.PPV?.trim(),
        mediaIndicator: result.MediaIndicator,
        timeWithOffset: DateTime.fromJSDate(result.TimeWithOffset as Date).toISO()
      } as TvGame;
    });
  } catch (err: unknown) {
    return (err as Error).message;
  }
};
