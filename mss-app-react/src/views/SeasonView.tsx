import React from 'react';
import { useParams } from 'react-router-dom';

const SeasonView: React.FC = () => {
  const { sport = '', year = '' } = useParams<'sport' | 'year'>();

  return (
    <main>
      <h1>{year} {sport?.charAt(0).toUpperCase() + sport?.slice(1)}</h1>
      <p>Season content for {sport} {year} goes here.</p>
    </main>
  );
};

export default SeasonView;
