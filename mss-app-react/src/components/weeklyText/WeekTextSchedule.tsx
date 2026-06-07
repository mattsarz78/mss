import { useResetAdsenseHeight, useWeekScheduleNav, useWeekTextSchedule } from '#hooks/index.mjs';
import { LazyAdsByGoogle, LazyBackToTop, LazyCopyrightLink } from '#shared/lazyIndex.tsx';
import { WeekTextBase, type WeekTextTableHandle } from '#text/index.tsx'; // 👈 Import handler interface
import React, { Suspense, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './WeekTextSchedule.module.css';
interface WeekTextScheduleProps {
  week: string;
  sport: string;
  paramYear: string;
}

const WeekTextSchedule: React.FC<WeekTextScheduleProps> = ({ week, sport, paramYear }) => {
  const mainRef = useResetAdsenseHeight();

  const tableRef = useRef<WeekTextTableHandle | null>(null);

  const year = useMemo(() => {
    return sport === 'football' ? paramYear : `${paramYear.slice(0, 4)}${paramYear.slice(5)}`;
  }, [sport, paramYear]);

  const weekInt = useMemo(() => parseInt(week), [week]);

  const {
    seasonContentsResult,
    seasonContentsLoading,
    seasonContentsError,
    nextWeek,
    previousWeek,
    isBowlWeek,
    isMbkPostseason,
    isWeekOne,
    isNextWeekMbkPostseason,
    isNextWeekBowlWeek,
  } = useWeekScheduleNav(sport, year, weekInt);

  const { tvGameResult, tvGameLoading, tvGameError } = useWeekTextSchedule(sport, year, weekInt);

  const isLoading = seasonContentsLoading || tvGameLoading;
  const isError = seasonContentsError || tvGameError;

  return (
    <main ref={mainRef}>
      {isLoading && (
        <div className={styles.loadingContainer}>
          <p className={styles.loadingText}>Loading...</p>
        </div>
      )}
      {isError && (
        <div className={styles.errorContainer}>
          <p>Sorry. Problem loading data.</p>
        </div>
      )}

      {seasonContentsResult && tvGameResult && (
        <nav role="navigation" className={`${styles.navbar} DONTPrint`}>
          <div className={styles.container}>
            <div className={styles.flexContainer}>
              <div className={styles.flexRow}>
                <Link to="/">Home</Link>
              </div>
              <div className={styles.flexRow}>
                <Link to={`/season/${sport}/${paramYear}`}>Season Home</Link>
              </div>
              <div className={styles.flexRow}>
                <Link className="DONTPrint" to={`/schedule/${sport}/${paramYear}/${week}`}>
                  Weekly Schedule
                </Link>
              </div>
            </div>

            {!isMbkPostseason && !isBowlWeek && (
              <div className={`${styles.flexContainerRow} ${styles.pad}`}>
                {isWeekOne ? (
                  <div className={styles.flexRowLeft}>
                    <Link to={`/schedule/${sport}/${paramYear}/${nextWeek}/text`}>Next Week</Link>
                  </div>
                ) : (
                  <>
                    <div className={styles.flexRowLeft}>
                      <Link to={`/schedule/${sport}/${paramYear}/${previousWeek}/text`}>Previous Week</Link>
                    </div>
                    {!isNextWeekMbkPostseason && !isNextWeekBowlWeek && (
                      <div className={styles.flexRowRight}>
                        <Link to={`/schedule/${sport}/${paramYear}/${nextWeek}/text`}>Next Week</Link>
                      </div>
                    )}
                  </>
                )}
                <br className={styles.mobilehide} />
              </div>
            )}
            <br />

            <p id="TextNav" className={`${styles.TextNav} DONTPrint`}>
              {/* 2. Call the methods directly off the reference pointer securely */}
              <button
                id="ClearAll"
                type="button"
                className={`${styles.inputpad} ${styles.buttonfont}`}
                onClick={() => tableRef.current?.clearAll()}
              >
                Clear All Games
              </button>

              <button
                id="CheckAll"
                type="button"
                className={`${styles.inputpad} ${styles.buttonfont}`}
                onClick={() => tableRef.current?.checkAll()}
              >
                Check All Games
              </button>
            </p>
          </div>
        </nav>
      )}

      {tvGameResult && (
        <>
          <WeekTextBase
            ref={tableRef} // 👈 3. Connect the element controller wire to your layout tree view
            season={year}
            tvGames={tvGameResult.tvGames!.tvGames}
            isBowlWeek={isBowlWeek}
            isMbkPostseason={isMbkPostseason}
            showPpvColumn={tvGameResult.tvGames!.showPPVColumn}
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

export default WeekTextSchedule;
