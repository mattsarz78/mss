<script setup lang="ts">
import { useConferenceGames } from '#composables/useConferenceGames.mjs';
import { useSeasonData } from '#composables/useSeasonData.mjs';
import ConferenceGameList from '#conference/ConferenceGameList.vue';
import IndependentsGameList from '#conference/IndependentsGameList.vue';
import conferenceCasing from '#data/conferenceCasing.json' with { type: 'json' };
import type { ConferenceCasing } from '#data/exportTypes.mjs';
import AdsByGoogle from '#shared/AdsByGoogle.vue';
import BackToTop from '#shared/BackToTop.vue';
import Copyright from '#shared/CopyrightLink.vue';
import { addMetaTags } from '#utils/metaTags.mjs';
import { setupPrintListener } from '#utils/printListener.mts';
import { RouterLink, useRoute } from 'vue-router';

const route = useRoute();
const { conference, year } = route.params as { conference: string; year: string };

const conferenceData = conferenceCasing.find((x: ConferenceCasing) => x.slug === conference);
if (!conferenceData) {
  throw new Error(`Invalid conference slug: ${conference}`);
}
const { cased, lookup, id } = conferenceData;

const title = `${year} ${cased} Controlled Games`;

const { result: seasonResult, loading: seasonLoading, error: seasonError } = useSeasonData(year);

addMetaTags(title);

const { result, loading, error } = useConferenceGames(year, conference, lookup, id);

setupPrintListener();
</script>

<template>
  <template v-if="result && seasonResult">
    <nav role="navigation" class="navbar DONTPrint">
      <div class="container">
        <div class="flex-container">
          <div>
            <RouterLink class="flex-row" to="/">Home</RouterLink>
          </div>
          <div>
            <RouterLink class="flex-row" :to="`/season/football/${year}`">Season Home</RouterLink>
          </div>
          <div>
            <RouterLink
              v-if="seasonResult.seasonData.flexScheduleLink"
              class="flex-row"
              :to="`/tv-windows/${year}`"
              target="_blank"
              rel="noopener"
              >Available TV Windows
            </RouterLink>
          </div>
        </div>
      </div>
    </nav>

    <main v-reset-adsense-height>
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
        <div
          v-if="conference !== 'independents'"
          v-dompurify-html="result.conferenceGames.contractYearData[0].contractText" />
        <IndependentsGameList
          v-if="conference === 'independents'"
          :games="result.conferenceGames.conferenceGames"
          :contract-year-data="result.conferenceGames.contractYearData"
          :schools="result.conferenceGames.conferences"
          :year="year" />
        <ConferenceGameList v-else :year="year" :games="result.conferenceGames.conferenceGames" />
        <BackToTop />
        <AdsByGoogle />
      </div>
    </main>
    <Copyright />
  </template>
  <template v-if="loading || seasonLoading">
    <div class="loading-container">
      <p class="loading-text">{{ cased }} Games Loading...</p>
    </div>
  </template>
  <template v-if="error || seasonError">
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

main {
  padding-top: 40px;
}

@media only screen and (max-width: 640px) {
  .flex-container {
    flex-direction: row;
  }

  .flex-row {
    padding-right: 10px;
  }

  main {
    padding-top: 21px;
  }

  .navbar {
    height: 15px;
    padding: 10px 3px;
  }
}
</style>
