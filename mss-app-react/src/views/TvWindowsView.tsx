import { useSeasonData } from '#hooks/index.mjs';
import { addMetaTags } from '#utils/metaTags';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const TvWindowsView: React.FC = () => {
  const { year = '' } = useParams<'year'>();
  const { result, loading, error } = useSeasonData(year);

  useEffect(() => {
    addMetaTags(`TV Windows - ${year}`);
  }, [year]);

  if (loading) return <main><p>Loading TV windows...</p></main>;
  if (error) return <main><p>Error loading TV windows: {error.message}</p></main>;

  const flexScheduleLink = result?.seasonData?.flexScheduleLink;

  return (
    <main style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <h1>TV Windows - {year}</h1>
      {flexScheduleLink ? (
        <iframe
          title="TV Flex Schedule"
          src={flexScheduleLink}
          style={{
            flex: 1,
            border: 'none',
            width: '100%',
            minHeight: '600px'
          }}
          allowFullScreen
        />
      ) : (
        <p>TV windows data not available for {year}.</p>
      )}
    </main>
  );
};

export default TvWindowsView;
