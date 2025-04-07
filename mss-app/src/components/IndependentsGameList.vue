<script setup lang="ts">
import type { ConferenceGame } from '@/graphQl';
import { getConferenceContractData } from '@/utils/conference';
import ConferenceTable from '@/components/conference/ConferenceTable.vue';
import { computed } from 'vue';

const props = defineProps<{ games: ConferenceGame[]; schools: string[]; year: string }>();
const { games, schools, year } = props;

const filterGamesBySchool = (school: string) => {
  return games.filter((game) => game.conference === school);
};

const filteredGames = computed(() =>
  schools
    .map((school) => {
      const schoolGames = filterGamesBySchool(school);
      return schoolGames.length > 0 ? { school, games: schoolGames } : null;
    })
    .filter((game) => game !== null)
);
</script>

<template>
  <div v-for="({ school, games: filterGames }, index) in filteredGames" :key="index">
    <!-- eslint-disable-next-line -->
    <div v-html="getConferenceContractData(school, year)!" />
    {{ filterGames[0]?.homeTeam[0] }} Telecasts
    <ConferenceTable :games="filterGames" :year="year" />
  </div>
</template>
