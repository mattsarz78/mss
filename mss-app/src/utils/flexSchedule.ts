import type { FlexScheduleLink } from '@/staticData/exportTypes';
import flexScheduleLinks from '@/staticData/flexScheduleLinks.json';

export const flexScheduleLink = (year: string): string => {
  return flexScheduleLinks.find((link: FlexScheduleLink) => link.season === year)?.url ?? '';
};
