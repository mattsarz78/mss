import { ConferenceGameList, IndependentsGameList } from '#conference/index.tsx';
import conferenceCasing from '#data/conferenceCasing.json' with { type: 'json' };
import type { ConferenceCasing } from '#data/exportTypes.mjs';
import { useConferenceGames, useResetAdsenseHeight, useSeasonData } from '#hooks/index.mjs';
import { LazyAdsByGoogle, LazyBackToTop, LazyCopyrightLink } from '#shared/lazyIndex.tsx';
import { addMetaTags, setupPrintListener } from '#utils/index.mjs';
import React, { Suspense, useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import styles from './ConferenceGamesView.module.css';

interface RouteParams {
  conference: string;
  year: string;
  [key: string]: string | undefined;
}

const ConferenceGamesView: React.FC = () => {
  const mainRef = useResetAdsenseHeight();
  const { conference, year } = useParams<RouteParams>() as { conference: string; year: string };

  // Locate the configuration layout meta matching our route slug
  const conferenceData = useMemo(() => {
    return (conferenceCasing as ConferenceCasing[]).find((x) => x.slug === conference);
  }, [conference]);

  // Extract variables with structural fallback safe targets
  const cased = conferenceData?.cased ?? '';
  const lookup = conferenceData?.lookup ?? '';
  const id = conferenceData?.id ?? '';

  const { result: seasonResult, loading: seasonLoading, error: seasonError } = useSeasonData(year);
  const { result, loading, error } = useConferenceGames(year, conference, lookup, id);

  const isPageLoading = loading || seasonLoading;
  const isPageError = error || seasonError || !conferenceData;

  useEffect(() => {
    if (!conferenceData) return;

    const title = `${year} ${cased} Controlled Games`;
    addMetaTags(title);
    setupPrintListener();
  }, [year, cased, conferenceData]);

  if (isPageError) {
    return (
      <div className={styles.errorContainer}>
        <p>Sorry. Got a bit of a problem. Let Matt know.</p>
      </div>
    );
  }

  if (isPageLoading) {
    return (
      <div className={styles.loadingContainer}>
        <p className={styles.loadingText}>{cased || 'Conference'} Games Loading...</p>
      </div>
    );
  }

  return (
    <>
      {result && seasonResult && (
        <>
          <nav role="navigation" className={`${styles.navbar} DONTPrint`}>
            <div className={styles.container}>
              <div className={styles.flexContainer}>
                <div>
                  <Link className={styles.flexRow} to="/">
                    Home
                  </Link>
                </div>
                <div>
                  <Link className={styles.flexRow} to={`/season/football/${year}`}>
                    Season Home
                  </Link>
                </div>
                <div>
                  {seasonResult.seasonData?.flexScheduleLink && (
                    <Link
                      className={styles.flexRow}
                      to={`/tv-windows/${year}`}
                      target="_blank"
                      rel="noopener noreferrer">
                      Available TV Windows
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </nav>

          <main ref={mainRef} className={styles.mainContainer}>
            <div id="head">
              <p>
                {cased} Broadcast Schedule
                <br />
                <strong>All start times displayed are based on your device&apos;s location.</strong>
              </p>
              <p>
                NOTE: This list includes telecasts that fall under the TV contracts for the conference. Any road
                non-conference games fall under the home team&apos;s telecast rights.
              </p>

              {conference !== 'independents' && result.conferenceGames?.contractYearData?.[0]?.contractText && (
                <div dangerouslySetInnerHTML={{ __html: result.conferenceGames.contractYearData[0].contractText }} />
              )}

              {conference === 'independents' ? (
                <IndependentsGameList
                  games={result.conferenceGames!.conferenceGames}
                  contractYearData={result.conferenceGames!.contractYearData}
                  schools={result.conferenceGames!.conferences}
                  year={year}
                />
              ) : (
                <ConferenceGameList year={year} games={result.conferenceGames!.conferenceGames} />
              )}

              <Suspense fallback={null}>
                <LazyBackToTop />
                <LazyAdsByGoogle />
                <LazyCopyrightLink />
              </Suspense>
            </div>
          </main>
        </>
      )}
    </>
  );
};

export default ConferenceGamesView;
