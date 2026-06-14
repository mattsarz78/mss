import React, { useMemo } from 'react';
import type { ConferenceGame } from '#/graphQl.mjs';
import ConferenceTable from '#conference/ConferenceTable.tsx';

interface ConferenceGameListProps {
  games: ConferenceGame[];
  year: string;
}

// 1. Move static definitions outside the component to preserve memory references
const GAME_CATEGORIES_CONFIG = {
  networkGames: {
    title: 'Network telecasts',
    filter: (x: ConferenceGame) => x.mediaIndicator === 'T' && x.tvtype === 'N',
  },
  payTvGames: {
    title: 'Primary National Cable telecasts',
    filter: (x: ConferenceGame) => x.mediaIndicator === 'T' && (x.tvtype === 'NC' || x.tvtype === 'C'),
  },
  secondaryPayTvGames: {
    title: 'Broadly Syndicated and/or Secondary National Cable Telecasts',
    filter: (x: ConferenceGame) => x.mediaIndicator === 'T' && x.tvtype === 'RS',
  },
  navyAacGames: {
    title: 'Navy Telecasts',
    filter: (x: ConferenceGame) => x.mediaIndicator === 'T' && x.tvtype === 'NV',
  },
  armyAacGames: {
    title: 'Army West Point Telecasts',
    filter: (x: ConferenceGame) => x.mediaIndicator === 'T' && x.tvtype === 'AR',
  },
  memberRetained: {
    title: 'Member Retained Telecasts or Internet Exclusives',
    filter: (x: ConferenceGame) =>
      (x.mediaIndicator === 'W' || x.mediaIndicator === 'T') && x.tvtype === 'R' && x.conference === 'Big 12',
  },
  regional: (year: string) => ({
    title: 'Regional Telecasts',
    filter: (x: ConferenceGame) =>
      (x.mediaIndicator === 'T' && x.tvtype === 'R' && x.conference !== 'Big 12') ||
      (x.conference === 'Big 12' && (year === '2021r' || parseInt(year) < 2012)),
  }),
  tbdGames: {
    title: 'Network or Platform To Be Determined',
    filter: (x: ConferenceGame) => x.mediaIndicator === 'T' && !x.tvtype,
  },
  internetGames: {
    title: 'Internet Exclusives',
    filter: (x: ConferenceGame) => x.mediaIndicator === 'W' && x.tvtype !== 'R',
  },
};

const ConferenceGameList: React.FC<ConferenceGameListProps> = ({ games, year }) => {
  // 2. Compute the dynamic categorization lists using useMemo
  const categorizedGames = useMemo(() => {
    // Reconstruct the dynamic category dictionary structure matching Vue
    const categories = {
      ...GAME_CATEGORIES_CONFIG,
      regional: GAME_CATEGORIES_CONFIG.regional(year), // Pass context variable down
    };

    const result: Record<string, { title: string; list: ConferenceGame[] }> = {};

    for (const [key, category] of Object.entries(categories)) {
      const matchedGames = games.filter(category.filter);

      // Only append to lists that actively contain matched data tree items
      result[key] = {
        title: category.title,
        list: matchedGames,
      };
    }

    return result;
  }, [games, year]);

  return (
    <>
      {Object.entries(categorizedGames).map(([key, category]) => {
        if (category.list.length === 0) return null;

        return (
          <div key={key}>
            <div>{category.title}</div>
            <ConferenceTable games={category.list} year={year} />
            <br />
          </div>
        );
      })}
    </>
  );
};

export default ConferenceGameList;
