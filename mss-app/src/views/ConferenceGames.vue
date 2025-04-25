<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import BackToTopButton from '@/components/shared/BackToTopButton.vue';
import { addMetaTags, flexScheduleLink, getIndependentSchools } from '@/utils/base';
import { getConferenceCasingBySlug, getConferenceContractData } from '@/utils/conference';
import ConferenceGameList from '@/components/conference/ConferenceGameList.vue';
import IndependentsGameList from '@/components/IndependentsGameList.vue';
import { useConferenceGames } from '@/composables/useConferenceGames';

const route = useRoute();
const { conference, year } = route.params as { conference: string; year: string };
const title = `${year} ${getConferenceCasingBySlug(conference)?.cased ?? 'Unknown Conference'} Controlled Games`;

addMetaTags(title);

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

const { result, loading, error } = useConferenceGames(year, conference, lookup);

const BackToTopScript = defineAsyncComponent(() => import('@/components/shared/BackToTopScript.vue'));
const GoogleSearch = defineAsyncComponent(() => import('@/components/shared/GoogleSearchBar.vue'));
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
          <RouterLink v-if="flexLink" :to="`/tv-windows/${year}`" target="_blank"> Available TV Windows </RouterLink>
        </div>
      </div>
    </nav>

    <div id="Main">
      <div id="head">
        <p>{{ cased }} Broadcast Schedule<br /><b>All start times displayed are based on your device's location.</b></p>
        <p>
          NOTE: This list includes telecasts that fall under the TV contracts for the conference. Any road
          non-conference games fall under the home team's telecast rights.
        </p>
        <!-- eslint-disable-next-line -->
        <div v-if="conference !== 'independents'" v-html="contractTvData" />
        <!-- eslint-disable-next-line -->
        <IndependentsGameList v-if="conference === 'independents'" :games="result.conferenceGames"
          :schools="getIndependentSchools(year).split('|')"
          :year="year" />
        <ConferenceGameList v-else :year="year" :games="result.conferenceGames" />
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
.navbar {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}

@media all and (min-width: 641px) {
  .homelink,
  .seasonhome {
    display: block;
  }

  #Main {
    padding-top: 36px;
  }
}

@media only screen and (max-width: 640px) {
  .homelink,
  .seasonhome {
    display: inline-block;
    padding-right: 10px;
  }

  #Main {
    padding-top: 21px;
  }
}
</style>
