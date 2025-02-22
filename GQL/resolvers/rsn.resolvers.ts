import { RsnListServiceKey } from '../database/rsnList';
import { IContext } from '../context';
import { RsnGame, RsnInput } from '../__generated__/graphql';
import { rsnlist } from '__generated__/prisma';

export type RsnArgs = {
  input: RsnInput;
};

export const getRsnList = async (_1: unknown, { input }: RsnArgs, context: IContext): Promise<RsnGame[] | string> => {
  try {
    const result = await context.services[RsnListServiceKey].getRsnList(input.season);
    return result.map((game: rsnlist) => ({
      ...game,
      KeyValue: game.keyvalue ?? ''
    }));
  } catch (error: unknown) {
    return (error as Error).message;
  }
};

export default {
  Query: {
    rsnList: getRsnList
  }
};
