import { useConferenceGames, useSeasonData } from '#hooks/index.mjs';
import { addMetaTags } from '#utils/metaTags';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ConferenceGameList from '../components/conference/ConferenceGameList.tsx';
import IndependentsGameList from '../components/conference/IndependentsGameList.tsx';

const ConferenceGamesView: React.FC = () => {
  const { conference = '', year = '' } = useParams<'conference' | 'year'>();
  const { result: gameResult, loading: gameLoading, error: gameError } = useConferenceGames(
    year,
    conference,
    conference,
    conference
  );
  const { result: seasonResult } = useSeasonData(year);

  const title = `${conference?.charAt(0).toUpperCase() + conference?.slice(1)} Conference Games - ${year}`;

  useEffect(() => {
    addMetaTags(title);
  }, [title]);

  if (gameLoading) return <main><p>Loading conference games...</p></main>;
  if (gameError) return <main><p>Error loading conference games: {gameError.message}</p></main>;

  const games: any[] = gameResult?.conferenceGames ? Object.values(gameResult.conferenceGames)[0] ?? [] : [];
  const isIndependents = conference === 'independents';

  return (
    <main style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>{title}</h1>

      <nav style={{ marginBottom: '20px' }}>
        <a href={`/season/football/${year}`}>← Back to {year} Football</a>
      </nav>

      {isIndependents ? (
        <IndependentsGameList games={games} />
      ) : (
        <ConferenceGameList games={games} sport="football" />
      )}
    </main>
  );
};

export default ConferenceGamesView;
