import { Prisma } from '@generated/prisma/client';
import { AvailableTvServiceKey, IAvailableTvService } from '@database/availableTV';
import { CommonServiceKey, ICommonService } from '@database/common';
import { FootballServiceKey, IFootballService } from '@database/football';
import { ISeasonService, SeasonServiceKey } from '@database/seasonData';
import { IWeeklyDatesService, WeeklyDatesServiceKey } from '@database/weeklyDates';

export interface DatabaseService<T> {
  transaction(client: Prisma.TransactionClient): T;
}

export interface DatabaseServices {
  [AvailableTvServiceKey]: IAvailableTvService;
  [FootballServiceKey]: IFootballService;
  [WeeklyDatesServiceKey]: IWeeklyDatesService;
  [CommonServiceKey]: ICommonService;
  [SeasonServiceKey]: ISeasonService;
}

function isComplete(services: Partial<DatabaseServices>): services is DatabaseServices {
  const requiredServices = [
    AvailableTvServiceKey,
    FootballServiceKey,
    WeeklyDatesServiceKey,
    CommonServiceKey,
    SeasonServiceKey
  ] as const;

  return requiredServices.every((key) => key in services && services[key] !== undefined);
}

export const getDatabaseServices = (services: Partial<DatabaseServices>): DatabaseServices => {
  if (!isComplete(services)) {
    const missing = [
      AvailableTvServiceKey,
      FootballServiceKey,
      WeeklyDatesServiceKey,
      CommonServiceKey,
      SeasonServiceKey
    ].filter((key) => !(key in services) || services[key as keyof DatabaseServices] === undefined);

    throw new Error(`Missing services: ${missing.join(', ')}`);
  }

  return services;
};
