import { useSeasonContents } from '#hooks/useSeasonContents.mjs';
import { addMetaTags } from '#utils/metaTags';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ConferenceList from '../components/season/ConferenceList.tsx';
import SeasonDates from '../components/season/SeasonDates.tsx';

const SeasonView: React.FC = () => {
  const { sport = '', year = '' } = useParams<'sport' | 'year'>();
  const { result, loading, error } = useSeasonContents(year);

  const title = `${year} ${sport?.charAt(0).toUpperCase() + sport?.slice(1)}`;

  useEffect(() => {
    addMetaTags(title);
  }, [title]);

  if (loading) return <main><p>Loading season...</p></main>;
  if (error) return <main><p>Error loading season: {error.message}</p></main>;

  const seasonData = result?.seasonContents;

  return (
    <main style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>{title}</h1>
      
      {seasonData && (
        <>
          <section style={{ marginBottom: '40px' }}>
            <h2>Schedule</h2>
            <SeasonDates weeks={seasonData.seasonContents} sport={sport} />
          </section>

          {sport === 'football' && (
            <section style={{ marginBottom: '40px' }}>
              <h2>Conferences</h2>
              <ConferenceList sport={sport} year={year} />
            </section>
          )}
        </>
      )}
    </main>
  );
};

export default SeasonView;
