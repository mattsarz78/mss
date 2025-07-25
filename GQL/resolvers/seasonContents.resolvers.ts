import { IContext } from '@/context';
import { SeasonServiceKey } from '@database/seasonData';
import { WeeklyDatesServiceKey } from '@database/weeklyDates';
import { SeasonContentsData, SeasonContentsInput } from '@generated/graphql';
import { BadRequestError, handleError } from '@utils/errorHandler';

export interface SeasonContentsArgs {
  input: SeasonContentsInput;
}

export const seasonContents = async (
  _1: unknown,
  { input }: SeasonContentsArgs,
  context: IContext
): Promise<SeasonContentsData> => {
  try {
    if (!input.season) {
      throw new BadRequestError('Season is required');
    }

    const seasonData = await context.services[SeasonServiceKey].getSeasonData(input.season);
    const results = await context.services[WeeklyDatesServiceKey].getConferenceGames(input.season);
    return {
      conferenceListBase: seasonData.conferenceListBase,
      flexScheduleLink: seasonData.flexScheduleLink,
      hasPostseason: seasonData.hasPostseason,
      seasonContents: results.map((result) => ({
        week: result.week,
        startDate: result.startdate?.toISOString() ?? '',
        endDate: result.enddate?.toISOString() ?? '',
        postseasonInd: result.postseasonind
      }))
    } as SeasonContentsData;
  } catch (err: unknown) {
    throw handleError(err);
  }
};
