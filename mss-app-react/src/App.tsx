import React, { Suspense, useEffect, useRef, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

// Core Application Styles
import '#/App.css';

// Central Route Registry
import { routes, type RouteConfig } from '#/router/index.tsx';

// Unified Architecture Features & Global Handlers
import { useAppUtils, useResetAdsenseHeight } from '#hooks/index.mjs';
import { ScrollToTop } from '#shared/index.tsx';
import { checkVersion } from '#utils/index.mjs';

const App: React.FC = () => {
  const [needsUpdate, setNeedsUpdate] = useState(false);
  const { isOnline } = useAppUtils();
  const mainRef = useResetAdsenseHeight();
  const checkIntervalRef = useRef<number | ReturnType<typeof setInterval> | undefined>(undefined);

  useEffect(() => {
    checkIntervalRef.current = setInterval(async () => {
      const hasUpdate = await checkVersion();
      setNeedsUpdate(hasUpdate);
    }, 300000);

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, []);

  const handleReload = () => window.location.reload();

  return (
    <BrowserRouter>
      <ScrollToTop />
      <main className="maincontainer" ref={mainRef as React.RefObject<HTMLElement | null>}>
        {' '}
        {needsUpdate && (
          <div className="update-banner">
            A new version is available.{' '}
            <button onClick={handleReload} type="button">
              Refresh
            </button>
          </div>
        )}
        {!isOnline && <div className="offline-banner">You are currently offline</div>}
        <Suspense
          fallback={
            <div className="loading-container">
              <p>Loading layout...</p>
            </div>
          }>
          <Routes>
            {routes.map((route: RouteConfig) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
    </BrowserRouter>
  );
};

export default App;
