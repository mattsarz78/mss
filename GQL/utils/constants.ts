export enum TimeZoneOffsets {
  UTC = 'UTC',
  Newfoundland = 'Canada/Newfoundland',
  Atlantic = 'Canada/Atlantic',
  Eastern = 'US/Eastern',
  Central = 'US/Central',
  Mountain = 'US/Mountain',
  Arizona = 'US/Arizona',
  Pacific = 'US/Pacific',
  Alaska = 'US/Alaska',
  Hawaii = 'US/Hawaii'
}

export const zeroHour = { hour: 0, minute: 0, seconds: 0, milliseconds: 0 };
export const endOfDay = { hour: 23, minute: 59, seconds: 0, milliseconds: 0 };
