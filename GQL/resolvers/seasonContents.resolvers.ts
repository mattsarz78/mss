import { WeeklyDatesServiceKey } from '../database/weeklyDates';
import { SeasonContents, SeasonContentsInput } from '../__generated__/graphql';
import { IContext } from '../context';

export type SeasonContentsArgs = {
  input: SeasonContentsInput;
};

export const getSeasonContents = async (
  _1: unknown,
  args: SeasonContentsArgs,
  context: IContext
): Promise<SeasonContents[] | string> => {
  try {
    return (await context.services[WeeklyDatesServiceKey].getConferenceGames(args.input.season)).map((result) => {
      return {
        week: result.Week,
        startDate: result.StartDate.toISOString(),
        endDate: result.EndDate.toISOString(),
        postseasonInd: result.PostseasonInd
      } as SeasonContents;
    });
  } catch (error: unknown) {
    return (error as Error).message;
  }
};

export default {
  Query: {
    seasonContents: getSeasonContents
  }
};
