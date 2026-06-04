// Common type definitions used across the application
// For GraphQL-related types, refer to graphQl.mjs

/**
 * Navigation configuration for route parameters
 */
export interface RouteParams {
  sport?: string;
  year?: string;
  week?: string;
  conference?: string;
}

/**
 * Loading/Error state pattern used across hooks
 */
export interface QueryState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Component props pattern for game displays
 */
export interface GameDisplayProps {
  games: any[];
  sport: string;
  [key: string]: any;
}

/**
 * Navigation state for week/schedule navigation
 */
export interface NavigationState {
  nextWeek: number;
  previousWeek: number;
  isBowlWeek: boolean;
  isMbkPostseason: boolean;
  isWeekOne: boolean;
}

export type { ConferenceCasing } from '#/staticData/exportTypes.mjs';
