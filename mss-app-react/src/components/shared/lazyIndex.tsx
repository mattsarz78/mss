// src/components/shared/lazy.ts
import { lazy } from 'react';

export const LazyAdsByGoogle = lazy(() => import('#shared/AdsByGoogle.tsx'));
export const LazyBackToTop = lazy(() => import('#shared/BackToTop.tsx'));
export const LazyCopyrightLink = lazy(() => import('#shared/CopyrightLink.tsx'));
