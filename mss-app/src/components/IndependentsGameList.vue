<script setup lang="ts">
import type { ConferenceGame } from '@/graphQl';
import { getConferenceContractData } from '@/utils';
import ConferenceTable from '@/components/conference/ConferenceTable.vue';
import { computed } from 'vue';

const props = defineProps<{ games: ConferenceGame[]; schools: string[]; year: string }>();
const { games, schools, year } = props;

const filteredGames = computed(() =>
  schools.map(school => ({
    school,
    games: games.filter(game => game.conference === school)
  }))
);
</script>

<template>
  <div
    v-for="({ school, games: filterGames }, index) in filteredGames"
    :key="index"
  >
    <!-- eslint-disable-next-line -->
    <div v-html="getConferenceContractData(school, year)!" />
    {{ games[0]?.homeTeam[0] }} Telecasts
    <ConferenceTable
      :games="filterGames"
      :year="year"
    />
  </div>
</template>
