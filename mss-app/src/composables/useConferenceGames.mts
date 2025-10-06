import { type ConferenceGameData, CONFERENCE_GAMES } from '#/graphQl.mjs';
import { useApolloQuery } from '#/composables/useApolloQuery.mjs';

export const useConferenceGames = (year: string, conference: string, lookup: string | undefined, id: string) => {
  const variables: { input: { season: string; conference: string; id: string } } = {
    input: { season: year, conference: conference !== 'independents' ? lookup! : conference, id }
  };

  const { data, loading, error } = useApolloQuery<{ conferenceGames: ConferenceGameData }>(CONFERENCE_GAMES, variables);

  return { result: data, loading, error };
};
