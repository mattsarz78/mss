import React, { useMemo, useState } from 'react';

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

const WeekTextBase: React.FC<Props> = ({ games, sport }) => {
  const [checkedIndices, setCheckedIndices] = useState<Set<number>>(new Set());

  if (!games || games.length === 0) {
    return <p>No games scheduled.</p>;
  }

  // Group games by date for text view
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

  const toggleCheckbox = (index: number) => {
    setCheckedIndices((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <div
      className="week-text-base"
      style={{ fontFamily: 'monospace', fontSize: '12px', lineHeight: '1.6', paddingTop: '130px' }}
    >
      <p style={{ fontSize: '11px', color: '#666', marginBottom: '20px' }} className="DONTPrint">
        All start times displayed are based on your device's location. If you have trouble selecting &amp; printing
        games, please try selecting games, changing your print settings to "Print to PDF", print, then open the PDF file
        and print that.
      </p>
      <table
        className="DOPrint"
        style={{
          width: '660px',
          borderCollapse: 'collapse',
          borderStyle: 'ridge',
          borderWidth: '2px',
          borderSpacing: '1px',
          margin: '0 auto'
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
            dateGames.map((game, dateIdx) => {
              const isChecked = checkedIndices.has(game.originalIndex);
              return (
                <tr
                  key={`${date}-${dateIdx}`}
                  className={`gamerow ${isChecked ? 'DOPrint' : 'DONTPrint'}`}
                  style={{
                    border: '1px solid gray',
                    backgroundColor: isChecked ? '#CCC' : '#FFF'
                  }}
                >
                  <td style={{ border: '1px solid gray', padding: '4px', textAlign: 'center' }}>
                    <input
                      id={`checkBox${game.originalIndex}`}
                      className="checkBoxRow"
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleCheckbox(game.originalIndex)}
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
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default WeekTextBase;
