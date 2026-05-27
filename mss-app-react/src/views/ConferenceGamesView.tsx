import React from 'react';
import { useParams } from 'react-router-dom';

const ConferenceGamesView: React.FC = () => {
  const { conference = '', year = '' } = useParams<'conference' | 'year'>();

  return (
    <main>
      <h1>{conference} Conference Games - {year}</h1>
      <p>Conference games for {conference} {year} goes here.</p>
    </main>
  );
};

export default ConferenceGamesView;
