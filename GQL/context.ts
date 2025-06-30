import type { Request } from 'express';
import { PrismaClient } from '@generated/prisma/client';
import { DatabaseServices } from '@database/services';

export interface IContext {
  request: Request;
  db: Partial<PrismaClient>;
  services: DatabaseServices;
}
