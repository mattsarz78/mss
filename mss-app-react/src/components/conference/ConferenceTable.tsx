import type { ConferenceGame } from '#/graphQl.mjs';
import { sanitizeHtml, formatGame, formatTime } from '#utils/index.mjs';
import { DateTime } from 'luxon';
import React, { useMemo } from 'react';
import styles from './ConferenceTable.module.css';

interface ConferenceTableProps {
  games: ConferenceGame[];
  year?: string; // Kept optional as it wasn't explicitly used in the Vue script template
}

const ConferenceTable: React.FC<ConferenceTableProps> = ({ games }) => {
  // Helper to determine the local or regional datetime source
  const getTimeSource = (timeWithOffset: string) => {
    const eastern = DateTime.fromISO(timeWithOffset).setZone('America/New_York');
    return eastern.toFormat('t') === '12:00 AM' ? eastern : DateTime.fromISO(timeWithOffset).toLocal();
  };

  // Replicating Vue's computed mapping with useMemo
  const formattedGames = useMemo(() => {
    if (!games) return [];

    return games.map((game) => {
      const timeSource = getTimeSource(game.timeWithOffset);
      return {
        ...game,
        formattedNetwork: game.network ?? '',
        formattedTime: {
          day: timeSource.toFormat('cccc'),
          date: timeSource.toFormat('LL/dd'),
          time: formatTime(game.timeWithOffset),
        },
      };
    });
  }, [games]);

  return (
    <table className={styles.noTVTable}>
      <thead>
        <tr className={styles.header}>
          <th scope="col">Game</th>
          <th scope="col">Network</th>
          <th scope="col">Time</th>
        </tr>
      </thead>
      <tbody>
        {formattedGames.map((game, index) => {
          // Destructure structural fields for simpler inline layout evaluations
          const { visitingTeam = [], homeTeam = [], location, gameTitle, formattedNetwork, formattedTime } = game;

          const hasVisitingTeams = visitingTeam.length > 0 && visitingTeam[0] !== '';
          const isStandardMatchup = visitingTeam.length === 1 && homeTeam.length === 1 && visitingTeam[0] !== '';

          return (
            <tr key={index}>
              <td className={styles.game}>
                {gameTitle && (
                  <>
                    <span className={styles.gameTitle}>{gameTitle}</span>
                    <br />
                  </>
                )}

                {/* Matchup template condition logic */}
                {!hasVisitingTeams ? null : isStandardMatchup ? (
                  <>
                    {visitingTeam[0]} {location ? 'vs.' : 'at'} {homeTeam[0]}
                    <br />
                  </>
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(formatGame(game)) }} />
                )}

                {location && <> (at {location}) </>}
              </td>

              <td className={styles.network} dangerouslySetInnerHTML={{ __html: sanitizeHtml(formattedNetwork) }} />

              <td className={styles.time}>
                {formattedTime.day}
                <br />
                {formattedTime.date}
                <br />
                {formattedTime.time}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default ConferenceTable;
