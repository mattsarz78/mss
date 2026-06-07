import { useResetAdsenseHeight } from '#hooks/index.mjs';
import { LazyAdsByGoogle, LazyCopyrightLink } from '#shared/lazyIndex.tsx';
import { addMetaTags } from '#utils/index.mjs';
import React, { Suspense, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './HomeView.module.css';

const HomeView: React.FC = () => {
  const title = "Matt's College Sports on TV";
  const mainRef = useResetAdsenseHeight();

  useEffect(() => {
    addMetaTags(title);
  }, []);

  // Handle Dynamic Twitter Script Loading
  useEffect(() => {
    // 1. If the script already exists, just tell Twitter to re-parse the button
    if (window.twttr?.widgets) {
      window.twttr.widgets.load();
      return;
    }

    // 2. Otherwise, create the script tag and inject it into the document
    const script = document.createElement('script');
    script.setAttribute('src', 'https://platform.twitter.com/widgets.js');
    script.setAttribute('async', 'true');
    script.setAttribute('charset', 'utf-8');
    document.body.appendChild(script);

    // Clean up function to remove the script if the component unmounts mid-load
    return () => {
      script.remove();
    };
  }, []);

  return (
    <>
      <main ref={mainRef} className={styles.main}>
        <div>
          <img className={styles.imgtitle} src="/images/logo.webp" loading="lazy" alt="Matt's College Sports" />
          <br />
        </div>
        <div className={styles.content}>
          <div className={styles.links}>
            <Link to="/season/football/2026"> 2026 Football </Link>
            <br />
            <br />
            <Link to="/season/football/2025"> 2025 Football </Link>
            <br />
            <Link to="/season/basketball/2025-26"> 2025-26 Men&apos;s Basketball </Link>
            <br />
            <br />
            <Link to="/season/football/2024"> 2024 Football </Link>
            <br />
            <Link to="/season/basketball/2024-25"> 2024-25 Men&apos;s Basketball </Link>
            <br />
            <br />
            <Link to="/season/football/2023"> 2023 Football </Link>
            <br />
            <Link to="/season/basketball/2023-24"> 2023-24 Men&apos;s Basketball </Link>
            <br />
            <br />
            <Link to="/season/football/2022"> 2022 Football </Link>
            <br />
            <Link to="/season/basketball/2022-23"> 2022-23 Men&apos;s Basketball </Link>
            <br />
            <br />
            <Link to="/archive"> Archived Seasons </Link>
            <p>
              Check out my{' '}
              <a href="http://mattsarzsports.blogspot.com/" target="_blank" rel="noopener noreferrer">
                blog
              </a>
              . Discussing college sports and how we&apos;re watching the games.
            </p>
          </div>
        </div>
        <div className={styles.twitter}>
          <a
            href="https://twitter.com/mattsarz?ref_src=twsrc%5Etfw"
            className="twitter-follow-button"
            data-show-count="true"
          >
            Follow @mattsarz
          </a>
        </div>
        <iframe
          className={styles.facebook}
          title="Link to MattSarzSports Facebook page"
          loading="lazy"
          src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fmattsarzsports%2F&tabs&height=80&small_header=true&adapt_container_width=true&hide_cover=true&show_facepile=false&appId"
          height={80}
          style={{ border: 'none', overflow: 'hidden' }}
          allowFullScreen={true}
        />
        <br />
        <a href="https://bsky.app/profile/mattsarz.bsky.social">
          <img
            alt="Follow mattsarz on Bluesky"
            src="https://img.shields.io/badge/Bluesky-0285FF?logo=bluesky&logoColor=fff&label=Follow%20me%20on&color=0285FF"
          />
        </a>

        <p>
          Got a question, complaint, comment or know a game not listed here?{' '}
          <a href="mailto:footballsked@gmail.com"> Send it here </a>
        </p>
        <Suspense fallback={null}>
          <LazyAdsByGoogle />
          <LazyCopyrightLink />
        </Suspense>
      </main>
    </>
  );
};

export default HomeView;
