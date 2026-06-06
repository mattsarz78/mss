import type { TvGame } from '#/graphQl.mjs';
import { formatGame, formatTime, sanitizeHtml } from '#utils/index.mjs';
import React from 'react';
import styles from './PostseasonMbkEvent.module.css';

interface PostseasonMbkEventProps {
  tvGame: TvGame;
}

const PostseasonMbkEvent: React.FC<PostseasonMbkEventProps> = ({ tvGame }) => {
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

        {/* Dynamic Matchup Condition Block */}
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

      <td className={styles.coverage} dangerouslySetInnerHTML={{ __html: sanitizeHtml(tvGame.coverageNotes ?? '') }} />

      <td className={styles.time}>{formatTime(tvGame.timeWithOffset!)}</td>
    </>
  );
};

export default PostseasonMbkEvent;
