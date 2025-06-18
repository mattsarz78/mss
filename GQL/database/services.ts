import { TransactionClient } from '__generated__/prisma/internal/prismaNamespace';
import { AvailableTvServiceKey, IAvailableTvService } from './availableTV';
import { CommonServiceKey, ICommonService } from './common';
import { FootballServiceKey, IFootballService } from './football';
import { ISeasonService, SeasonServiceKey } from './seasonData';
import { IWeeklyDatesService, WeeklyDatesServiceKey } from './weeklyDates';

export interface DatabaseService<T> {
  transaction(client: TransactionClient): T;
}

export interface DatabaseServices {
  [AvailableTvServiceKey]: IAvailableTvService;
  [FootballServiceKey]: IFootballService;
  [WeeklyDatesServiceKey]: IWeeklyDatesService;
  [CommonServiceKey]: ICommonService;
  [SeasonServiceKey]: ISeasonService;
}

export const getDatabaseServices = (services: Partial<DatabaseServices>): DatabaseServices => {
  const requiredServices = [
    AvailableTvServiceKey,
    FootballServiceKey,
    WeeklyDatesServiceKey,
    CommonServiceKey,
    SeasonServiceKey
  ];

  for (const serviceKey of requiredServices) {
    if (!services[serviceKey as keyof DatabaseServices]) {
      throw new Error(`Missing service: ${String(serviceKey)}`);
    }
  }

  return services as DatabaseServices;
};
