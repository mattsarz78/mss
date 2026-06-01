import type { NoTvGame } from '#/graphQl.mjs';
import { formatWeekday } from '#utils/dateFormatting.mts';
import React, { useMemo } from 'react';

interface NoTvGamesTableProps {
  noTvGamesForDate: Partial<NoTvGame>[];
  noTvDate: string;
}

const NoTvGamesTable: React.FC<NoTvGamesTableProps> = ({ noTvGamesForDate, noTvDate }) => {
  // Replicating Vue's computed date string formatter
  const formattedDate = useMemo(() => {
    return formatWeekday(noTvDate);
  }, [noTvDate]);

  return (
    <div>
      <h3>{formattedDate}</h3>
      <table className="noTVTable">
        <thead>
          <tr className="header">
            <th scope="col">Game</th>
            <th scope="col">Conference</th>
            <th scope="col">Television Options</th>
          </tr>
        </thead>
        <tbody>
          {noTvGamesForDate.map((noTvGameForDate, index) => {
            // Apply dynamic row highlighting class if it's an FCS game
            const rowClass = noTvGameForDate.fcs ? 'fcsgame' : '';

            return (
              <tr key={index} className={rowClass}>
                <td className="game">
                  {noTvGameForDate.gameTitle && (
                    <>
                      <span className="gameTitle">{noTvGameForDate.gameTitle}</span>
                      <br />
                    </>
                  )}

                  {/* Layout block replicating the nested template condition layers */}
                  {noTvGameForDate.location ? (
                    <>
                      {noTvGameForDate.visitingTeam && (
                        <>
                          {noTvGameForDate.visitingTeam} vs. {noTvGameForDate.homeTeam}
                          <br />
                        </>
                      )}
                      (at {noTvGameForDate.location})
                    </>
                  ) : (
                    <>
                      {noTvGameForDate.visitingTeam && (
                        <>
                          {noTvGameForDate.visitingTeam} at {noTvGameForDate.homeTeam}
                          <br />
                        </>
                      )}
                    </>
                  )}
                </td>

                <td className="conference">{noTvGameForDate.conference}</td>

                <td className="telecast">{noTvGameForDate.tvOptions}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default NoTvGamesTable;
