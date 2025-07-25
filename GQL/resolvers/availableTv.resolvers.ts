import { IContext } from '@/context';
import { AvailableTvServiceKey } from '@database/availableTV';
import { AvailableTv, AvailableTvInput } from '@generated/graphql';
import { BadRequestError, handleError } from '@utils/errorHandler';

export interface AvailableTvArgs {
  input: AvailableTvInput;
}

export const availableTv = async (
  _1: unknown,
  { input }: AvailableTvArgs,
  context: IContext
): Promise<AvailableTv[]> => {
  try {
    if (!input.season || !input.conference || (!input.week && input.week !== 0)) {
      throw new BadRequestError('Season, conference, and week are required');
    }

    const results = await context.services[AvailableTvServiceKey].getAvailableTv(input);
    return results.map((result) => ({
      season: result.season,
      conference: result.conference,
      week: result.week,
      tvOptions: result.tvoptions ?? ''
    }));
  } catch (err: unknown) {
    throw handleError(err);
  }
};
