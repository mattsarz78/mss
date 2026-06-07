import { useResetAdsenseHeight, useSeasonContents } from '#hooks/index.mjs';
import { ConferenceList, SeasonDates } from '#season/index.tsx';
import { LazyAdsByGoogle, LazyCopyrightLink } from '#shared/lazyIndex.tsx';
import { addMetaTags } from '#utils/index.mjs';
import React, { Suspense, useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import styles from './SeasonView.module.css';

interface RouteParams {
  sport: string;
  year: string;
  [key: string]: string | undefined;
}

const SeasonView: React.FC = () => {
  const mainRef = useResetAdsenseHeight();
  const { sport, year: paramYear } = useParams<RouteParams>() as { sport: string; year: string };
  const year = useMemo(() => {
    if (!sport || !paramYear) return '';
    return sport === 'football' ? paramYear : `${paramYear.substring(0, 4)}${paramYear.substring(5)}`;
  }, [sport, paramYear]);

  const title = useMemo(() => {
    if (!sport || !paramYear) return '';
    return `${paramYear} ${sport.charAt(0).toUpperCase()}${sport.slice(1)} Season`;
  }, [sport, paramYear]);

  const { result, loading, error } = useSeasonContents(year);

  useEffect(() => {
    if (title) {
      addMetaTags(title);
    }
  }, [title]);

  return (
    <>
      <nav role="navigation" className={`${styles.navbar} DONTPrint`}>
        <div className={styles.container}>
          <div className={styles.flexContainer}>
            <div>
              <Link to="/">
                Home
              </Link>
            </div>
            <div>
              <br />
            </div>
          </div>
        </div>
      </nav>

      <main ref={mainRef} className={styles.mainContent}>
        <p>{title}</p>

        {error && <div className={styles.errorContainer}>Got a problem. Let Matt know.</div>}

        {loading && (
          <div className={styles.loadingContainer}>
            <p className={styles.loadingText}>Loading {paramYear} season</p>
          </div>
        )}

        {result?.seasonContents && (
          <div id="content">
            <div id="SeasonLinks" className={`${styles.seasonLinks} DONTPrint`}>
              <SeasonDates
                contents={result.seasonContents.seasonContents}
                paramYear={paramYear}
                sport={sport}
                hasBasketballPostseason={result.seasonContents.hasPostseason}
              />
            </div>

            {sport === 'football' && (
              <ConferenceList conferenceList={result.seasonContents.conferenceListBase ?? ''} year={paramYear} />
            )}
          </div>
        )}

        <div className={styles.inlineBlock}>
          <p>
            <span id="Label9"> Got a question, complaint, comment or know a game not listed here? </span>
            <a id="HyperLink32" href="mailto:footballsked@gmail.com">
              Send it here
            </a>
          </p>
        </div>

        <Suspense fallback={null}>
          <LazyAdsByGoogle />
          <LazyCopyrightLink />
        </Suspense>
      </main>
    </>
  );
};

export default SeasonView;
