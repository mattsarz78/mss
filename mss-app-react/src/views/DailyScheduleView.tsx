import { useResetAdsenseHeight } from '#/hooks/useResetAdsenseHeight.mjs';
import { useWebExclusivesContext } from '#/hooks/useWebExclusivesContext.mjs';
import { useDailyTvGames } from '#hooks/useDailyTvGames.mjs';
import Copyright from '#shared/CopyrightLink.tsx';
import { addMetaTags } from '#utils/metaTags.mjs';
import { setupPrintListener } from '#utils/printListener.mjs';
import { WebExclusivesProvider } from '#weekly/WebExclusiveContext.tsx';
import WeeklyBase from '#weekly/WeeklyBase.tsx';
import { DateTime } from 'luxon';
import React, { Suspense, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import styles from './DailyScheduleView.module.css';

// Lazy-Loaded Core Sub-Components
const BackToTop = React.lazy(() => import('#shared/BackToTop.tsx'));
const AdsByGoogle = React.lazy(() => import('#shared/AdsByGoogle.tsx'));

const DailyTvGamesInner: React.FC = () => {
  const mainRef = useResetAdsenseHeight();
  // Pulling parameters via React Router DOM hook
  const { sport } = useParams<{ sport: string }>() as { sport: string };

  const {
    result: dailyTvGameResult,
    loading: dailyTvGameLoading,
    error: dailyTvGameError,
    season,
    startDate,
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
                  onClick={toggleWebExclusives}
                >
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
            <BackToTop />
            <AdsByGoogle />
          </Suspense>

          <Copyright />
        </>
      )}
    </main>
  );
};

// Main Export wrapping the Inner Component in the WebExclusives Context Provider
const DailyTvGamesView: React.FC = () => {
  return (
    <WebExclusivesProvider>
      <DailyTvGamesInner />
    </WebExclusivesProvider>
  );
};

export default DailyTvGamesView;
