import React, { useMemo } from 'react';

interface Game {
  matchup?: string;
  network?: string;
  time?: string;
  timeWithOffset?: string;
  [key: string]: any;
}

interface Props {
  games: Game[];
  sport: string;
}

const WeeklyBase: React.FC<Props> = ({ games, sport }) => {
  if (!games || games.length === 0) {
    return <p>No games scheduled for this period.</p>;
  }

  // Group games by date
  const gamesByDate = useMemo(() => {
    const grouped: Record<string, Game[]> = {};
    games.forEach((game) => {
      const timeStr = game.timeWithOffset || game.time || 'Unknown Date';
      const dateMatch = timeStr.match(/^\d{4}-\d{2}-\d{2}/);
      const date = dateMatch ? dateMatch[0] : 'Unknown Date';

      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(game);
    });
    return Object.entries(grouped).sort(([dateA], [dateB]) => dateA.localeCompare(dateB));
  }, [games]);

  return (
    <div className="weekly-base">
      {gamesByDate.map(([date, dateGames]) => (
        <section key={date} style={{ marginBottom: '40px' }}>
          <h3 style={{ color: '#333', borderBottom: '2px solid #2196f3', paddingBottom: '10px' }}>
            {date}
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Matchup</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Time</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Network</th>
              </tr>
            </thead>
            <tbody>
              {dateGames.map((game, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px', textAlign: 'left' }}>{game.matchup}</td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>{game.time}</td>
                  <td style={{ padding: '10px', textAlign: 'right' }}>{game.network}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
    </div>
  );
};

export default WeeklyBase;
