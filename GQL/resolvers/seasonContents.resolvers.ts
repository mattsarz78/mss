import { SeasonContents, SeasonContentsInput, SeasonData } from '../__generated__/graphql';
import { IContext } from '../context';
import { WeeklyDatesServiceKey } from '../database/weeklyDates';
import { BadRequestError, handleError } from '../utils/errorHandler';
import { SeasonServiceKey } from '../database/seasonData';

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

export const getSeasonData = async (
  _1: unknown,
  { input }: SeasonContentsArgs,
  context: IContext
): Promise<SeasonData> => {
  try {
    if (!input.season) {
      throw new BadRequestError('Season is required');
    }

    const res = await context.services[SeasonServiceKey].getSeasonData(input.season);
    const response: SeasonData = {
      season: res.season,
      hasPostseason: res.hasPostseason,
      hasNoTVGames: res.hasNoTVGames,
      showPPVColumn: res.showPPVColumn
    };

    if (res.conferenceListBase) {
      response.conferenceListBase = res.conferenceListBase;
    }
    if (res.independents) {
      response.independents = res.independents;
    }
    return response;
  } catch (err: unknown) {
    throw handleError(err);
  }
};

export default { Query: { seasonContents: getSeasonContents, seasonData: getSeasonData } };
