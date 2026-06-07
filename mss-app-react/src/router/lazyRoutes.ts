// src/components/shared/lazy.ts
import { lazy } from 'react';

// Shared Global Node Assets
export const LazyAdsByGoogle = lazy(() => import('#shared/AdsByGoogle.tsx'));
export const LazyCopyrightLink = lazy(() => import('#shared/CopyrightLink.tsx'));

// App Views Hub
export const HomeView = lazy(() => import('#views/HomeView.tsx'));
export const CopyrightView = lazy(() => import('#views/CopyrightView.tsx'));
export const ArchiveView = lazy(() => import('#views/ArchiveView.tsx'));
export const SeasonView = lazy(() => import('#views/SeasonView.tsx'));
export const ConferenceGamesView = lazy(() => import('#views/ConferenceGamesView.tsx'));
export const TvWindowsView = lazy(() => import('#views/TvWindowsView.tsx'));
export const WeeklyScheduleView = lazy(() => import('#views/WeeklyScheduleView.tsx'));
export const WeeklyTextScheduleView = lazy(() => import('#views/WeeklyTextScheduleView.tsx'));
export const DailyScheduleView = lazy(() => import('#views/DailyScheduleView.tsx'));
export const DailyTextScheduleView = lazy(() => import('#views/DailyTextScheduleView.tsx'));