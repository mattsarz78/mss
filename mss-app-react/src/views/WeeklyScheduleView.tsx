import { useWeekSchedule } from '#hooks/useWeekSchedule.mjs';
import { addMetaTags } from '#utils/metaTags';
import React, { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import NoTvGames from '../components/noTVGames/NoTvGames.tsx';
import WeekSchedule from '../components/weekly/WeekSchedule.tsx';

const WeeklyScheduleView: React.FC = () => {
  const { sport = '', year = '', week = '' } = useParams<'sport' | 'year' | 'week'>();
  const weekNum = useMemo(() => parseInt(week) || 0, [week]);

  const { tvGameResult, tvGameLoading, tvGameError } = useWeekSchedule(sport, year, weekNum);

  const title = `${sport?.charAt(0).toUpperCase() + sport?.slice(1)} - Week ${week}, ${year}`;

  useEffect(() => {
    addMetaTags(title);
  }, [title]);

  if (tvGameLoading) return <main><p>Loading schedule...</p></main>;
  if (tvGameError) return <main><p>Error loading schedule: {tvGameError.message}</p></main>;

  const games = tvGameResult?.tvGames?.tvGames ?? [];
  const hasNoTVGames = tvGameResult?.tvGames?.hasNoTVGames ?? false;

  return (
    <main style={{ padding: '20px' }}>
      <h1>{title}</h1>
      <WeekSchedule games={games} sport={sport} />
      {hasNoTVGames && <NoTvGames week={week} year={year} />}
    </main>
  );
};

export default WeeklyScheduleView;
