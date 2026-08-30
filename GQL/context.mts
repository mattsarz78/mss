import type { DatabaseServices } from '#database/services.mjs';
import type postgres from '@prisma/orm-postgres/runtime';
import type { Request } from 'express';
import type { Contract } from '#generated/prisma/contract.d.js';

export interface IContext {
  request: Request;
  db: Partial<ReturnType<typeof postgres<Contract>>>;
  services: DatabaseServices;
}
