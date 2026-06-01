import { formatWeekday } from '#utils/dateFormatting.mjs';
import React, { useMemo } from 'react';

interface NoTvGame {
  gameTitle?: string;
  visitingTeam: string;
  homeTeam: string;
  location?: string;
  conference: string;
  tvOptions: string;
  timeWithOffset: string;
  fcs?: string;
}

interface Props {
  noTvDate: string;
  noTvGamesForDate: NoTvGame[];
}

const NoTvGamesTable: React.FC<Props> = ({ noTvDate, noTvGamesForDate }) => {
  const formattedDate = useMemo(() => formatWeekday(noTvDate), [noTvDate]);

  return (
    <div style={{ marginBottom: '30px' }}>
      <h3 style={{ marginBottom: '15px' }}>{formattedDate}</h3>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          backgroundColor: '#fff',
          border: '2px ridge #fff',
          borderSpacing: '1px'
        }}
      >
        <thead>
          <tr style={{ textAlign: 'center' }}>
            <th style={{ padding: '8px', border: '1px solid gray' }}>Game</th>
            <th style={{ padding: '8px', border: '1px solid gray' }}>Conference</th>
            <th style={{ padding: '8px', border: '1px solid gray' }}>Television Options</th>
          </tr>
        </thead>
        <tbody>
          {noTvGamesForDate.map((game, index) => (
            <tr
              key={index}
              style={{
                backgroundColor: game.fcs ? '#ffff00' : 'transparent'
              }}
            >
              <td
                style={{
                  width: '243px',
                  padding: '2px',
                  border: '1px solid gray',
                  textAlign: 'left'
                }}
              >
                {game.gameTitle && (
                  <>
                    <span style={{ fontWeight: 'bold', fontStyle: 'italic' }}>{game.gameTitle}</span>
                    <br />
                  </>
                )}
                {game.location ? (
                  <>
                    {game.visitingTeam} vs. {game.homeTeam}
                    <br />
                    (at {game.location})
                  </>
                ) : (
                  <>
                    {game.visitingTeam} at {game.homeTeam}
                    <br />
                  </>
                )}
              </td>
              <td
                style={{
                  width: '100px',
                  padding: '5px',
                  border: '1px solid gray',
                  textAlign: 'center'
                }}
              >
                {game.conference}
              </td>
              <td
                style={{
                  width: '400px',
                  padding: '5px',
                  border: '1px solid gray',
                  textAlign: 'center'
                }}
              >
                {game.tvOptions}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NoTvGamesTable;
