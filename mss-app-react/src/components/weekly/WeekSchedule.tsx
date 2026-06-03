import { useCurrentTimeET } from '#hooks/useCurrentTimeET.mjs';
import { useWeekSchedule } from '#hooks/useWeekSchedule.mjs';
import { useWeekScheduleNav } from '#hooks/useWeekScheduleNav.mjs';
import NoTvGames from '#noTv/NoTvGames.tsx';
import Copyright from '#shared/CopyrightLink.tsx';
import { useWebExclusivesContext } from '#weekly/WebExclusiveContext.tsx';
import WeeklyBase from '#weekly/WeeklyBase.tsx';
import { DateTime } from 'luxon';
import React, { Suspense, useMemo } from 'react';
import { Link } from 'react-router-dom';
import styles from './WeekSchedule.module.css';

const BackToTop = React.lazy(() => import('#shared/BackToTop.tsx'));
const AdsByGoogle = React.lazy(() => import('#shared/AdsByGoogle.tsx'));

interface WeekScheduleProps {
  week: string;
  sport: string;
  paramYear: string;
}

const WeekSchedule: React.FC<WeekScheduleProps> = ({ week, sport, paramYear }) => {
  // Replicating computed year string formatting logic
  const year = useMemo(() => {
    return sport === 'football' ? paramYear : `${paramYear.slice(0, 4)}${paramYear.slice(5)}`;
  }, [sport, paramYear]);

  const { toggleWebExclusives, buttonText } = useWebExclusivesContext();
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

  const { currentTimeISO } = useCurrentTimeET();

  // Replicating computed logic checking if games run today
  const gamesToday = useMemo(() => {
    const nowIso = currentTimeISO;
    if (!nowIso || !seasonContentsResult?.seasonContents?.seasonContents) return false;

    return seasonContentsResult.seasonContents.seasonContents.some(
      (content: { week: number; startDate: string; endDate: string }) => {
        if (content.week !== weekInt) return false;
        const startIso = DateTime.fromISO(content.startDate).toUTC().toISO();
        const endIso = DateTime.fromISO(content.endDate).toUTC().toISO();
        if (!startIso || !endIso) return false;
        return startIso <= nowIso && endIso >= nowIso;
      }
    );
  }, [currentTimeISO, seasonContentsResult, weekInt]);

  // Replicating computed navbar dynamic class lookup
  const navbarClass = useMemo(() => {
    if (isMbkPostseason) return styles.mbkHeight;
    if (isBowlWeek) return styles.bowlHeight;
    if (gamesToday) return styles.navbarPadHeight;
    return styles.navbarHeight;
  }, [isMbkPostseason, isBowlWeek, gamesToday]);

  const { tvGameResult, tvGameLoading, tvGameError } = useWeekSchedule(sport, year, weekInt);

  // --- Unified Status Templates ---

  if (seasonContentsLoading || tvGameLoading) {
    return (
      <div className={styles.loadingContainer}>
        <p className={styles.loadingText}>
          Loading Week {week} for {paramYear}
        </p>
      </div>
    );
  }

  if (seasonContentsError || tvGameError) {
    return (
      <div className={styles.errorContainer}>
        <p>Sorry. Got a bit of a problem. Let Matt know.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Navigation Layout - Displays when data payloads resolve successfully */}
      {seasonContentsResult && tvGameResult && (
        <nav role="navigation" className={`${styles.navbar} ${styles.DONTPrint} ${navbarClass}`}>
          <div className={styles.container}>
            <div className={styles.flexContainer}>
              <div className={styles.flexRow}>
                <Link to="/">Home</Link>
              </div>
              <div className={styles.flexRow}>
                <Link to={`/season/${sport}/${paramYear}`}>Season Home</Link>
              </div>
              {gamesToday && (
                <div className={styles.flexRow}>
                  <Link to={`/schedule/${sport}/daily`}>Today's Schedule </Link>
                </div>
              )}
            </div>

            <div className={styles.flexContainer}>
              {seasonContentsResult.seasonContents?.flexScheduleLink && (
                <div className={styles.flexRow}>
                  <Link to={`/tv-windows/${paramYear}`} target="_blank" rel="noopener">
                    Available TV Windows
                  </Link>
                </div>
              )}
              <div className={styles.flexRow}>
                <Link to={`/schedule/${sport}/${paramYear}/${week}/text`}>Customizable Text-Only Page</Link>
              </div>
            </div>

            {!isMbkPostseason && !isBowlWeek && (
              <div className={`${styles.flexContainerRow} ${styles.pad}`}>
                {isWeekOne ? (
                  <div className={styles.flexRowLeft}>
                    <Link to={`/schedule/${sport}/${paramYear}/${nextWeek}`}>Next Week</Link>
                  </div>
                ) : (
                  <>
                    <div className={styles.flexRowLeft}>
                      <Link to={`/schedule/${sport}/${paramYear}/${previousWeek}`}>Previous Week</Link>
                    </div>
                    {!isNextWeekMbkPostseason && !isNextWeekBowlWeek && (
                      <div className={styles.flexRowRight}>
                        <Link to={`/schedule/${sport}/${paramYear}/${nextWeek}`}>Next Week </Link>
                      </div>
                    )}
                  </>
                )}
                <br className={styles.mobilehide} />
              </div>
            )}
            <br />

            {tvGameResult && (
              <div className={styles.filters}>
                {!isBowlWeek && !isMbkPostseason && (
                  <button
                    id="btnWebGames"
                    type="button"
                    className={`${styles.show_hideWeb} ${styles.buttonFont}`}
                    onClick={toggleWebExclusives}
                  >
                    {buttonText}
                  </button>
                )}
              </div>
            )}
          </div>
        </nav>
      )}

      {/* Main Schedule Content Output Trees */}
      {tvGameResult && (
        <>
          <WeeklyBase
            tvGames={tvGameResult.tvGames!.tvGames}
            isBowlWeek={isBowlWeek}
            isMbkPostseason={isMbkPostseason}
            isDaily={false}
            showPpvColumn={tvGameResult.tvGames!.showPPVColumn}
          />

          {!isBowlWeek && tvGameResult.tvGames!.hasNoTVGames && <NoTvGames year={year} week={week} />}

          <Suspense fallback={null}>
            <BackToTop />
            <AdsByGoogle />
          </Suspense>
          <Copyright />
        </>
      )}
    </div>
  );
};

export default WeekSchedule;
