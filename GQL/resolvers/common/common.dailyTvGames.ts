import { IContext } from '../../context';
import { DateTime } from 'luxon';
import { DailyTvGamesInput, TvGame } from '../../__generated__/graphql';
import { endOfDay, zeroHour } from '../../utils/constants';
import { CommonServiceKey } from '../../database/common';

export type DailyTvGamesArgs = {
  input: DailyTvGamesInput;
};

export const getDailyTvGames = async (
  _1: unknown,
  args: DailyTvGamesArgs,
  context: IContext
): Promise<TvGame[] | string> => {
  const startDate = DateTime.fromISO(args.input.startDate).set(zeroHour).toJSDate();
  const endDate = DateTime.fromISO(args.input.startDate).set(endOfDay).toJSDate();
  try {
    return (
      await context.services[CommonServiceKey].getDailyTvGames({
        season: args.input.season,
        startDate,
        endDate,
        sport: args.input.sport
      })
    ).map((result: any) => {
      return {
        gameTitle: result.GameTitle.trim(),
        visitingTeam: result.VisitingTeam?.trim().split(',') ?? [],
        homeTeam: result.HomeTeam?.trim().split(',') ?? [],
        location: result.Location.trim(),
        network: result.Network.trim(),
        networkJPG: result.NetworkJPG,
        coverageNotes: result.CoverageNotes.trim(),
        ppv: result.PPV.trim(),
        mediaIndicator: result.MediaIndicator.trim(),
        timeWithOffset: DateTime.fromJSDate(result.TimeWithOffset as Date).toISO()
      } as TvGame;
    });
  } catch (err: unknown) {
    return (err as Error).message;
  }
};
