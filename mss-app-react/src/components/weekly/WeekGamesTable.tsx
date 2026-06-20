import type { TvGame } from '#/graphQl.mjs';
import { useWebExclusivesContext } from '#hooks/index.mjs';
import { PostseasonMbkEvent, WeekGameRow } from '#weekly/index.tsx';
import { DateTime } from 'luxon';
import React, { useMemo } from 'react';
import styles from './WeekGamesTable.module.css';

interface WeekGamesTableProps {
  weekDate: string;
  tvGamesForDate: TvGame[];
  isMbkPostseason: boolean;
  isBowlWeek: boolean;
  showPpvColumn: boolean;
}

const WeekGamesTable: React.FC<WeekGamesTableProps> = ({
  weekDate,
  tvGamesForDate,
  isMbkPostseason,
  isBowlWeek,
  showPpvColumn
}) => {
  const { isWebGamesHidden } = useWebExclusivesContext();
  // Replicating the computed date string layout formatter
  const formattedDate = useMemo(() => {
    return DateTime.fromISO(weekDate).toFormat('DDDD');
  }, [weekDate]);

  // Evaluate dynamic header showing condition
  const shouldShowPpvHeader = !isBowlWeek && !isMbkPostseason && showPpvColumn;

  return (
    <div>
      <h3>{formattedDate}</h3>
      <table className={styles.noTVTable}>
        <thead>
          <tr className={styles.header}>
            <th scope="col">Game</th>
            <th scope="col">Network</th>
            <th scope="col">Coverage Notes / Network Streaming</th>
            {shouldShowPpvHeader && <th scope="col">PPV</th>}
            <th scope="col">Time</th>
          </tr>
        </thead>
        <tbody>
          {tvGamesForDate.map((tvGame) => {
            const rowKey = `${tvGame.homeTeam}-${tvGame.timeWithOffset}`;
            const isWeb = tvGame.mediaIndicator === 'W';

            const classNames = [];

            if (isWeb) {
              classNames.push(styles.webGame);
            }

            if (isWeb && isWebGamesHidden) {
              classNames.push(styles.hidden);
            }

            return (
              <tr key={rowKey} className={classNames.join(' ')}>
                {isBowlWeek || isMbkPostseason ? (
                  <PostseasonMbkEvent tvGame={tvGame} />
                ) : (
                  <WeekGameRow showPPVColumn={showPpvColumn} tvGame={tvGame} />
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
      <br />
    </div>
  );
};

export default WeekGamesTable;
