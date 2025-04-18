import { IContext } from '../context';
import { DatabaseError } from '../utils/errorHandler';

export const healthResolver = async (_1: unknown, _2: unknown, context: IContext): Promise<string> => {
  try {
    await context.db.$connect?.();
    return 'healthy';
  } catch (err: unknown) {
    throw new DatabaseError('Database connection failed', err as Error);
  }
};

export default { Query: { health: healthResolver } };
