<script setup lang="ts">
import type { ConferenceGame } from '@/graphQl';
import { getConferenceContractData } from '@/utils';
import ConferenceTable from '@/components/conference/ConferenceTable.vue';

const props = defineProps(['games', 'schools', 'year']);
const games: ConferenceGame[] = props['games'];
const schools: string[] = props['schools'];
const year = props['year'];
</script>

<template>
  <div v-for="(school, index) of schools" :key="index">
    <div v-html="getConferenceContractData(school, year)!"></div>
    {{ games.filter((x) => x.conference === school)[0].homeTeam[0] }} Telecasts
    <ConferenceTable :games="games.filter((x) => x.conference === school)" :year="year" />
  </div>
</template>
