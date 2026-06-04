import { useResetAdsenseHeight, useSeasonContents } from '#hooks/index.mjs'; // Adjust hook import path as needed
import ConferenceList from '#season/ConferenceList.tsx';
import SeasonDates from '#season/SeasonDates.tsx';
import AdsByGoogle from '#shared/AdsByGoogle.tsx';
import Copyright from '#shared/CopyrightLink.tsx';
import { addMetaTags } from '#utils/metaTags.mjs';
import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import styles from './SeasonView.module.css';

const SeasonView: React.FC = () => {
  const { sport = '', year: paramYear = '' } = useParams<{ sport: string; year: string }>();
  const mainRef = useResetAdsenseHeight();

  const year = sport === 'football' ? paramYear : `${paramYear.substring(0, 4)}${paramYear.substring(5)}`;

  const capitalizedSport = sport.charAt(0).toUpperCase() + sport.slice(1);
  const title = `${paramYear} ${capitalizedSport} Season`;

  // Update meta tags when title dependencies change
  useEffect(() => {
    addMetaTags(title);
  }, [title]);

  const { result, loading, error } = useSeasonContents(year);

  return (
    <>
      <nav role="navigation" className={`${styles.navbar} DONTPrint`}>
        <div className={styles.container}>
          <div className={styles.flexContainer}>
            <div>
              <Link className={styles.homelink} to="/">
                Home
              </Link>
            </div>
            <div>
              <br />
            </div>
          </div>
        </div>
      </nav>

      <main ref={mainRef}>
        <p>{title}</p>

        {/* Error Handling State */}
        {error && <>Got a problem. Let Matt know.</>}

        {/* Loading State */}
        {loading && (
          <div className={styles.loadingContainer}>
            <p className={styles.loadingText}>Loading {paramYear} season</p>
          </div>
        )}

        {/* Successful Data State */}
        {result?.seasonContents && (
          <div id="content">
            <div className={`${styles.seasonLinks} DONTPrint`}>
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

        {/* Always visible bottom markup */}
        <div className={styles.inlineBlock}>
          <p>
            <span id="Label9"> Got a question, complaint, comment or know a game not listed here? </span>
            <a id="HyperLink32" href="mailto:footballsked@gmail.com">
              Send it here
            </a>
          </p>
        </div>

        <AdsByGoogle />
        <Copyright />
      </main>
    </>
  );
};

export default SeasonView;
