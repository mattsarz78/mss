import { WeeklyDatesServiceKey } from '../database/weeklyDates';
import { SeasonContents, SeasonContentsInput } from '../__generated__/graphql';
import { IContext } from '../context';

export type SeasonContentsArgs = {
  input: SeasonContentsInput;
};

export const getSeasonContents = async (
  _1: unknown,
  { input }: SeasonContentsArgs,
  context: IContext
): Promise<SeasonContents[] | string> => {
  try {
    const results = await context.services[WeeklyDatesServiceKey].getConferenceGames(input.season);

    return results.map((result) => ({
      week: result.Week,
      startDate: result.StartDate.toISOString(),
      endDate: result.EndDate.toISOString(),
      postseasonInd: result.PostseasonInd
    }));
  } catch (error: unknown) {
    return (error as Error).message;
  }
};

export default {
  Query: {
    seasonContents: getSeasonContents
  }
};
