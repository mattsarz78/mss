import AdsByGoogle from '#shared/AdsByGoogle';
import CopyrightLink from '#shared/CopyrightLink';
import { addMetaTags } from '#utils/metaTags';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const ArchiveView: React.FC = () => {
  const title = 'Archived Seasons';

  useEffect(() => {
    addMetaTags(title);
  }, []);

  const footballSeasons = Array.from({ length: 15 }, (_, i) => 2019 - i); // 2019-2005
  const basketballSeasons = Array.from({ length: 15 }, (_, i) => 2020 - i); // 2019-20 to 2005-06

  return (
    <>
      <main style={{ padding: '20px' }}>
        <h1>{title}</h1>

        <h2>Football</h2>
        <ul>
          {footballSeasons.map((year) => (
            <li key={`fb-${year}`}>
              <Link to={`/season/football/${year}`}>{year}</Link>
            </li>
          ))}
        </ul>

        <h2>Men's Basketball</h2>
        <ul>
          {basketballSeasons.map((year) => (
            <li key={`mbk-${year}`}>
              <Link to={`/season/basketball/${year}-${String(year + 1).slice(-2)}`}>
                {year}-{String(year + 1).slice(-2)}
              </Link>
            </li>
          ))}
        </ul>

        <h2>Other Seasons</h2>
        <ul>
          <li>
            <Link to="/season/football/2021">2021 Football</Link>
          </li>
          <li>
            <Link to="/season/basketball/2021-22">2021-22 Men's Basketball</Link>
          </li>
        </ul>

        <AdsByGoogle />
      </main>
      <CopyrightLink />
    </>
  );
};

export default ArchiveView;
