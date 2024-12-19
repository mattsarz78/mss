import { IContext } from '../../context';
import { DateTime } from 'luxon';
import { TvGame, TvGamesInput } from '../../__generated__/graphql';
import { CommonServiceKey } from '../../database/common';
import { Basketball, Football } from '__generated__/prisma';

export type TvGamesArgs = {
  input: TvGamesInput;
};

export const getTvGames = async (
  _1: unknown,
  { input }: TvGamesArgs,
  context: IContext
): Promise<TvGame[] | string> => {
  try {
    const results = await context.services[CommonServiceKey].getTvGames(input);

    return results.map((result: Football | Basketball) => ({
      season: result.Season.trim(),
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
    }));
  } catch (err: unknown) {
    return (err as Error).message;
  }
};
