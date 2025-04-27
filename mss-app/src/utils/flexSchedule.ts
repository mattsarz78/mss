import { flexScheduleLinks } from '@/constants/flexScheduleLinks';

export const flexScheduleLink = (year: string): string => {
  return flexScheduleLinks.find((link) => link.season === year)?.url ?? '';
};
