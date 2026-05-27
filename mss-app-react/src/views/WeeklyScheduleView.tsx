import React from 'react';
import { useParams } from 'react-router-dom';

const WeeklyScheduleView: React.FC = () => {
  const { sport = '', year = '', week = '' } = useParams<'sport' | 'year' | 'week'>();

  return (
    <main>
      <h1>{sport?.charAt(0).toUpperCase() + sport?.slice(1)} - Week {week}, {year}</h1>
      <p>Weekly schedule for {sport} week {week} {year} goes here.</p>
    </main>
  );
};

export default WeeklyScheduleView;
