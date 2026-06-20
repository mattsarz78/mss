import { useDailyTvGames, useResetAdsenseHeight, useWebExclusivesContext } from '#hooks/index.mjs';
import { LazyAdsByGoogle, LazyBackToTop, LazyCopyrightLink } from '#shared/lazyIndex.tsx';
import { addMetaTags, setupPrintListener } from '#utils/index.mjs';
import { WebExclusiveContext, WeeklyBase } from '#weekly/index.tsx';
import { DateTime } from 'luxon';
import React, { Suspense, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import styles from './DailyScheduleView.module.css';

const DailyTvGamesInner: React.FC = () => {
  const mainRef = useResetAdsenseHeight();
  // Pulling parameters via React Router DOM hook
  const { sport } = useParams<{ sport: string }>() as { sport: string };

  const {
    result: dailyTvGameResult,
    loading: dailyTvGameLoading,
    error: dailyTvGameError,
    season,
    startDate
  } = useDailyTvGames(sport);

  // Grab values out of the surrounding context pool wrapper
  const { toggleWebExclusives, buttonText } = useWebExclusivesContext();

  useEffect(() => {
    const title = `Daily TV Games for ${DateTime.now().toFormat('LLLL dd, yyyy')}`;
    addMetaTags(title);

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
              <div className={styles.flexContainer}>
                <div className={styles.flexRow}>
                  <Link to="/">Home</Link>
                </div>
                {season && (
                  <div className={styles.flexRow}>
                    <Link to={`/season/${sport}/${season}`}>Season Home</Link>
                  </div>
                )}
              </div>

              <div className={styles.flexContainer}>
                {dailyTvGameResult.dailyTvGames?.flexScheduleLink && (
                  <div className={styles.flexRow}>
                    <Link to={`/tv-windows/${season}`} target="_blank" rel="noopener">
                      Available TV Windows
                    </Link>
                  </div>
                )}
                <div className={styles.flexRow}>
                  <Link to={`/schedule/${sport}/daily/text`}>Customizable Text-Only Page</Link>
                </div>
                <br />
              </div>

              <div className={styles.filters}>
                <button
                  id="btnWebGames"
                  type="button"
                  className={`${styles.show_hideWeb} ${styles.buttonfont}`}
                  onClick={toggleWebExclusives}>
                  {buttonText}
                </button>
              </div>
            </div>
          </nav>

          <WeeklyBase
            tvGames={dailyTvGameResult.dailyTvGames!.tvGames}
            isBowlWeek={false}
            isMbkPostseason={false}
            isDaily={true}
            showPpvColumn={dailyTvGameResult.dailyTvGames!.showPPVColumn}
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

// Main Export wrapping the Inner Component in the WebExclusives Context Provider
const DailyTvGamesView: React.FC = () => {
  return (
    <WebExclusiveContext>
      <DailyTvGamesInner />
    </WebExclusiveContext>
  );
};

export default DailyTvGamesView;
