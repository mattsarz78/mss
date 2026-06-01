import { checkAllTextRows, clearAllSelectedTextRows } from '#utils/domText.mjs';
import React, { useMemo } from 'react';

interface Game {
  matchup?: string;
  network?: string;
  time?: string;
  timeWithOffset?: string;
  gameTitle?: string;
  location?: string;
  ppv?: string;
  visitingTeam?: string[];
  homeTeam?: string[];
  [key: string]: any;
}

interface Props {
  games: Game[];
  sport: string;
}

const WeekTextSchedule: React.FC<Props> = ({ games, sport }) => {
  if (!games || games.length === 0) {
    return <p>No games scheduled.</p>;
  }

  // Group games by date
  const gamesByDate = useMemo(() => {
    const grouped: Record<string, (Game & { originalIndex: number })[]> = {};
    games.forEach((game, idx) => {
      const timeStr = game.timeWithOffset || game.time || 'Unknown Date';
      const dateMatch = timeStr.match(/^\d{4}-\d{2}-\d{2}/);
      const date = dateMatch ? dateMatch[0] : 'Unknown Date';

      if (!grouped[date]) grouped[date] = [];
      grouped[date].push({ ...game, originalIndex: idx });
    });
    return Object.entries(grouped).sort(([dateA], [dateB]) => dateA.localeCompare(dateB));
  }, [games]);

  return (
    <div className="week-text-schedule" style={{ fontFamily: 'monospace', fontSize: '11px', paddingTop: '130px' }}>
      <div id="TextNav" className="DONTPrint" style={{ marginBottom: '20px' }}>
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
            cursor: 'pointer',
            fontSize: '14px'
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
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Check All Games
        </button>
      </div>
      <table
        className="DOPrint"
        style={{
          width: '660px',
          borderCollapse: 'collapse',
          borderStyle: 'ridge',
          borderWidth: '2px',
          borderSpacing: '1px',
          margin: '0 auto',
          backgroundColor: '#fff'
        }}
      >
        <thead>
          <tr className="DOPrint">
            <th style={{ border: '1px solid gray', padding: '4px', textAlign: 'center', width: '30px' }} />
            <th style={{ border: '1px solid gray', padding: '4px', textAlign: 'left', width: '270px' }}>Game</th>
            <th style={{ border: '1px solid gray', padding: '4px', textAlign: 'center', width: '195px' }}>Network</th>
            <th style={{ border: '1px solid gray', padding: '4px', textAlign: 'center', width: '100px' }}>Time</th>
          </tr>
        </thead>
        <tbody>
          {gamesByDate.map(([date, dateGames]) =>
            dateGames.map((game, dateIdx) => (
              <tr
                key={`${date}-${dateIdx}`}
                className="gamerow DONTPrint"
                style={{
                  border: '1px solid gray',
                  backgroundColor: '#FFF'
                }}
              >
                <td style={{ border: '1px solid gray', padding: '4px', textAlign: 'center' }}>
                  <input
                    id={`checkBox${game.originalIndex}`}
                    className="checkBoxRow"
                    type="checkbox"
                    aria-label="Select this game?"
                  />
                </td>
                <td style={{ border: '1px solid gray', padding: '4px', textAlign: 'left' }}>
                  {game.gameTitle && (
                    <>
                      <span style={{ fontWeight: 'bold', fontStyle: 'italic' }}>{game.gameTitle}</span>
                      <br />
                    </>
                  )}
                  {game.visitingTeam && game.visitingTeam.length > 0 && game.visitingTeam[0] !== '' && (
                    <>
                      {game.visitingTeam[0]} {game.location ? 'vs.' : 'at'} {game.homeTeam?.[0]}
                      <br />
                    </>
                  )}
                  {game.location && <>(at {game.location})</>}
                </td>
                <td style={{ border: '1px solid gray', padding: '4px', textAlign: 'center' }}>{game.network}</td>
                <td style={{ border: '1px solid gray', padding: '4px', textAlign: 'center' }}>{game.time}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default WeekTextSchedule;
