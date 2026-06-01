import { useResetAdsenseHeight, useSeasonData } from '#hooks/index.mjs';
import AdsByGoogle from '#shared/AdsByGoogle';
import CopyrightLink from '#shared/CopyrightLink';
import { addMetaTags } from '#utils/metaTags';
import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import styles from './TvWindowsView.module.css';

const TvWindowsView: React.FC = () => {
  const { year = '' } = useParams<'year'>();
  const { result, loading, error } = useSeasonData(year);
  const mainRef = useResetAdsenseHeight();

  useEffect(() => {
    // Vue uses "Football TV Windows for {year}"
    addMetaTags(`Football TV Windows for ${year}`);
  }, [year]);

  if (loading) {
    return (
      <div className={styles['loading-container']}>
        <p className={styles['loading-text']}>TV Windows Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles['error-container']}>
        <p>Sorry. Got a bit of a problem. Let Matt know.</p>
      </div>
    );
  }

  // Fallback check matching Vue's v-if="result" implicit expectation
  if (!result || !result.seasonData) return null;

  const FLEXLINKSETUP = '/pubhtml?widget=true&amp;headers=false';
  const iframeSrc = `${result.seasonData.flexScheduleLink}${FLEXLINKSETUP}`;

  return (
    <>
      {/* 1. Navigation Header Parity */}
      <nav role="navigation" className={`${styles.navbar} DONTPrint`}>
        <div className={styles.container}>
          <div className={styles['flex-container']}>
            <div>
              <Link to="/">Home</Link>
            </div>
            <div>
              <br />
            </div>
            <div>
              <Link to={`/season/football/${year}`}>Season Home</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 2. Main content container */}
      {/* Note: If v-reset-adsense-height is a custom directive, apply its logic via a ref hook here */}
      <main ref={mainRef}>
        <iframe title={`Football TV Windows for ${year} season`} className={styles.tvFrame} src={iframeSrc} />

        {/* 3. AdsByGoogle placed exactly under the iframe */}
        <AdsByGoogle />
      </main>

      {/* 4. Copyright placed outside main, matching the Vue tree hierarchy */}
      <CopyrightLink />
    </>
  );
};

export default TvWindowsView;
