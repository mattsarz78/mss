import { DAILY_TV_GAMES, type TvGameData } from '#/graphQl.mjs';
import { useQuery } from '@vue/apollo-composable';
import { DateTime } from 'luxon';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

export const useDailyTvTextGames = () => {
  const route = useRoute();
  const { sport } = route.params as { sport: string };

  const startDate = DateTime.now().setZone('America/New_York').toISODate();

  const {
    result: dailyTvGameResult,
    loading: dailyTvGameLoading,
    error: dailyTvGameError
  } = useQuery<{ dailyTvGames: TvGameData }>(DAILY_TV_GAMES, { variables: { input: { sport, startDate } } });

  const season = ref<string>('');
  const paramYear = ref<string>('');

  watch(
    dailyTvGameResult,
    (dailyTvGameValue) => {
      if (dailyTvGameValue?.dailyTvGames.tvGames.length) {
        paramYear.value = dailyTvGameValue.dailyTvGames.tvGames[0].season;
        season.value =
          sport === 'football' ? paramYear.value : `${paramYear.value.slice(0, 4)}-${paramYear.value.slice(5)}`;
      }
    },
    { immediate: true }
  );

  return { dailyTvGameResult, dailyTvGameLoading, dailyTvGameError, season, paramYear, sport, startDate };
};
