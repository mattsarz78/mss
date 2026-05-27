import React from 'react';
import { useParams } from 'react-router-dom';

const DailyTextScheduleView: React.FC = () => {
  const { sport = '' } = useParams<'sport'>();

  return (
    <main>
      <h1>{sport?.charAt(0).toUpperCase() + sport?.slice(1)} - Daily Text Schedule</h1>
      <p>Daily text schedule for {sport} goes here.</p>
    </main>
  );
};

export default DailyTextScheduleView;
