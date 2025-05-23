<script setup lang="ts">
import { useRoute } from 'vue-router';
import ConferenceList from '@/components/season/ConferenceList.vue';
import SeasonDates from '@/components/season/SeasonDates.vue';
import { useSeasonContents } from '@/composables/useSeasonContents';
import validSportYears from '@/staticData/validSportYears.json';
import { addMetaTags } from '@/utils/metaTags';
import Copyright from '@/components/shared/CopyrightLink.vue';
import AdsByGoogle from '@/components/shared/AdsByGoogle.vue';
import type { ValidSportYear } from '@/staticData/exportTypes';

const route = useRoute();
const sport = route.params.sport as string;
const paramYear = route.params.year as string;
const year = sport === 'football' ? paramYear : `${paramYear.substring(0, 4)}${paramYear.substring(5)}`;

const title = `${paramYear} ${sport.charAt(0).toUpperCase()}${sport.slice(1)} Season`;

addMetaTags(title);

const { result, loading, error } = useSeasonContents(year);

const conferenceList =
  sport === 'football' && year !== '2021s'
    ? (validSportYears.find((validSportYear: ValidSportYear) => validSportYear.season === year)?.conferenceListBase ??
      '')
    : '';
</script>

<template>
  <nav class="navbar DONTPrint">
    <div class="container">
      <div class="flex-container">
        <div>
          <RouterLink class="homelink" to="/">Home</RouterLink>
        </div>
        <div><br /></div>
      </div>
    </div>
  </nav>
  <div id="Main" v-reset-adsense-height>
    <p>{{ title }}</p>
    <template v-if="error">Got a problem. Let Matt know.</template>
    <template v-if="loading">
      <div class="loading-container">
        <p class="loading-text">Loading {{ paramYear }} season</p>
      </div>
    </template>
    <template v-if="result && result.seasonContents">
      <div id="content">
        <div id="SeasonLinks" ref="seasonLinksRef" class="DONTPrint">
          <SeasonDates :contents="result.seasonContents" :param-year="paramYear" :year="year" :sport="sport" />
        </div>
        <ConferenceList v-if="sport === 'football'" :conference-list="conferenceList" :year="paramYear" />
      </div>
    </template>
    <div class="inline-block">
      <p>
        <span id="Label9"> Got a question, complaint, comment or know a game not listed here? </span
        ><a id="HyperLink32" href="mailto:footballsked@gmail.com">Send it here</a>
      </p>
    </div>
    <AdsByGoogle />
    <Copyright />
  </div>
</template>

<style scoped>
#SeasonLinks,
#Conference {
  float: left;
  display: inline;
}

#SeasonLinks {
  min-height: 250px;
}

#Main {
  padding-top: 29px;
}

.inline-block {
  display: inline-block;
}

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
  align-items: center;
  height: 18px;
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

@media all and (min-width: 641px) {
  #SeasonLinks {
    width: 55%;
  }

  #Conference {
    width: 35%;
    min-height: 380px;
  }
}

@media only screen and (max-width: 640px) {
  #SeasonLinks {
    width: 100%;
  }

  .navbar {
    padding: 10px 3px;
  }
}
</style>
