import { RsnListServiceKey } from '../database/rsnList';
import { IContext } from '../context';
import { RsnGame, RsnInput } from '../__generated__/graphql';

export type RsnArgs = {
  input: RsnInput;
};

export const getRsnList = async (_1: unknown, args: RsnArgs, context: IContext): Promise<RsnGame[] | string> => {
  try {
    return (await context.services[RsnListServiceKey].getRsnList(args.input.season)).map((result) => {
      return result as RsnGame;
    });
  } catch (error: unknown) {
    return (error as Error).message;
  }
};

export default {
  Query: {
    rsnList: getRsnList
  }
};
