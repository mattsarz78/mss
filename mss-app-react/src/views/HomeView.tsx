import AdsByGoogle from '#shared/AdsByGoogle';
import CopyrightLink from '#shared/CopyrightLink';
import { addMetaTags } from '#utils/metaTags';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HomeView.css';

const HomeView: React.FC = () => {
  const title = "Matt's College Sports on TV";

  useEffect(() => {
    addMetaTags(title);
  }, []);

  return (
    <>
      <main className="home-view">
        <div>
          <img id="imgtitle" src="/images/logo.webp" loading="lazy" alt="Matt's College Sports" />
          <br />
        </div>
        <div id="content">
          <div id="Links">
            <Link to="/season/football/2026"> 2026 Football </Link>
            <br />
            <br />
            <Link to="/season/football/2025"> 2025 Football </Link>
            <br />
            <Link to="/season/basketball/2025-26"> 2025-26 Men's Basketball </Link>
            <br />
            <br />
            <Link to="/season/football/2024"> 2024 Football </Link>
            <br />
            <Link to="/season/basketball/2024-25"> 2024-25 Men's Basketball </Link>
            <br />
            <br />
            <Link to="/season/football/2023"> 2023 Football </Link>
            <br />
            <Link to="/season/basketball/2023-24"> 2023-24 Men's Basketball </Link>
            <br />
            <br />
            <Link to="/season/football/2022"> 2022 Football </Link>
            <br />
            <Link to="/season/basketball/2022-23"> 2022-23 Men's Basketball </Link>
            <br />
            <br />
            <Link to="/archive"> Archived Seasons </Link>
            <p>
              Check out my{' '}
              <a href="http://mattsarzsports.blogspot.com/" target="_blank" rel="noopener">
                blog
              </a>
              . Discussing college sports and how we're watching the games.
            </p>
          </div>
        </div>
        <div id="Twitter">
          <a
            href="https://twitter.com/mattsarz?ref_src=twsrc%5Etfw"
            className="twitter-follow-button"
            data-show-count="true"
          >
            Follow @mattsarz
          </a>
          <script async src="https://platform.twitter.com/widgets.js" charSet="utf-8"></script>
        </div>
        <iframe
          id="Facebook"
          title="Link to MattSarzSports Facebook page"
          loading="lazy"
          src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fmattsarzsports%2F&tabs&height=80&small_header=true&adapt_container_width=true&hide_cover=true&show_facepile=false&appId"
          height={80}
          style={{ border: 'none', overflow: 'hidden' }}
          scrolling="no"
          frameBorder="0"
          allowFullScreen={true}
          allowTransparency={true}
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
        <AdsByGoogle />
      </main>
      <CopyrightLink />
    </>
  );
};

export default HomeView;
