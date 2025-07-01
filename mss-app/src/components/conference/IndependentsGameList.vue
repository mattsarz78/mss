<script setup lang="ts">
import type { ConferenceGame } from '@/graphQl';
import ConferenceTable from '@conference/ConferenceTable.vue';
import { getConferenceContractData } from '@utils/conference';
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
      const contractData = getConferenceContractData(school, year);
      return schoolGames.length > 0 ? { school, games: schoolGames, contractData } : null;
    })
    .filter((game) => game !== null)
);
</script>

<template>
  <div v-for="({ games: filterGames, contractData }, index) in filteredGames" :key="index">
    <div v-dompurify-html="contractData" />
    {{ filterGames[0]?.homeTeam[0] }} Telecasts
    <ConferenceTable :games="filterGames" :year="year" />
  </div>
</template>
