import { AvailableTvServiceKey } from '../database/availableTV';
import { AvailableTvInput, AvailableTv } from '../__generated__/graphql';
import { AvailableTV } from '../__generated__/prisma';
import { IContext } from '../context';

export type AvailableTvArgs = {
  input: AvailableTvInput;
};

export const availableTvResolver = async (
  _1: unknown,
  args: AvailableTvArgs,
  context: IContext
): Promise<AvailableTv[] | string> => {
  try {
    const response = (await context.services[AvailableTvServiceKey].getAvailableTv(args.input)).map(
      (availableTV: AvailableTV) => {
        return {
          season: availableTV.Season.trim(),
          conference: availableTV.Conference.trim(),
          week: availableTV.Week,
          tvOptions: availableTV.TVOptions?.trim()
        } as AvailableTv;
      }
    );
    return response;
  } catch (err: unknown) {
    return (err as Error).message;
  }
};

export default {
  Query: {
    availableTv: availableTvResolver
  }
};
