import { type IContext } from '#/context.mjs';
import { SeasonServiceKey } from '#database/seasonData.mjs';
import type { SeasonData, SeasonDataInput } from '#generated/graphql.mjs';
import { BadRequestError, handleError } from '#utils/errorHandler.mjs';

export interface SeasonDataArgs {
  input: SeasonDataInput;
}

export const seasonData = async (_1: unknown, { input }: SeasonDataArgs, context: IContext): Promise<SeasonData> => {
  try {
    if (!input.season) {
      throw new BadRequestError('Season is required');
    }

    const data = await context.services[SeasonServiceKey].getSeasonData(input.season);
    return { flexScheduleLink: data.flexScheduleLink } as SeasonData;
  } catch (err: unknown) {
    throw handleError(err);
  }
};
