import { PrismaClient } from '../__generated__/prisma/client';
import { DatabaseError } from '../utils/errorHandler';

export abstract class BaseService {
  constructor(protected client: PrismaClient) {}

  protected async executeQuery<T>(operation: string, queryFn: () => Promise<T>): Promise<T> {
    try {
      return await queryFn();
    } catch (error) {
      throw new DatabaseError(`Failed to ${operation}`, error as Error);
    }
  }

  protected createWhereClause(filters: Record<string, unknown>) {
    return Object.entries(filters).reduce<Record<string, unknown>>((acc, [key, value]) => {
      if (value !== undefined && value !== null) {
        acc[key] = value;
      }
      return acc;
    }, {});
  }
}
