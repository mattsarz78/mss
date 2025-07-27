<script setup lang="ts">
import type { ConferenceGame, ContractData } from '#/graphQl.mjs';
import ConferenceTable from '#conference/ConferenceTable.vue';
import { computed } from 'vue';

const props = defineProps<{
  games: ConferenceGame[];
  schools: string[];
  year: string;
  contractYearData: ContractData[];
}>();
const { games, schools, year, contractYearData } = props;

const filterGamesBySchool = (school: string) => {
  return games.filter((game) => game.conference === school);
};

const filteredGames = computed(() =>
  schools
    .map((school) => {
      const schoolGames = filterGamesBySchool(school);
      const contractData = contractYearData.find((data) => data.conference === school)?.contractText;
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
