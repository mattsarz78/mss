import type { IContext } from '#/context.mjs';
import { AvailableTvServiceKey } from '#database/availableTV.mjs';
import type { AvailableTv, AvailableTvInput } from '#generated/graphql.mjs';
import { BadRequestError, handleError } from '#utils/errorHandler.mjs';

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
