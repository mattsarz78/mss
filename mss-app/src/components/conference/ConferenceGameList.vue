<script setup lang="ts">
import type { ConferenceGame } from '@/graphQl';
import ConferenceTable from './ConferenceTable.vue';

const props = defineProps(['games', 'year']);
const games: ConferenceGame[] = props['games'];
const year: string = props.year;

const networkGames = games.filter((x) => x.mediaIndicator === 'T' && x.tvtype === 'N');
const payTvGames = games.filter((x) => x.mediaIndicator === 'T' && (x.tvtype === 'NC' || x.tvtype === 'C'));
const secondaryPayTvGames = games.filter((x) => x.mediaIndicator === 'T' && x.tvtype === 'RS');
const navyAacGames = games.filter((x) => x.mediaIndicator === 'T' && x.tvtype === 'NV');
const armyAacGames = games.filter((x) => x.mediaIndicator === 'T' && x.tvtype === 'AR');
const memberRetained = games.filter(
  (x) => (x.mediaIndicator === 'W' || x.mediaIndicator === 'T') && x.tvtype === 'R' && x.conference === 'Big 12'
);
const regional = games.filter(
  (x) =>
    (x.mediaIndicator === 'T' && x.tvtype === 'R' && x.conference !== 'Big 12') ||
    (x.conference === 'Big 12' && (year === '2021r' || parseInt(year) < 2012))
);
const tbdGames = games.filter((x) => x.mediaIndicator === 'T' && !x.tvtype);
const internetGames = games.filter((x) => x.mediaIndicator === 'W' && x.tvtype !== 'R');
</script>

<template>
  <template v-if="networkGames.length">
    <div>Network telecasts</div>
    <ConferenceTable :games="networkGames" :year="year" />
    <br />
  </template>

  <template v-if="payTvGames.length">
    <div>Primary National Cable telecasts</div>
    <ConferenceTable :games="payTvGames" :year="year" />
    <br />
  </template>

  <template v-if="secondaryPayTvGames.length">
    <div>Broadly Syndicated and/or Secondary National Cable Telecasts</div>
    <ConferenceTable :games="secondaryPayTvGames" :year="year" />
    <br />
  </template>

  <template v-if="navyAacGames.length">
    <div>Navy Telecasts</div>
    <ConferenceTable :games="navyAacGames" :year="year" />
    <br />
  </template>

  <template v-if="armyAacGames.length">
    <div>Army West Point Telecasts</div>
    <ConferenceTable :games="armyAacGames" :year="year" />
    <br />
  </template>

  <template v-if="memberRetained.length && (year === '2021r' || parseInt(year) >= 2012)">
    <div>Member Retained Telecasts or Internet Exclusives</div>
    <ConferenceTable :games="memberRetained" :year="year" />
    <br />
  </template>

  <template v-if="regional.length">
    <div>Regional Telecasts</div>
    <ConferenceTable :games="regional" :year="year" />
    <br />
  </template>

  <template v-if="tbdGames.length">
    <div>Network or Platform To Be Determined</div>
    <ConferenceTable :games="tbdGames" :year="year" />
    <br />
  </template>

  <template v-if="internetGames.length">
    <div>Internet Exclusives</div>
    <ConferenceTable :games="internetGames" :year="year" />
    <br />
  </template>
</template>

<style scoped>
@media all and (min-width: 641px) {
  #Main {
    padding-top: 56px;
  }
}

@media only screen and (max-width: 640px) {
  #Main {
    padding-top: 61px;
  }
}
</style>
