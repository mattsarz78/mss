import type { DatabaseServices } from '#database/services.mjs';
import { PrismaClient, type seasondata } from '#generated/prisma/client.mjs';
import type { Request } from 'express';

export interface IContext {
  request: Request;
  db: Partial<PrismaClient>;
  services: DatabaseServices;
  seasonDataCache: Map<string, seasondata>;
}
