import { type ConferenceGameData, CONFERENCE_GAMES } from '#/graphQl.mjs';
import { useQuery } from '@vue/apollo-composable';

export const useConferenceGames = (year: string, conference: string, lookup: string | undefined, id: string) => {
  const { result, loading, error } = useQuery<{ conferenceGames: ConferenceGameData }>(CONFERENCE_GAMES, {
    input: { season: year, conference: conference !== 'independents' ? lookup : conference, id }
  });

  return { result, loading, error };
};
