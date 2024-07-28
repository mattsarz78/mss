<script setup lang="ts">
import { type TvGame, TV_GAMES } from '@/graphQl';
import { getBasketballSeason } from '@/utils';
import { useQuery } from '@vue/apollo-composable';
import { useRoute } from 'vue-router';

const route = useRoute();
const week = parseInt(route.params.week as string);
const sport = route.params.sport as string;
const paramYear = route.params.year as string;
const year = sport === 'football' ? paramYear : getBasketballSeason(paramYear);

const {
    result: tvGameResult,
    loading: tvGameLoading,
    error: tvGameError
} = useQuery<{ tvGames: TvGame[] }>(TV_GAMES, {
    input: {
        season: year,
        sport,
        week
    }
})

</script>