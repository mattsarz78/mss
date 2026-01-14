import type { DatabaseServices } from '#database/services.mjs';
import type { PrismaClient } from '#generated/prisma/client.mjs';
import type { Request } from 'express';

export interface IContext {
  request: Request;
  db: Partial<PrismaClient>;
  services: DatabaseServices;
}
