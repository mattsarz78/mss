import { useDailyTvTextGames } from '#hooks/index.mjs';
import { BackToTop, CopyrightLink } from '#shared/index.mjs';
import { formatDateLong } from '#utils/dateFormatting.mjs';
import { addMetaTags } from '#utils/metaTags';
import { setupPrintListener } from '#utils/printListener.mjs';
import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import AdsByGoogle from '../components/shared/AdsByGoogle.tsx';
import WeekTextBase from '../components/weeklyText/WeekTextBase.tsx';

const DailyTextScheduleView: React.FC = () => {
  const { sport = '' } = useParams<'sport'>();
  const {
    dailyTvGameResult: result,
    dailyTvGameLoading: loading,
    dailyTvGameError: error,
    season,
    paramYear,
    startDate
  } = useDailyTvTextGames(sport);

  const title = `Daily TV Games for ${formatDateLong(new Date())}`;

  useEffect(() => {
    addMetaTags(title);
    setupPrintListener();
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontSize: '1.2em', color: '#666' }}>Loading {sport} for {startDate}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Sorry. Got a bit of a problem. Let Matt know.</p>
      </div>
    );
  }

  const games = result?.dailyTvGames?.tvGames ?? [];

  return (
    <div>
      <nav
        role="navigation"
        className="navbar DONTPrint"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          width: '100%',
          backgroundColor: 'white',
          padding: '2px 0',
          boxShadow: '0 1px 1px rgba(0, 0, 0, 0.1)',
          height: '119.5px',
          display: 'block'
        }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto', height: '100%' }}>
          <div style={{ display: 'flex', gap: '20px', padding: '10px' }}>
            <Link to="/" style={{ textDecoration: 'none', color: '#2196f3' }}>Home</Link>
            <Link to={`/season/${sport}/${season}`} style={{ textDecoration: 'none', color: '#2196f3' }}>Season Home</Link>
            <Link to={`/schedule/${sport}/daily`} className="DONTPrint" style={{ textDecoration: 'none', color: '#2196f3' }}>Daily Schedule</Link>
          </div>
          <div style={{ padding: '5px 10px' }} className="DONTPrint">
            <button
              id="ClearAll"
              className="inputpad buttonfont"
              onClick={clearAllSelectedTextRows}
              style={{
                padding: '10px 15px',
                marginRight: '10px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Clear All Games
            </button>
            <button
              id="CheckAll"
              className="inputpad buttonfont"
              onClick={checkAllTextRows}
              style={{
                padding: '10px 15px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Check All Games
            </button>
          </div>
        </div>
      </nav>
      <main style={{ paddingTop: '130px' }}>
        <WeekTextBase games={games} sport={sport} />
      </main>
      <BackToTop />
      <AdsByGoogle />
      <CopyrightLink />
    </div>
  );
};

export default DailyTextScheduleView;
