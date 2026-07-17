import type { ConferenceGame } from '#/graphQl.mjs';
import ConferenceTable from '#conference/ConferenceTable.tsx';
import React, { useMemo } from 'react';

interface ConferenceGameListProps {
  games: ConferenceGame[];
  year: string;
}

type CategoryConfig = { title: string; filter: (game: ConferenceGame) => boolean };

type CategoryRegistry = Record<string, CategoryConfig | ((year: string) => CategoryConfig)>;

// 1. Move static definitions outside the component to preserve memory references
const GAME_CATEGORIES_CONFIG = {
  networkGames: {
    title: 'Network telecasts',
    filter: (x: ConferenceGame) => x.mediaIndicator === 'T' && x.tvtype === 'N'
  },
  payTvGames: {
    title: 'Primary National Cable telecasts',
    filter: (x: ConferenceGame) => x.mediaIndicator === 'T' && (x.tvtype === 'NC' || x.tvtype === 'C')
  },
  secondaryPayTvGames: {
    title: 'Broadly Syndicated and/or Secondary National Cable Telecasts',
    filter: (x: ConferenceGame) => x.mediaIndicator === 'T' && x.tvtype === 'RS'
  },
  navyAacGames: {
    title: 'Navy Telecasts',
    filter: (x: ConferenceGame) => x.mediaIndicator === 'T' && x.tvtype === 'NV'
  },
  armyAacGames: {
    title: 'Army West Point Telecasts',
    filter: (x: ConferenceGame) => x.mediaIndicator === 'T' && x.tvtype === 'AR'
  },
  memberRetained: {
    title: 'Member Retained Telecasts or Internet Exclusives',
    filter: (x: ConferenceGame) =>
      (x.mediaIndicator === 'W' || x.mediaIndicator === 'T') && x.tvtype === 'R' && x.conference === 'Big 12'
  },
  regional: (year: string) => ({
    title: 'Regional Telecasts',
    filter: (x: ConferenceGame) =>
      (x.mediaIndicator === 'T' && x.tvtype === 'R' && x.conference !== 'Big 12') ||
      (x.conference === 'Big 12' && (year === '2021r' || parseInt(year) < 2012))
  }),
  tbdGames: {
    title: 'Network or Platform To Be Determined',
    filter: (x: ConferenceGame) => x.mediaIndicator === 'T' && !x.tvtype
  },
  internetGames: {
    title: 'Internet Exclusives',
    filter: (x: ConferenceGame) => x.mediaIndicator === 'W' && x.tvtype !== 'R'
  }
} satisfies CategoryRegistry;

const ConferenceGameList: React.FC<ConferenceGameListProps> = ({ games, year }) => {
  // 2. Compute the dynamic categorization lists using useMemo
  const categorizedGames = useMemo(() => {
    // Reconstruct the dynamic category dictionary structure matching Vue
    const categories = { ...GAME_CATEGORIES_CONFIG, regional: GAME_CATEGORIES_CONFIG.regional(year) } satisfies Record<
      string,
      CategoryConfig
    >;

    const result = Object.fromEntries(
      Object.entries(categories).map(([key, category]) => [
        key,
        { title: category.title, list: games.filter(category.filter) }
      ])
    ) as Record<string, { title: string; list: ConferenceGame[] }>;

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
