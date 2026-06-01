import { useDailyTvGames, useWebExclusives } from '#hooks/index.mjs';
import { addMetaTags } from '#utils/metaTags';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import WeeklyBase from '../components/weekly/WeeklyBase.tsx';

const DailyScheduleView: React.FC = () => {
  const { sport = '' } = useParams<'sport'>();
  const { result, loading, error, startDate } = useDailyTvGames(sport);
  const { isWebGamesHidden, toggleWebExclusives, buttonText } = useWebExclusives();

  const title = `${sport?.charAt(0).toUpperCase() + sport?.slice(1)} - Daily Schedule`;

  useEffect(() => {
    addMetaTags(title);
  }, [title]);

  if (loading) return <main><p>Loading daily schedule...</p></main>;
  if (error) return <main><p>Error loading daily schedule: {error.message}</p></main>;

  const games = result?.dailyTvGames?.tvGames ?? [];

  return (
    <main style={{ padding: '20px' }}>
      <h1>{title}</h1>
      <p>Games for {startDate}</p>
      <button onClick={toggleWebExclusives} style={{ marginBottom: '20px' }}>
        {buttonText}
      </button>
      <WeeklyBase games={games} sport={sport} />
    </main>
  );
};

export default DailyScheduleView;
