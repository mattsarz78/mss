import type { Request, Response } from 'express';
import { PrismaClient } from './__generated__/prisma';
import { DatabaseServices } from './database/services';

export interface IContext {
  request: Request;
  db: Partial<PrismaClient>;
  services: DatabaseServices;
  response: Response;
}
