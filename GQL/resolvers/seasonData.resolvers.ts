import { IContext } from '@/context';
import { BadRequestError, handleError } from '@utils/errorHandler';
import { SeasonData, SeasonDataInput } from '@generated/graphql';
import { SeasonServiceKey } from '@database/seasonData';

export interface SeasonDataArgs {
  input: SeasonDataInput;
}

export const getSeasonData = async (_1: unknown, { input }: SeasonDataArgs, context: IContext): Promise<SeasonData> => {
  try {
    if (!input.season) {
      throw new BadRequestError('Season is required');
    }

    const seasonData = await context.services[SeasonServiceKey].getSeasonData(input.season);
    return { flexScheduleLink: seasonData.flexScheduleLink } as SeasonData;
  } catch (err: unknown) {
    throw handleError(err);
  }
};

export default { Query: { seasonData: getSeasonData } };
