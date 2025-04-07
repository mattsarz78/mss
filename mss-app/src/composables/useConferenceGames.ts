import { type ConferenceGame, CONFERENCE_GAMES } from '@/graphQl';
import { getIndependentSchools } from '@/utils/base';
import { useQuery } from '@vue/apollo-composable';

export function useConferenceGames(year: string, conference: string, lookup: string | undefined) {
  const { result, loading, error } = useQuery<{ conferenceGames: ConferenceGame[] }>(CONFERENCE_GAMES, {
    input: { season: year, conference: conference === 'independents' ? getIndependentSchools(year) : lookup }
  });

  return { result, loading, error };
}
