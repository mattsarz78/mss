export { default as WeekTextBase } from '#text/WeekTextBase.tsx';
export { default as WeekTextSchedule } from '#text/WeekTextSchedule.tsx';
export { default as WeekTextTable } from '#text/WeekTextTable.tsx';

export interface WeekTextTableHandle {
  checkAll: () => void;
  clearAll: () => void;
}
