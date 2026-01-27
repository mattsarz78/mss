import { type ConferenceGameData, CONFERENCE_GAMES } from '#/graphQl.mjs';
import { useQuery } from '@vue/apollo-composable';

export const useConferenceGames = (year: string, conference: string, lookup: string | undefined, id: string) => {
  const variables: { input: { season: string; conference: string; id: string } } = {
    input: { season: year, conference: conference !== 'independents' ? lookup! : conference, id }
  };

  const { result, loading, error } = useQuery<{ conferenceGames: ConferenceGameData }>(CONFERENCE_GAMES, { variables });

  return { result, loading, error };
};
