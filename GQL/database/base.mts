import type { Contract } from '#generated/prisma/contract.d.js';
import type postgres from '@prisma/orm-postgres/runtime';

export interface DatabaseService<T> {
  transaction(client: ReturnType<typeof postgres<Contract>>): T;
}
