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
    <ConferenceTable :games="networkGames" />
    <br />
  </template>

  <template v-if="payTvGames.length">
    <div>Primary National Cable telecasts</div>
    <ConferenceTable :games="payTvGames" />
    <br />
  </template>

  <template v-if="secondaryPayTvGames.length">
    <div>Broadly Syndicated and/or Secondary National Cable Telecasts</div>
    <ConferenceTable :games="secondaryPayTvGames" />
    <br />
  </template>

  <template v-if="navyAacGames.length">
    <div>Navy Telecasts</div>
    <ConferenceTable :games="navyAacGames" />
    <br />
  </template>

  <template v-if="armyAacGames.length">
    <div>Army West Point Telecasts</div>
    <ConferenceTable :games="armyAacGames" />
    <br />
  </template>

  <template v-if="memberRetained.length && (year === '2021r' || parseInt(year) >= 2012)">
    <div>Member Retained Telecasts or Internet Exclusives</div>
    <ConferenceTable :games="memberRetained" />
    <br />
  </template>

  <template v-if="regional.length">
    <div>Regional Telecasts</div>
    <ConferenceTable :games="regional" />
    <br />
  </template>

  <template v-if="tbdGames.length">
    <div>Network or Platform To Be Determined</div>
    <ConferenceTable :games="tbdGames" />
    <br />
  </template>

  <template v-if="internetGames.length">
    <div>Internet Exclusives</div>
    <ConferenceTable :games="internetGames" />
    <br />
  </template>
</template>

<style scoped>
.game,
.network,
.time {
  border: medium;
  border-style: solid;
  border-color: Gray;
  border-width: thin;
}

.network {
  text-align: center;
}

.time {
  width: 60px;
  text-align: right;
  padding: 2px;
}

.game {
  width: 243px;
}

.noTVTable {
  background-color: #fff;
  border-color: #fff;
  border-style: ridge;
  border-width: 2px;
  border-spacing: 1px;
  border-collapse: collapse;
  font-family: Arial;
}

.back-to-top {
  position: fixed;
  bottom: 2em;
  right: 0;
  text-decoration: none;
  padding: 1em;
  display: none;
}

.navbar {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}

@media all and (min-width: 641px) {
  .game {
    padding: 2px;
  }

  .network {
    width: 135px;
    padding: 2px;
  }

  :deep(.imageDimensions) {
    height: 40px;
    width: 55px;
  }

  .homelink,
  .seasonhome {
    display: block;
  }

  #Main {
    padding-top: 56px;
  }
}

@media only screen and (max-width: 640px) {
  .game {
    padding: 1px;
  }

  .network {
    width: 90px;
    padding: 0;
  }

  :deep(.imageDimensions) {
    height: 29px;
    width: 40px;
  }

  .homelink,
  .seasonhome {
    display: inline-block;
    padding-right: 10px;
  }

  #Main {
    padding-top: 61px;
  }
}
</style>
