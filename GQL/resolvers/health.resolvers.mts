import { type IContext } from '#/context.mjs';
import { DatabaseError } from '#utils/errorHandler.mjs';

export const health = async (_1: unknown, _2: unknown, context: IContext): Promise<string> => {
  try {
    await context.db.$connect?.();
    return 'healthy';
  } catch (err: unknown) {
    throw new DatabaseError('Database connection failed', err as Error);
  }
};
