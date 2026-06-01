import React from 'react';

interface Game {
  matchup?: string;
  network?: string;
  time?: string;
  [key: string]: any;
}

interface Props {
  games: Game[];
}

const IndependentsGameList: React.FC<Props> = ({ games }) => {
  if (!games || games.length === 0) {
    return <p>No independent games available.</p>;
  }

  return (
    <div className="independents-game-list">
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #333' }}>
            <th style={{ padding: '12px', textAlign: 'left' }}>Matchup</th>
            <th style={{ padding: '12px', textAlign: 'center' }}>Time</th>
            <th style={{ padding: '12px', textAlign: 'right' }}>Network</th>
          </tr>
        </thead>
        <tbody>
          {games.map((game, idx) => (
            <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px', textAlign: 'left' }}>{game.matchup}</td>
              <td style={{ padding: '10px', textAlign: 'center' }}>{game.time}</td>
              <td style={{ padding: '10px', textAlign: 'right' }}>{game.network}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IndependentsGameList;
