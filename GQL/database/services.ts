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
  if (
    services[AvailableTvServiceKey] &&
    services[FootballServiceKey] &&
    services[WeeklyDatesServiceKey] &&
    services[CommonServiceKey] &&
    services[RsnListServiceKey]
  ) {
    return Object.assign(services, {
      [AvailableTvServiceKey]: services[AvailableTvServiceKey],
      [FootballServiceKey]: services[FootballServiceKey],
      [WeeklyDatesServiceKey]: services[WeeklyDatesServiceKey],
      [CommonServiceKey]: services[CommonServiceKey],
      [RsnListServiceKey]: services[RsnListServiceKey]
    });
  }
  throw new Error("Can't find all services");
};
