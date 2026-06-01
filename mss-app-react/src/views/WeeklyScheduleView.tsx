import { addMetaTags } from '#utils/metaTags.mjs';
import { setupPrintListener } from '#utils/printListener.mjs';
import { generateWeeklyTitle } from '#utils/weeklyTitle.mjs';
import { WebExclusivesProvider } from '#weekly/WebExclusiveContext.tsx';
import WeekSchedule from '#weekly/WeekSchedule.tsx';
import React, { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';

const WeeklyScheduleView: React.FC = () => {
  const {
    week = '',
    sport = '',
    year: paramYear = '',
  } = useParams<{
    week: string;
    sport: string;
    year: string;
  }>();

  const location = useLocation();

  const title = generateWeeklyTitle(sport, week, paramYear, false);

  // Sync meta tags whenever the routing dependencies change the title
  useEffect(() => {
    addMetaTags(title);
  }, [title]);

  // Bind the window print listener once when the view mounts
  useEffect(() => {
    setupPrintListener();
  }, []);

  return (
    <WebExclusivesProvider>
      <WeekSchedule
        /* Replicating :key="route.fullPath" triggers a total component unmount 
        and clean state reset on internal route alterations 
      */
        key={`${sport}-${paramYear}-${week}-${location.pathname}`}
        week={week}
        sport={sport}
        paramYear={paramYear}
      />
    </WebExclusivesProvider>
  );
};

export default WeeklyScheduleView;
