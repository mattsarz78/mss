<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import BackToTopButton from '../components/shared/BackToTopButton.vue';
import { flexScheduleLink, getConferenceCasingBySlug, getIndependentSchools, getConferenceContractData } from '@/utils';
import { CONFERENCE_GAMES, type ConferenceGame } from '@/graphQl';
import { useQuery } from '@vue/apollo-composable';
import ConferenceGameList from '@/components/conference/ConferenceGameList.vue';
import IndependentsGameList from '@/components/IndependentsGameList.vue';

const route = useRoute();
const conference = route.params.conference as string;
const year = route.params.year as string;

const flexLink = flexScheduleLink(year);

const { cased, lookup } = getConferenceCasingBySlug(conference)!;

const contractTvData =
  conference !== 'independents' ? getConferenceContractData(getConferenceCasingBySlug(conference)?.id!, year)! : '';

const { result, loading, error } = useQuery<{ conferenceGames: ConferenceGame[] }>(CONFERENCE_GAMES, {
  input: {
    season: year,
    conference: conference === 'independents' ? getIndependentSchools(year) : lookup
  }
});

const BackToTopScript = defineAsyncComponent(() => import('../components/shared/BackToTopScript.vue'));

const GoogleSearch = defineAsyncComponent(() => import('../components/shared/GoogleSearchBar.vue'));
</script>

<template>
  <div v-if="result">
    <nav class="navbar DONTPrint">
      <div class="container">
        <div>
          <span>
            <RouterLink class="homelink" to="/">Home</RouterLink>
            <RouterLink class="seasonhome" :to="`/season/football/${year}`">Season Home</RouterLink>
          </span>
          <RouterLink v-if="flexLink" :to="`/tv-windows/${year}`" target="_blank">Available TV Windows</RouterLink>
        </div>
      </div>
    </nav>

    <div id="Main">
      <div id="head">
        <p>{{ cased }} Broadcast Schedule</p>
        <p>
          NOTE: This list includes telecasts that fall under the TV contracts for the conference. Any road
          non-conference games fall under the home team's telecast rights.
        </p>
        <div v-if="conference !== 'independents'" v-html="contractTvData"></div>
        <IndependentsGameList
          v-if="conference === 'independents'"
          :games="result.conferenceGames"
          :schools="getIndependentSchools(year).split('|')"
          :year="year"
        />
        <ConferenceGameList :year="year" v-else :games="result.conferenceGames" />
        <p>
          <BackToTopScript />
          <BackToTopButton />
        </p>
        <GoogleSearch />
      </div>
    </div>
  </div>
  <div v-if="loading">{{ cased }} Games Loading...</div>
  <div v-if="error">There's an error.</div>
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
