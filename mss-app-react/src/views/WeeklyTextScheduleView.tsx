import WeekTextSchedule from '#text/WeekTextSchedule.tsx';
import { addMetaTags, generateWeeklyTitle, setupPrintListener } from '#utils/index.mjs';
import React, { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';

const WeekTextScheduleView: React.FC = () => {
  // 1. Pull parameters via React Router DOM hook
  const {
    week,
    sport,
    year: paramYear,
  } = useParams<{ week: string; sport: string; year: string }>() as {
    week: string;
    sport: string;
    year: string;
  };

  const location = useLocation();

  useEffect(() => {
    const title = generateWeeklyTitle(sport, week, paramYear, true);
    addMetaTags(title);

    // 4. Bind document printing side-effects listener routine
    setupPrintListener();
  }, [week, sport, paramYear]); // Re-run if path variables swap out

  return <WeekTextSchedule key={location.pathname} week={week} sport={sport} paramYear={paramYear} />;
};

export default WeekTextScheduleView;
