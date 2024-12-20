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
  { input }: DailyTvGamesArgs,
  context: IContext
): Promise<TvGame[] | string> => {
  const startDate = DateTime.fromISO(input.startDate).set(zeroHour).toJSDate();
  const endDate = DateTime.fromISO(input.startDate).plus({ days: 1 }).set(endOfDay).toJSDate();

  try {
    const results = await context.services[CommonServiceKey].getDailyTvGames({
      startDate,
      endDate,
      sport: input.sport
    });

    return results.map((result: Football | Basketball) => ({
      season: result.Season.trim(),
      gameTitle: result.GameTitle?.trim(),
      visitingTeam: result.VisitingTeam?.trim().split(',') ?? [],
      homeTeam: result.HomeTeam?.trim().split(',') ?? [],
      location: result.Location?.trim(),
      network: result.Network?.trim(),
      networkJpg: result.NetworkJPG,
      coverageNotes: result.CoverageNotes?.trim(),
      ppv: result.PPV?.trim(),
      mediaIndicator: result.MediaIndicator.trim(),
      timeWithOffset: DateTime.fromJSDate(result.TimeWithOffset as Date).toISO()
    }));
  } catch (err: unknown) {
    return (err as Error).message;
  }
};
