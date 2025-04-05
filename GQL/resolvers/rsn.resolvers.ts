import { RsnListServiceKey } from '../database/rsnList';
import { IContext } from '../context';
import { RsnGame, RsnInput } from '../__generated__/graphql';
import { rsnlist } from '../__generated__/prisma';

export interface RsnArgs {
  input: RsnInput;
}

export const getRsnList = async (_1: unknown, { input }: RsnArgs, context: IContext): Promise<RsnGame[] | string> => {
  try {
    const result = await context.services[RsnListServiceKey].getRsnList(input.season);
    return result.map((game: rsnlist) => ({
      ...game,
      KeyValue: game.keyvalue ?? ''
    }));
  } catch (err: unknown) {
    console.error(`Error fetching RSN list: ${(err as Error).message}`);
    return (err as Error).message;
  }
};

export default {
  Query: {
    rsnList: getRsnList
  }
};
