import { AvailableTvServiceKey, type IAvailableTvService } from '#database/availableTV.mjs';
import { CommonServiceKey, type ICommonService } from '#database/common.mjs';
import { FootballServiceKey, type IFootballService } from '#database/football.mjs';
import { type ISeasonService, SeasonServiceKey } from '#database/seasonData.mjs';
import { type IWeeklyDatesService, WeeklyDatesServiceKey } from '#database/weeklyDates.mjs';
import { Prisma } from '#generated/prisma/client.mjs';

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

const isComplete = (services: Partial<DatabaseServices>): services is DatabaseServices => {
  const requiredServices = [
    AvailableTvServiceKey,
    FootballServiceKey,
    WeeklyDatesServiceKey,
    CommonServiceKey,
    SeasonServiceKey
  ] as const;

  return requiredServices.every((key) => key in services && services[key] !== undefined);
};

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
