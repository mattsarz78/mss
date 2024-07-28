import { IContext } from '../../context';
import { DateTime } from 'luxon';
import { DailyTvGamesInput, TvGame } from '../../__generated__/graphql';
import { endOfDay, zeroHour } from '../../utils/constants';
import { CommonServiceKey } from '../../database/common';
import { Basketball, Football } from '__generated__/prisma';

export type DailyTvGamesArgs = {
  input: DailyTvGamesInput;
};

export const getDailyTvGames = async (
  _1: unknown,
  args: DailyTvGamesArgs,
  context: IContext
): Promise<TvGame[] | string> => {
  const startDate = DateTime.fromISO(args.input.startDate).set(zeroHour).toJSDate();
  const endDate = DateTime.fromISO(args.input.startDate).plus({ days: 1 }).set(endOfDay).toJSDate();

  try {
    return (
      await context.services[CommonServiceKey].getDailyTvGames({
        startDate,
        endDate,
        sport: args.input.sport
      })
    ).map((result: Football | Basketball) => {
      return {
        season: result.Season,
        gameTitle: result.GameTitle?.trim(),
        visitingTeam: result.VisitingTeam?.trim().split(',') ?? [],
        homeTeam: result.HomeTeam?.trim().split(',') ?? [],
        location: result.Location?.trim(),
        network: result.Network?.trim(),
        networkJPG: result.NetworkJPG,
        coverageNotes: result.CoverageNotes?.trim(),
        ppv: result.PPV?.trim(),
        mediaIndicator: result.MediaIndicator.trim(),
        timeWithOffset: DateTime.fromJSDate(result.TimeWithOffset as Date).toISO()
      } as TvGame;
    });
  } catch (err: unknown) {
    return (err as Error).message;
  }
};
