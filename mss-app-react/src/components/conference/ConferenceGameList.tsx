import React from 'react';

interface Game {
  matchup?: string;
  network?: string;
  time?: string;
  [key: string]: any;
}

interface Props {
  games: Game[];
  sport: string;
}

const ConferenceGameList: React.FC<Props> = ({ games, sport }) => {
  if (!games || games.length === 0) {
    return <p>No games available for this conference.</p>;
  }

  // Group games by network/category
  const groupedGames = games.reduce(
    (acc, game) => {
      const network = game.network || 'Other';
      if (!acc[network]) acc[network] = [];
      acc[network].push(game);
      return acc;
    },
    {} as Record<string, Game[]>
  );

  return (
    <div className="conference-game-list">
      {Object.entries(groupedGames).map(([network, networkGames]) => (
        <section key={network} style={{ marginBottom: '30px' }}>
          <h3 style={{ color: '#333', borderBottom: '2px solid #2196f3', paddingBottom: '10px' }}>
            {network}
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {networkGames.map((game, idx) => (
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

export default ConferenceGameList;
