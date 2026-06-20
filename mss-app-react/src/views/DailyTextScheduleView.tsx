import { useDailyTvTextGames, useResetAdsenseHeight } from '#hooks/index.mjs';
import { LazyAdsByGoogle, LazyBackToTop, LazyCopyrightLink } from '#shared/lazyIndex.tsx';
import { WeekTextBase, type WeekTextTableHandle } from '#text/index.tsx';
import { addMetaTags, formatDateLong, setupPrintListener } from '#utils/index.mjs';
import React, { Suspense, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './DailyTextScheduleView.module.css';

const DailyTvTextGamesView: React.FC = () => {
  const mainRef = useResetAdsenseHeight();

  // Wire the command handle reference to target the child table methods directly
  const tableRef = useRef<WeekTextTableHandle | null>(null);

  const { dailyTvGameResult, dailyTvGameLoading, dailyTvGameError, season, paramYear, sport, startDate } =
    useDailyTvTextGames();

  useEffect(() => {
    // Update Meta Title Strings
    const title = `Daily TV Games for ${formatDateLong(new Date())}`;
    addMetaTags(title);

    // Bind browser print listeners
    setupPrintListener();
  }, []);

  return (
    <main ref={mainRef}>
      {/* Loading Template View Tree */}
      {dailyTvGameLoading && (
        <div className={styles.loadingContainer}>
          <p className={styles.loadingText}>
            Loading {sport} for {startDate}
          </p>
        </div>
      )}

      {/* Error Template View Tree */}
      {dailyTvGameError && (
        <div className={styles.errorContainer}>
          <p>Sorry. Got a bit of a problem. Let Matt know.</p>
        </div>
      )}

      {/* Main Content Layout Block */}
      {dailyTvGameResult && (
        <>
          <nav role="navigation" className={`${styles.navbar} DONTPrint`}>
            <div className={styles.container}>
              <div className={styles.flexContainerRow}>
                <div className={styles.flexRow}>
                  <Link to="/">Home</Link>
                </div>
                <div className={styles.flexRow}>
                  <Link to={`/season/${sport}/${season}`}>Season Home</Link>
                </div>
                <div className={styles.flexRow}>
                  <Link className="DONTPrint" to={`/schedule/${sport}/daily`}>
                    Daily Schedule
                  </Link>
                </div>
              </div>
              <br />
              <p id="TextNav" className={`${styles.pad} DONTPrint`}>
                <button
                  id="ClearAll"
                  type="button"
                  className={`${styles.inputpad} ${styles.buttonfont}`}
                  onClick={() => tableRef.current?.clearAll()}>
                  Clear All Games
                </button>

                <button
                  id="CheckAll"
                  type="button"
                  className={`${styles.inputpad} ${styles.buttonfont}`}
                  onClick={() => tableRef.current?.checkAll()}>
                  Check All Games
                </button>
              </p>
            </div>
          </nav>

          <WeekTextBase
            ref={tableRef}
            season={paramYear}
            tvGames={dailyTvGameResult.dailyTvGames.tvGames}
            isBowlWeek={false}
            isMbkPostseason={false}
            showPpvColumn={dailyTvGameResult.dailyTvGames.showPPVColumn}
          />

          <Suspense fallback={null}>
            <LazyBackToTop />
            <LazyAdsByGoogle />
            <LazyCopyrightLink />
          </Suspense>
        </>
      )}
    </main>
  );
};

export default DailyTvTextGamesView;
