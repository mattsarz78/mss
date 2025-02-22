import { AvailableTvServiceKey } from '../database/availableTV';
import { AvailableTvInput, AvailableTv } from '../__generated__/graphql';
import { availabletv } from '../__generated__/prisma';
import { IContext } from '../context';

export type AvailableTvArgs = {
  input: AvailableTvInput;
};

export const availableTvResolver = async (
  _1: unknown,
  { input }: AvailableTvArgs,
  context: IContext
): Promise<AvailableTv[] | string> => {
  try {
    const results = await context.services[AvailableTvServiceKey].getAvailableTv(input);
    return results.map((availableTV: availabletv) => ({
      season: availableTV.season.trim(),
      conference: availableTV.conference.trim(),
      week: availableTV.week,
      tvOptions: availableTV.tvoptions?.trim()
    }));
  } catch (err: unknown) {
    return (err as Error).message;
  }
};

export default {
  Query: {
    availableTv: availableTvResolver
  }
};
