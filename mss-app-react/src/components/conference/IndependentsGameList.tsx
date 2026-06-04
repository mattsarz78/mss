import type { ConferenceGame, ContractData } from '#/graphQl.mjs';
import ConferenceTable from '#conference/ConferenceTable.tsx';
import { sanitizeHtml } from '#utils/domText.mjs';
import React, { useMemo } from 'react';

interface IndependentsGameListProps {
  games: ConferenceGame[];
  schools: string[];
  year: string;
  contractYearData: ContractData[];
}

const IndependentsGameList: React.FC<IndependentsGameListProps> = ({ games, schools, year, contractYearData }) => {
  
  // Replicating Vue's filteredGames computed property
  const filteredGames = useMemo(() => {
    const filterGamesBySchool = (school: string) => {
      return games.filter((game) => game.conference === school);
    };

    if (!schools || !games) return [];

    return schools
      .map((school) => {
        const schoolGames = filterGamesBySchool(school);
        const contractData = contractYearData.find((data) => data.conference === school)?.contractText;
        return schoolGames.length > 0 ? { school, games: schoolGames, contractData } : null;
      })
      .filter(
        (game): game is { school: string; games: ConferenceGame[]; contractData: string | undefined } => game !== null
      );
  }, [games, schools, contractYearData]);

  return (
    <>
      {filteredGames.map(({ games: filterGames, contractData }, index) => (
        <div key={index}>
          {contractData && <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(contractData) }} />}
          {filterGames[0]?.homeTeam?.[0]} Telecasts
          <ConferenceTable games={filterGames} year={year} />
        </div>
      ))}
    </>
  );
};

export default IndependentsGameList;
