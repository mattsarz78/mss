import type { Request } from 'express';
import { PrismaClient } from './__generated__/prisma/client';
import { DatabaseServices } from './database/services';

export interface IContext {
  request: Request;
  db: Partial<PrismaClient>;
  services: DatabaseServices;
}
