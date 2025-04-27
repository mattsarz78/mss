export function generateWeeklyTitle(sport: string, week: string, year: string, isText: boolean): string {
  const capitalizedSport = `${sport.charAt(0).toUpperCase()}${sport.slice(1)}`;
  return `${capitalizedSport} ${isText ? 'Weekly Text Schedule' : 'Weekly Schedule'} for ${year} Week ${week}`;
}
