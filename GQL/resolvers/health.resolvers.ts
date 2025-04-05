import { IContext } from '../context';

export const healthResolver = async (_1: unknown, _2: unknown, context: IContext): Promise<string> => {
  try {
    await context.db.$connect?.();
  } catch (err: unknown) {
    return (err as Error).message;
  }
  return 'We are good';
};

export default {
  Query: {
    health: healthResolver
  }
};
