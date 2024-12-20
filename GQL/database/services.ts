import { Prisma } from '../__generated__/prisma';
import { AvailableTvServiceKey, IAvailableTvService } from './availableTV';
import { FootballServiceKey, IFootballService } from './football';
import { IWeeklyDatesService, WeeklyDatesServiceKey } from './weeklyDates';
import { ICommonService, CommonServiceKey } from './common';
import { IRsnListService, RsnListServiceKey } from './rsnList';

export interface DatabaseService<T> {
  transaction(client: Prisma.TransactionClient): T;
}

export type DatabaseServices = {
  [AvailableTvServiceKey]: IAvailableTvService;
  [FootballServiceKey]: IFootballService;
  [WeeklyDatesServiceKey]: IWeeklyDatesService;
  [CommonServiceKey]: ICommonService;
  [RsnListServiceKey]: IRsnListService;
};

export const getDatabaseServices = (services: Partial<DatabaseServices>): DatabaseServices => {
  const requiredServices = [
    AvailableTvServiceKey,
    FootballServiceKey,
    WeeklyDatesServiceKey,
    CommonServiceKey,
    RsnListServiceKey
  ];

  for (const serviceKey of requiredServices) {
    if (!services[serviceKey as keyof DatabaseServices]) {
      throw new Error(`Missing service: ${String(serviceKey)}`);
    }
  }

  return services as DatabaseServices;
};