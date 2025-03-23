import { useQuery } from '@vue/apollo-composable';
import { DAILY_TV_GAMES, type TvGame } from '@/graphQl';
import { DateTime } from 'luxon';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

export function useDailyTvTextGames() {
  const route = useRoute();
  const { sport } = route.params as { sport: string; };

  const startDate = DateTime.now().setZone('America/New_York').toISODate();

  const {
    result: dailyTvGameResult,
    loading: dailyTvGameLoading,
    error: dailyTvGameError
  } = useQuery<{ dailyTvGames: TvGame[] }>(DAILY_TV_GAMES, {
    input: {
      sport,
      startDate
    }
  });

  const season = ref<string>('');
  const paramYear = ref<string>('');

  watch(
    dailyTvGameResult,
    (dailyTvGameValue) => {
      if (dailyTvGameValue?.dailyTvGames.length) {
        paramYear.value = dailyTvGameValue?.dailyTvGames[0].season ?? '';
        season.value =
          sport === 'football' ? (paramYear.value ?? null) : `${paramYear.value.substring(0, 4)}-${paramYear.value.substring(5)}`;
      }
    },
    { immediate: true }
  );

  return {
    dailyTvGameResult,
    dailyTvGameLoading,
    dailyTvGameError,
    season,
    paramYear,
    sport,
    startDate
  };
}