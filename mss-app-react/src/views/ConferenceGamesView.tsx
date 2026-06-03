import { useResetAdsenseHeight } from '#/hooks/useResetAdsenseHeight.mjs';
import ConferenceGameList from '#conference/ConferenceGameList.tsx';
import IndependentsGameList from '#conference/IndependentsGameList.tsx';
import conferenceCasing from '#data/conferenceCasing.json' with { type: 'json' };
import type { ConferenceCasing } from '#data/exportTypes.mjs';
import { useConferenceGames } from '#hooks/useConferenceGames.mjs';
import { useSeasonData } from '#hooks/useSeasonData.mjs';
import Copyright from '#shared/CopyrightLink.tsx';
import { sanitizeHtml } from '#utils/domText.mjs';
import { addMetaTags } from '#utils/metaTags.mjs';
import { setupPrintListener } from '#utils/printListener.mjs';
import React, { Suspense, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import styles from './ConferenceGamesView.module.css';

const BackToTop = React.lazy(() => import('#shared/BackToTop.tsx'));
const AdsByGoogle = React.lazy(() => import('#shared/AdsByGoogle.tsx'));

const ConferenceView: React.FC = () => {
  const { conference = '', year = '' } = useParams<{ conference: string; year: string }>();
  const mainRef = useResetAdsenseHeight();

  // Find conference meta data from config JSON
  const conferenceData = (conferenceCasing as ConferenceCasing[]).find((x) => x.slug === conference);

  if (!conferenceData) {
    throw new Error(`Invalid conference slug: ${conference}`);
  }

  const { cased, lookup, id } = conferenceData;
  const title = `${year} ${cased} Controlled Games`;

  useEffect(() => {
    addMetaTags(title);
  }, [title]);

  // Handle side-effect print utility registration precisely on initialization
  useEffect(() => {
    setupPrintListener();
  }, []);

  // API Call Data Hooks
  const { result: seasonResult, loading: seasonLoading, error: seasonError } = useSeasonData(year);

  const { result, loading, error } = useConferenceGames(year, conference, lookup, id);

  if (error || seasonError) {
    return (
      <div className={styles.errorContainer}>
        <p>Sorry. Got a bit of a problem. Let Matt know.</p>
      </div>
    );
  }

  if (loading || seasonLoading) {
    return (
      <div className={styles.loadingContainer}>
        <p className={styles.loadingText}>{cased} Games Loading...</p>
      </div>
    );
  }

  if (!result || !seasonResult) return null;

  const contractTextHtml = result.conferenceGames?.contractYearData[0]?.contractText ?? '';

  return (
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
                <Link className={styles.flexRow} to={`/tv-windows/${year}`} target="_blank" rel="noopener">
                  Available TV Windows
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Note: Handle custom v-reset-adsense-height DOM mechanics with a hook Ref here if necessary */}
      <main ref={mainRef}>
        <div id="head">
          <p>
            {cased} Broadcast Schedule
            <br />
            <strong>All start times displayed are based on your device's location.</strong>
          </p>
          <p>
            NOTE: This list includes telecasts that fall under the TV contracts for the conference. Any road
            non-conference games fall under the home team's telecast rights.
          </p>

          {/* Raw HTML injection replacing v-dompurify-html */}
          {conference !== 'independents' && (
            <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(contractTextHtml) }} />
          )}

          {/* Conditional Game Layout Lists */}
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
            <BackToTop />
            <AdsByGoogle />
          </Suspense>
        </div>
      </main>

      <Copyright />
    </>
  );
};

export default ConferenceView;
