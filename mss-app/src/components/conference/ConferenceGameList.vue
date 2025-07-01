<script setup lang="ts">
import type { ConferenceGame } from '@/graphQl';
import ConferenceTable from '@conference/ConferenceTable.vue';
import { computed } from 'vue';

const props = defineProps<{ games: ConferenceGame[]; year: string }>();
const { games, year } = props;

const gameCategories = computed(() => ({
  networkGames: {
    title: 'Network telecasts',
    filter: (x: ConferenceGame) => x.mediaIndicator === 'T' && x.tvtype === 'N'
  },
  payTvGames: {
    title: 'Primary National Cable telecasts',
    filter: (x: ConferenceGame) => x.mediaIndicator === 'T' && (x.tvtype === 'NC' || x.tvtype === 'C')
  },
  secondaryPayTvGames: {
    title: 'Broadly Syndicated and/or Secondary National Cable Telecasts',
    filter: (x: ConferenceGame) => x.mediaIndicator === 'T' && x.tvtype === 'RS'
  },
  navyAacGames: {
    title: 'Navy Telecasts',
    filter: (x: ConferenceGame) => x.mediaIndicator === 'T' && x.tvtype === 'NV'
  },
  armyAacGames: {
    title: 'Army West Point Telecasts',
    filter: (x: ConferenceGame) => x.mediaIndicator === 'T' && x.tvtype === 'AR'
  },
  memberRetained: {
    title: 'Member Retained Telecasts or Internet Exclusives',
    filter: (x: ConferenceGame) =>
      (x.mediaIndicator === 'W' || x.mediaIndicator === 'T') && x.tvtype === 'R' && x.conference === 'Big 12'
  },
  regional: {
    title: 'Regional Telecasts',
    filter: (x: ConferenceGame) =>
      (x.mediaIndicator === 'T' && x.tvtype === 'R' && x.conference !== 'Big 12') ||
      (x.conference === 'Big 12' && (year === '2021r' || parseInt(year) < 2012))
  },
  tbdGames: {
    title: 'Network or Platform To Be Determined',
    filter: (x: ConferenceGame) => x.mediaIndicator === 'T' && !x.tvtype
  },
  internetGames: {
    title: 'Internet Exclusives',
    filter: (x: ConferenceGame) => x.mediaIndicator === 'W' && x.tvtype !== 'R'
  }
}));

const filteredGames = computed(() => {
  const result: Record<string, ConferenceGame[]> = {};
  for (const [key, category] of Object.entries(gameCategories.value)) {
    result[key] = games.filter(category.filter);
  }
  return result;
});
</script>

<template>
  <div v-for="(category, key) in gameCategories" :key="key">
    <template v-if="filteredGames[key].length">
      <div>{{ category.title }}</div>
      <ConferenceTable :games="filteredGames[key]" :year="year" />
      <br />
    </template>
  </div>
</template>
