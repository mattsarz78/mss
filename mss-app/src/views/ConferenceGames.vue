<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import BackToTopButton from '@/components/shared/BackToTopButton.vue';
import { flexScheduleLink, getIndependentSchools } from '@/utils';
import { getConferenceCasingBySlug, getConferenceContractData } from '@/conferenceUtils';
import { CONFERENCE_GAMES, type ConferenceGame } from '@/graphQl';
import { useQuery } from '@vue/apollo-composable';
import ConferenceGameList from '@/components/conference/ConferenceGameList.vue';
import IndependentsGameList from '@/components/IndependentsGameList.vue';

const route = useRoute();
const { conference, year } = route.params as { conference: string; year: string };

const flexLink = flexScheduleLink(year);

const conferenceCasing = getConferenceCasingBySlug(conference);
if (!conferenceCasing) {
  throw new Error(`Invalid conference slug: ${conference}`);
}
const { cased, lookup } = conferenceCasing;

const contractTvData =
  conference !== 'independents'
    ? (() => {
        const casing = getConferenceCasingBySlug(conference);
        if (!casing?.id) {
          throw new Error(`Invalid conference casing or ID for slug: ${conference}`);
        }
        return getConferenceContractData(casing.id, year);
      })()
    : '';

const { result, loading, error } = useQuery<{ conferenceGames: ConferenceGame[] }>(CONFERENCE_GAMES, {
  input: { season: year, conference: conference === 'independents' ? getIndependentSchools(year) : lookup }
});

const BackToTopScript = defineAsyncComponent(() => import('@/components/shared/BackToTopScript.vue'));
const GoogleSearch = defineAsyncComponent(() => import('@/components/shared/GoogleSearchBar.vue'));
</script>

<template>
  <div v-if="result">
    <nav class="navbar DONTPrint">
      <div class="container">
        <div>
          <span>
            <!-- eslint-disable-next-line -->
            <RouterLink class="homelink" to="/">Home</RouterLink>
            <!-- eslint-disable-next-line -->
            <RouterLink class="seasonhome" :to="`/season/football/${year}`"
              >Season Home
              <!-- eslint-disable-next-line -->
            </RouterLink>
          </span>
          <!-- eslint-disable-next-line -->
          <RouterLink
            v-if="flexLink"
            :to="`/tv-windows/${year}`"
            target="_blank">
            Available TV Windows
          </RouterLink>
        </div>
      </div>
    </nav>

    <div id="Main">
      <div id="head">
        <p>
          <!-- eslint-disable-next-line -->
          {{ cased }} Broadcast Schedule<br /><b
            >All start times displayed are based on your device's location.</b
          >
        </p>
        <p>
          NOTE: This list includes telecasts that fall under the TV contracts for the conference. Any road
          non-conference games fall under the home team's telecast rights.
        </p>
        <!-- eslint-disable-next-line -->
        <div v-if="conference !== 'independents'" v-html="contractTvData" />
        <!-- eslint-disable-next-line -->
        <IndependentsGameList
          v-if="conference === 'independents'"
          :games="result.conferenceGames"
          :schools="getIndependentSchools(year).split('|')"
          :year="year" />
        <!-- eslint-disable-next-line -->
        <ConferenceGameList
          v-else
          :year="year"
          :games="result.conferenceGames" />
        <p>
          <BackToTopScript />
          <BackToTopButton />
        </p>
        <GoogleSearch />
      </div>
    </div>
  </div>
  <!-- eslint-disable-next-line -->
  <div v-if="loading">{{ cased }} Games Loading...</div>
  <!-- eslint-disable-next-line -->
  <div v-if="error">There's an error.</div>
</template>

<style scoped>
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
  .network {
    width: 135px;
    padding: 2px;
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
  .network {
    width: 90px;
    padding: 0;
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
