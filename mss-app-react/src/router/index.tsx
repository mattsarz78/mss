import React, { lazy, Suspense } from 'react';

// 1. Tell Fast Refresh to completely skip checking this configuration bundle file
/* eslint-disable react-refresh/only-export-components */

// Lazy load view components for better performance
const HomeView = lazy(() => import('#views/HomeView.tsx'));
const CopyrightView = lazy(() => import('#views/CopyrightView.tsx'));
const ArchiveView = lazy(() => import('#views/ArchiveView.tsx'));
const SeasonView = lazy(() => import('#views/SeasonView.tsx'));
const ConferenceGamesView = lazy(() => import('#views/ConferenceGamesView.tsx'));
const TvWindowsView = lazy(() => import('#views/TvWindowsView.tsx'));
const WeeklyScheduleView = lazy(() => import('#views/WeeklyScheduleView.tsx'));
const WeeklyTextScheduleView = lazy(() => import('#views/WeeklyTextScheduleView.tsx'));
const DailyScheduleView = lazy(() => import('#views/DailyScheduleView.tsx'));
const DailyTextScheduleView = lazy(() => import('#views/DailyTextScheduleView.tsx'));

export interface RouteConfig {
  path: string;
  name?: string;
  element: React.ReactNode;
  redirect?: string;
  props?: Record<string, unknown>; // 👈 2. FIXED: Swap "any" for safe, modern "unknown"
}

// Route loading boundary
const RouteLoader = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
);

export const routes: RouteConfig[] = [
  {
    path: '/',
    name: 'home',
    element: (
      <RouteLoader>
        <HomeView />
      </RouteLoader>
    ),
  },
  {
    path: '/copyright',
    element: (
      <RouteLoader>
        <CopyrightView />
      </RouteLoader>
    ),
  },
  {
    path: '/archive',
    element: (
      <RouteLoader>
        <ArchiveView />
      </RouteLoader>
    ),
  },
  {
    path: '/season/:sport/:year',
    element: (
      <RouteLoader>
        <SeasonView />
      </RouteLoader>
    ),
  },
  {
    path: '/contract/:conference/:year',
    element: (
      <RouteLoader>
        <ConferenceGamesView />
      </RouteLoader>
    ),
  },
  {
    path: '/tv-windows/:year',
    element: (
      <RouteLoader>
        <TvWindowsView />
      </RouteLoader>
    ),
  },
  {
    path: '/schedule/:sport/:year/:week',
    name: 'Weekly',
    element: (
      <RouteLoader>
        <WeeklyScheduleView />
      </RouteLoader>
    ),
  },
  {
    path: '/schedule/:sport/:year/:week/text',
    name: 'Weekly Text',
    element: (
      <RouteLoader>
        <WeeklyTextScheduleView />
      </RouteLoader>
    ),
  },
  {
    path: '/schedule/:sport/daily',
    element: (
      <RouteLoader>
        <DailyScheduleView />
      </RouteLoader>
    ),
  },
  {
    path: '/schedule/:sport/daily/text',
    element: (
      <RouteLoader>
        <DailyTextScheduleView />
      </RouteLoader>
    ),
  },
];
