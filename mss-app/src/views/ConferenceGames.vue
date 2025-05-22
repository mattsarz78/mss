<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router';
import { addMetaTags } from '@/utils/metaTags';
import { getConferenceContractData } from '@/utils/conference';
import ConferenceGameList from '@/components/conference/ConferenceGameList.vue';
import IndependentsGameList from '@/components/IndependentsGameList.vue';
import { useConferenceGames } from '@/composables/useConferenceGames';
import conferenceCasing from '@/staticData/conferenceCasing.json';
import validSportYears from '@/staticData/validSportYears.json';
import Copyright from '@/components/shared/CopyrightLink.vue';
import AdsByGoogle from '@/components/shared/AdsByGoogle.vue';
import BackToTop from '@/components/shared/BackToTop.vue';
import type { ConferenceCasing, FlexScheduleLink, ValidSportYear } from '@/staticData/exportTypes';
import flexScheduleLinks from '@/staticData/flexScheduleLinks.json';

const route = useRoute();
const { conference, year } = route.params as { conference: string; year: string };

const conferenceData = conferenceCasing.find((x: ConferenceCasing) => x.slug === conference);
if (!conferenceData) {
  throw new Error(`Invalid conference slug: ${conference}`);
}
const { cased, lookup, id } = conferenceData;

const title = `${year} ${cased} Controlled Games`;

addMetaTags(title);

const flexLink = flexScheduleLinks.find((link: FlexScheduleLink) => link.season === year)?.url ?? '';

const independentSchools =
  validSportYears.find((validSportYear: ValidSportYear) => validSportYear.season === year)?.independents ?? '';

const contractTvData =
  conference !== 'independents'
    ? (() => {
        if (!id) {
          throw new Error(`Invalid conference casing or ID for slug: ${conference}`);
        }
        return getConferenceContractData(id, year);
      })()
    : '';

const { result, loading, error } = useConferenceGames(year, conference, lookup, independentSchools);
</script>

<template>
  <template v-if="result">
    <nav class="navbar DONTPrint">
      <div class="container">
        <div class="flex-container">
          <div>
            <RouterLink class="flex-row" to="/">Home</RouterLink>
          </div>
          <div>
            <RouterLink class="flex-row" :to="`/season/football/${year}`">Season Home</RouterLink>
          </div>
          <div>
            <RouterLink v-if="flexLink" class="flex-row" :to="`/tv-windows/${year}`" target="_blank"
              >Available TV Windows
            </RouterLink>
          </div>
        </div>
      </div>
    </nav>

    <div id="Main" v-reset-adsense-height>
      <div id="head" v-reset-adsense-height>
        <p>
          {{ cased }} Broadcast Schedule<br /><strong
            >All start times displayed are based on your device's location.</strong
          >
        </p>
        <p>
          NOTE: This list includes telecasts that fall under the TV contracts for the conference. Any road
          non-conference games fall under the home team's telecast rights.
        </p>
        <div v-if="conference !== 'independents'" v-dompurify-html="contractTvData" />
        <IndependentsGameList
          v-if="conference === 'independents'"
          :games="result.conferenceGames"
          :schools="independentSchools.split('|')"
          :year="year" />
        <ConferenceGameList v-else :year="year" :games="result.conferenceGames" />
        <BackToTop />
        <AdsByGoogle />
      </div>
    </div>
    <Copyright />
  </template>
  <template v-if="loading">
    <div class="loading-container">
      <p class="loading-text">{{ cased }} Games Loading...</p>
    </div>
  </template>
  <template v-if="error">
    <div class="error-container">
      <p>Sorry. Got a bit of a problem. Let Matt know.</p>
    </div>
  </template>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  width: 100%;
  background-color: white;
  padding: 2px 0;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  height: 54px;
  align-items: center;
  display: block;
}

.container {
  height: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.loading-container,
.error-container {
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  background: #fff;
  border: 1px solid #eee;
}

.loading-text {
  font-size: 1.2em;
  color: #666;
}

.flex-container {
  display: flex;
  flex-direction: column;
}

#Main {
  padding-top: 40px;
  min-height: 500px;
}

@media only screen and (max-width: 640px) {
  .flex-container {
    flex-direction: row;
  }

  .flex-row {
    padding-right: 10px;
  }

  #Main {
    padding-top: 21px;
  }

  .navbar {
    height: 15px;
    padding: 10px 3px;
  }
}
</style>
