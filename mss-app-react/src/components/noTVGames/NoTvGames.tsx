import { useNoTvSchedule } from '#hooks/index.mjs';
import { DateTime } from 'luxon';
import React, { useCallback, useState } from 'react';
import NoTvGamesTable from './NoTvGamesTable.tsx';

interface Props {
  week: string;
  year: string;
}

const NoTvGames: React.FC<Props> = ({ week, year }) => {
  const { noTvGamesResults, noTvGamesLoading, noTvGamesError, datesList, load } = useNoTvSchedule(week, year);

  const [showNoTV, setShowNoTV] = useState(false);

  const toggleNoTV = useCallback(async () => {
    await load();
    setShowNoTV((prev) => !prev);
  }, [load]);

  return (
    <div>
      <button
        id="btnConferenceGames"
        className="show_hideNoTV buttonfont"
        onClick={toggleNoTV}
        style={{
          display: 'inline-block',
          padding: '8px 12px',
          backgroundColor: '#2196f3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px'
        }}
      >
        {showNoTV ? 'Hide Non-Televised Games' : 'Show Non-Televised Games'}
      </button>
      <br />
      <br />
      {noTvGamesLoading && (
        <div
          style={{
            minHeight: '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            maxWidth: '800px',
            margin: '0 auto',
            background: '#fff',
            border: '1px solid #eee'
          }}
        >
          <p style={{ fontSize: '1.2em', color: '#666' }}>Loading Week {week} for {year}</p>
        </div>
      )}
      {noTvGamesError && (
        <div
          style={{
            minHeight: '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            maxWidth: '800px',
            margin: '0 auto',
            background: '#fff',
            border: '1px solid #eee'
          }}
        >
          <p>Sorry. Got a bit of a problem. Let Matt know.</p>
        </div>
      )}
      {showNoTV && noTvGamesResults && (
        <div style={{ paddingTop: '10px' }}>
          {!noTvGamesResults.noTvGames || noTvGamesResults.noTvGames.length === 0 ? (
            <p>All FBS games scheduled for this week are being televised or shown online</p>
          ) : (
            <>
              {datesList.map((noTVDate, index) => {
                const noTVGamesForDate = (noTvGamesResults.noTvGames || []).filter((game: any) => {
                  if (!game.timeWithOffset) return false;
                  const gameDate = DateTime.fromISO(game.timeWithOffset).setZone('America/New_York').toISODate();
                  return gameDate === noTVDate;
                });

                return (
                  <NoTvGamesTable
                    key={index}
                    noTvDate={noTVDate}
                    noTvGamesForDate={noTVGamesForDate}
                  />
                );
              })}
              <br />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default NoTvGames;
