import React from 'react';
import { useParams } from 'react-router-dom';

const WeeklyTextScheduleView: React.FC = () => {
  const { sport = '', year = '', week = '' } = useParams<'sport' | 'year' | 'week'>();

  return (
    <main>
      <h1>{sport?.charAt(0).toUpperCase() + sport?.slice(1)} - Week {week}, {year} (Text)</h1>
      <p>Weekly text schedule for {sport} week {week} {year} goes here.</p>
    </main>
  );
};

export default WeeklyTextScheduleView;
