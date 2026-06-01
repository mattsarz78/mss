import { useWeekTextSchedule } from '#hooks/useWeekTextSchedule.mjs';
import { BackToTop, CopyrightLink } from '#shared/index.mjs';
import { addMetaTags } from '#utils/metaTags';
import { setupPrintListener } from '#utils/printListener.mjs';
import { generateWeeklyTitle } from '#utils/weeklyTitle.mjs';
import React, { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import AdsByGoogle from '../components/shared/AdsByGoogle.tsx';
import WeekTextSchedule from '../components/weeklyText/WeekTextSchedule.tsx';

const WeeklyTextScheduleView: React.FC = () => {
  const { sport = '', year = '', week = '' } = useParams<'sport' | 'year' | 'week'>();
  const weekNum = useMemo(() => parseInt(week) || 0, [week]);

  const { tvGameResult, tvGameLoading, tvGameError } = useWeekTextSchedule(sport, year, weekNum);

  const title = useMemo(() => generateWeeklyTitle(sport, week, year, true), [sport, week, year]);

  useEffect(() => {
    addMetaTags(title);
    setupPrintListener();
  }, [title]);

  if (tvGameLoading) {
    return (
      <div style={{ minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontSize: '1.2em', color: '#666' }}>Loading schedule...</p>
      </div>
    );
  }

  if (tvGameError) {
    return (
      <div style={{ minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Error loading schedule: {tvGameError.message}</p>
      </div>
    );
  }

  const games = tvGameResult?.tvGames?.tvGames ?? [];

  return (
    <div key={`${sport}-${year}-${week}`}>
      <WeekTextSchedule games={games} sport={sport} />
      <BackToTop />
      <AdsByGoogle />
      <CopyrightLink />
    </div>
  );
};

export default WeeklyTextScheduleView;
