import { addMetaTags, generateWeeklyTitle, setupPrintListener } from '#utils/index.mjs';
import { WebExclusiveContext, WeekSchedule } from '#weekly/index.tsx';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const WeeklyScheduleView: React.FC = () => {
  const { week = '', sport = '', year: paramYear = '' } = useParams<{ week: string; sport: string; year: string }>();

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
    <WebExclusiveContext>
      <WeekSchedule week={week} sport={sport} paramYear={paramYear} />
    </WebExclusiveContext>
  );
};

export default WeeklyScheduleView;
