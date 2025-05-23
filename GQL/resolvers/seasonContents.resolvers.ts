import { SeasonContents, SeasonContentsInput } from '../__generated__/graphql';
import { IContext } from '../context';
import { WeeklyDatesServiceKey } from '../database/weeklyDates';
import { BadRequestError, handleError } from '../utils/errorHandler';

export interface SeasonContentsArgs {
  input: SeasonContentsInput;
}

export const getSeasonContents = async (
  _1: unknown,
  { input }: SeasonContentsArgs,
  context: IContext
): Promise<SeasonContents[]> => {
  try {
    if (!input.season) {
      throw new BadRequestError('Season is required');
    }

    const results = await context.services[WeeklyDatesServiceKey].getConferenceGames(input.season);
    return results.map((result) => ({
      week: result.week,
      startDate: result.startdate?.toISOString() ?? '',
      endDate: result.enddate?.toISOString() ?? '',
      postseasonInd: result.postseasonind
    }));
  } catch (err: unknown) {
    throw handleError(err);
  }
};

export default { Query: { seasonContents: getSeasonContents } };
