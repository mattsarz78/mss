import { useResetAdsenseHeight } from '#hooks/index.mjs';
import { LazyAdsByGoogle, LazyCopyrightLink } from '#shared/lazyIndex.tsx';
import { addMetaTags } from '#utils/index.mjs';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './ArchiveView.module.css';

const ArchiveView: React.FC = () => {
  const title = 'Archive Listings';
  const mainRef = useResetAdsenseHeight();

  useEffect(() => {
    addMetaTags(title);
  }, []);

  const footballSeasons = [
    '2019',
    '2018',
    '2017',
    '2016',
    '2015',
    '2014',
    '2013',
    '2012',
    '2011',
    '2010',
    '2009',
    '2008',
    '2007',
    '2006',
    '2005',
  ];

  const fbSeasons = ['2021'];
  const mbkSeasons = ['2021-22'];

  const basketballSeasons = [
    '2019-20',
    '2018-19',
    '2017-18',
    '2016-17',
    '2015-16',
    '2014-15',
    '2013-14',
    '2012-13',
    '2011-12',
    '2010-11',
    '2009-10',
    '2008-09',
    '2007-08',
    '2006-07',
    '2005-06',
  ];
  return (
    <>
      <main ref={mainRef} className={styles.main}>
        <div>
          <div className={styles.links}>
            <Link to="/">Home</Link>
            <br />
            <br />
            {fbSeasons.map((season, index) => (
              <div key={index}>
                <Link to={`/season/football/${season}`}> {season} Football </Link>
                <br />
                <Link to={`/season/basketball/${mbkSeasons[index]}`}>{mbkSeasons[index]} Men&apos;s Basketball</Link>
                <br />
              </div>
            ))}
            <br />
            <Link to="/season/football/2021s"> 2021 Football - Spring FCS only </Link>
            <br />
            <Link to="/season/football/2020r"> 2020 Football - Revised </Link>
            <br />
            <Link to="/season/football/2020"> 2020 Football - Pre-Conference Only Announcements </Link>
            <br />
            <Link to="/season/basketball/2020-21"> 2020-21 Men&apos;s Basketball </Link>
            <br />
            <br />
            {footballSeasons.map((season, index) => (
              <div key={index}>
                <Link to={`/season/football/${season}`}> {season} Football </Link>
                <br />
                <Link to={`/season/basketball/${basketballSeasons[index]}`}>
                  {basketballSeasons[index]} Men&apos;s Basketball
                </Link>
                <br />
                <br />
              </div>
            ))}
          </div>
        </div>

        <LazyAdsByGoogle />
      </main>
      <LazyCopyrightLink />
    </>
  );
};

export default ArchiveView;
