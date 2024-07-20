import { DatabaseServices } from './database/services';
import { PrismaClient } from './__generated__/prisma';
import type { Request } from 'express';

export interface IContext {
  request: Request;
  db: Partial<PrismaClient>;
  services: DatabaseServices;
}
