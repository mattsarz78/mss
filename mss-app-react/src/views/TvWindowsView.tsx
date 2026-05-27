import React from 'react';
import { useParams } from 'react-router-dom';

const TvWindowsView: React.FC = () => {
  const { year = '' } = useParams<'year'>();

  return (
    <main>
      <h1>TV Windows - {year}</h1>
      <p>TV Windows content for {year} goes here.</p>
    </main>
  );
};

export default TvWindowsView;
