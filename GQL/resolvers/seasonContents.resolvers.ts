import { WeeklyDatesServiceKey } from '../database/weeklyDates';
import { SeasonContents, SeasonContentsInput } from '../__generated__/graphql';
import { IContext } from '../context';

export interface SeasonContentsArgs {
  input: SeasonContentsInput;
}

export const getSeasonContents = async (
  _1: unknown,
  { input }: SeasonContentsArgs,
  context: IContext
): Promise<SeasonContents[] | string> => {
  try {
    const results = await context.services[WeeklyDatesServiceKey].getConferenceGames(input.season);

    return results.map((result) => ({
      week: result.week,
      startDate: result.startdate?.toISOString() ?? '',
      endDate: result.enddate?.toISOString() ?? '',
      postseasonInd: result.postseasonind
    }));
  } catch (err: unknown) {
    console.error(`Error fetching season contents: ${(err as Error).message}`);
    return (err as Error).message;
  }
};

export default { Query: { seasonContents: getSeasonContents } };
