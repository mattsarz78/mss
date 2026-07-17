import React from 'react';
import { Navigate } from 'react-router-dom';

// Import our code-split views from the lazy barrel file
import {
  ArchiveView,
  ConferenceGamesView,
  CopyrightView,
  DailyScheduleView,
  DailyTextScheduleView,
  HomeView,
  SeasonView,
  TvWindowsView,
  WeeklyScheduleView,
  WeeklyTextScheduleView
} from './lazyRoutes.ts';

export interface RouteConfig {
  path: string;
  element: React.ReactNode;
}

export const routes = [
  { path: '/', element: <HomeView /> },
  { path: '/copyright', element: <CopyrightView /> },
  { path: '/archive', element: <ArchiveView /> },

  // Legacy URL Structure Parameter Redirects mapped straight to Home
  { path: '/season/contents/:year', element: <Navigate to="/" replace /> },
  { path: '/schedule/daily/:year', element: <Navigate to="/" replace /> },
  { path: '/schedule/dailytext/:year', element: <Navigate to="/" replace /> },
  { path: '/schedule/weekly/:year/:week', element: <Navigate to="/" replace /> },
  { path: '/schedule/weeklytext/:year/:week', element: <Navigate to="/" replace /> },

  // Dynamic Parameter Target Workspaces
  { path: '/season/:sport/:year', element: <SeasonView /> },
  { path: '/contract/:conference/:year', element: <ConferenceGamesView /> },
  { path: '/tv-windows/:year', element: <TvWindowsView /> },

  // Weekly & Text Schedules
  { path: '/schedule/:sport/:year/:week', element: <WeeklyScheduleView /> },
  { path: '/schedule/:sport/:year/:week/text', element: <WeeklyTextScheduleView /> },

  // Daily Tracking Routes
  { path: '/schedule/:sport/daily', element: <DailyScheduleView /> },
  { path: '/schedule/:sport/daily/text', element: <DailyTextScheduleView /> },

  // Catch-all route for 404 handling - matches anything left over
  { path: '*', element: <Navigate to="/" replace /> }
] satisfies RouteConfig[];
