import { useNoTvSchedule } from '#hooks/index.mjs';
import styles from '#noTv/NoTvGames.module.css';
import NoTvGamesTable from '#noTv/NoTvGamesTable.tsx';
import { DateTime } from 'luxon';
import React, { useState } from 'react';

interface NoTvGamesProps {
  week: string;
  year: string;
}

const NoTvGames: React.FC<NoTvGamesProps> = ({ week, year }) => {
  const { noTvGamesResults, noTvGamesLoading, noTvGamesError, datesList, load } = useNoTvSchedule(week, year);

  const [showNoTV, setShowNoTV] = useState(false);

  const toggleNoTV = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await load();
    setShowNoTV((prev) => !prev);
  };

  // Parity matching the manual text mutation strings
  const buttonText = showNoTV ? 'Hide Non-Televised Games' : 'Show Non-Televised Games';

  return (
    <div>
      <p>
        <button
          id="btnConferenceGames"
          type="button"
          className={`${styles.show_hideNoTV} ${styles.buttonFont}`}
          onClick={toggleNoTV}
        >
          {buttonText}
        </button>
      </p>
      {noTvGamesLoading && (
        <div className={styles.loadingContainer}>
          <p className={styles.loadingText}>
            Loading Week {week} for {year}
          </p>
        </div>
      )}

      {noTvGamesError && (
        <div className={styles.errorContainer}>
          <p>Sorry. Got a bit of a problem. Let Matt know.</p>
        </div>
      )}

      {showNoTV && noTvGamesResults && (
        <div className={styles.slidingNoTVDiv}>
          {!noTvGamesResults?.noTvGames || noTvGamesResults.noTvGames.length === 0 ? (
            <p>All FBS games scheduled for this week are being televised or shown online</p>
          ) : (
            <>
              {datesList.map((noTVDate, index) => {
                const filteredGames =
                  noTvGamesResults?.noTvGames?.filter(
                    (x: { timeWithOffset?: string }) =>
                      x.timeWithOffset &&
                      DateTime.fromISO(x.timeWithOffset).setZone('America/New_York').toISODate() === noTVDate
                  ) || [];

                return <NoTvGamesTable key={index} noTvDate={noTVDate} noTvGamesForDate={filteredGames} />;
              })}
              <br />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default NoTvGames;
