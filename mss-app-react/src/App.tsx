import { useAppUtils } from '#/hooks/useAppUtils.mjs';
import { routes } from '#/router';
import { checkVersion } from '#/utils/versionCheck.mjs';
import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import '#/App.css';

const App: React.FC = () => {
  const [needsUpdate, setNeedsUpdate] = useState(false);
  const { isOnline } = useAppUtils();
  const checkIntervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  useEffect(() => {
    // Check for updates every 5 minutes
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
      <div className="maincontainer">
        {needsUpdate && (
          <div className="update-banner">
            A new version is available.
            <button onClick={handleReload}>Refresh</button>
          </div>
        )}
        {!isOnline && <div className="offline-banner">You are currently offline</div>}
        <Routes>
          {routes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
          {/* Catch-all route for 404s - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
