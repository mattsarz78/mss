import { useQuery } from '@apollo/client/react';
import { type ConferenceGameData, CONFERENCE_GAMES } from '#/graphQl.mjs';

export const useConferenceGames = (year: string, conference: string, lookup: string | undefined, id: string) => {
  const variables = {
    input: {
      season: year,
      conference: conference !== 'independents' ? lookup! : conference,
      id,
    },
  };

  const { data, loading, error } = useQuery<{ conferenceGames: ConferenceGameData }>(CONFERENCE_GAMES, { variables });

  return {
    result: { conferenceGames: data?.conferenceGames },
    loading,
    error,
  };
};
