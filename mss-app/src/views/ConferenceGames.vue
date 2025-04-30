<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import BackToTopButton from '@/components/shared/BackToTopButton.vue';
import { addMetaTags } from '@/utils/metaTags';
import { getConferenceContractData } from '@/utils/conference';
import ConferenceGameList from '@/components/conference/ConferenceGameList.vue';
import IndependentsGameList from '@/components/IndependentsGameList.vue';
import { useConferenceGames } from '@/composables/useConferenceGames';
import { conferenceCasing } from '../constants/conferenceCasing';
import { validSportYears } from '@/constants/validSportYears';
import { flexScheduleLink } from '@/utils/flexSchedule';
import Copyright from '@/components/shared/CopyrightLink.vue';
import AdsByGoogle from '@/components/shared/AdsByGoogle.vue';

const route = useRoute();
const { conference, year } = route.params as { conference: string; year: string };

const conferenceData = conferenceCasing.find((x) => x.slug === conference);
if (!conferenceData) {
  throw new Error(`Invalid conference slug: ${conference}`);
}
const { cased, lookup, id } = conferenceData;

const title = `${year} ${cased} Controlled Games`;

addMetaTags(title);

const flexLink = flexScheduleLink(year);

const getIndependentSchools = (year: string): string => {
  return validSportYears.find((validSportYear) => validSportYear.season === year)?.independents ?? '';
};

const contractTvData =
  conference !== 'independents'
    ? (() => {
        if (!id) {
          throw new Error(`Invalid conference casing or ID for slug: ${conference}`);
        }
        return getConferenceContractData(id, year);
      })()
    : '';

const { result, loading, error } = useConferenceGames(year, conference, lookup, getIndependentSchools);

const BackToTopScript = defineAsyncComponent(() => import('@/components/shared/BackToTopScript.vue'));
</script>

<template>
  <template v-if="result">
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
        <p>
          {{ cased }} Broadcast Schedule<br /><strong
            >All start times displayed are based on your device's location.</strong
          >
        </p>
        <p>
          NOTE: This list includes telecasts that fall under the TV contracts for the conference. Any road
          non-conference games fall under the home team's telecast rights.
        </p>
        <div v-if="conference !== 'independents'" v-html="contractTvData" />
        <IndependentsGameList
          v-if="conference === 'independents'"
          :games="result.conferenceGames"
          :schools="getIndependentSchools(year).split('|')"
          :year="year" />
        <ConferenceGameList v-else :year="year" :games="result.conferenceGames" />
        <p>
          <BackToTopScript />
          <BackToTopButton />
        </p>
        <AdsByGoogle />
      </div>
    </div>
    <Copyright />
  </template>
  <template v-if="loading">{{ cased }} Games Loading...</template>
  <template v-if="error">Got a problem. Let Matt know.</template>
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
