import { type IContext } from '#/context.mjs';
import { SeasonServiceKey } from '#database/seasonData.mjs';
import { WeeklyDatesServiceKey, type WeeklyDate } from '#database/weeklyDates.mjs';
import type { SeasonContentsData, SeasonContentsInput } from '#generated/graphql.mjs';
import { BadRequestError, handleError } from '#utils/errorHandler.mjs';

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

    const [seasonData, results] = await Promise.all([
      context.services[SeasonServiceKey].getSeasonData(input.season),
      context.services[WeeklyDatesServiceKey].getWeeklyDates(input.season)
    ]);

    return {
      conferenceListBase: seasonData.conferenceListBase,
      flexScheduleLink: seasonData.flexScheduleLink,
      hasPostseason: seasonData.hasPostseason,
      seasonContents: results.map((result: WeeklyDate) => ({
        week: result.week,
        startDate: result.startdate ? Temporal.Instant.from(result.startdate).toString() : '',
        endDate: result.enddate ? Temporal.Instant.from(result.enddate).toString() : '',
        postseasonInd: result.postseasonind
      }))
    } satisfies SeasonContentsData;
  } catch (err: unknown) {
    throw handleError(err);
  }
};
