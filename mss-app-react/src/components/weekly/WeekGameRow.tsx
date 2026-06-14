import type { TvGame } from '#/graphQl.mjs';
import { formatGame, formatTime, sanitizeHtml } from '#utils/index.mjs';
import React from 'react';
import styles from './WeekGameRow.module.css';

interface WeekGameRowProps {
  tvGame: TvGame;
  showPPVColumn: boolean;
}

const WeekGameRow: React.FC<WeekGameRowProps> = ({ tvGame, showPPVColumn }) => {
  const visitingTeam = tvGame.visitingTeam ?? [];
  const homeTeam = tvGame.homeTeam ?? [];

  const hasVisitingTeams = visitingTeam.length > 0 && visitingTeam[0] !== '';
  const isStandardMatchup = visitingTeam.length === 1 && homeTeam.length === 1 && visitingTeam[0] !== '';

  return (
    <>
      <td className={styles.game}>
        {tvGame.gameTitle && (
          <>
            <span className={styles.gameTitle}>{tvGame.gameTitle}</span>
            <br />
          </>
        )}

        {/* Dynamic Matchup Matcher Condition */}
        {!hasVisitingTeams ? null : isStandardMatchup ? (
          <>
            {visitingTeam[0]} {tvGame.location ? 'vs.' : 'at'} {homeTeam[0]}
            <br />
          </>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(formatGame(tvGame)) }} />
        )}

        {tvGame.location && <> (at {tvGame.location}) </>}
      </td>

      <td className={styles.network} dangerouslySetInnerHTML={{ __html: sanitizeHtml(tvGame.networkJpg ?? '') }} />

      <td
        className={showPPVColumn ? styles.coverage : styles.coverageppv}
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(tvGame.coverageNotes ?? '') }}
      />

      {showPPVColumn && (
        <td className={styles.ppv} dangerouslySetInnerHTML={{ __html: sanitizeHtml(tvGame.ppv ?? '') }} />
      )}

      <td className={styles.time}>{formatTime(tvGame.timeWithOffset!)}</td>
    </>
  );
};

export default React.memo(WeekGameRow);
