<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useQuery } from '@vue/apollo-composable';
import { SEASON_CONTENTS, type WeekInfo } from '@/graphQl';
import { defineAsyncComponent, watch } from 'vue';
import { conferenceListBase, getBasketballSeason } from '@/utils';
import ConferenceList from '@/components/ConferenceList.vue';
import SeasonDates from '@/components/SeasonDates.vue';

const GoogleSearch = defineAsyncComponent(() => import('../components/shared/GoogleSearchBar.vue'));

const route = useRoute();
const sport = route.params.sport as string;
const paramYear = route.params.year as string;
const year = sport === 'football' ? paramYear : getBasketballSeason(paramYear);

const { result, loading, error } = useQuery<{ seasonContents: WeekInfo[] }>(SEASON_CONTENTS, {
  input: {
    season: year
  }
});

const conferenceList = conferenceListBase(sport, year);

const title = document.title;

watch(result, () => {
  if (document.querySelector('#content') && document.querySelector('#SeasonLinks')) {
    const contentWidth = document.querySelector('#content')!.clientWidth;
    const height = document.querySelector('#SeasonLinks')!.clientHeight;

    if (contentWidth > 640) {
      document.querySelector('#content')!.setAttribute('style', `min-height: ${height}px`);
      if (document.querySelector('#Conference')) {
        document.querySelector('#Conference')!.setAttribute('style', `min-height: ${height}px`);
      }
    }
  }
});
</script>

<template>
  <nav class="navbar DONTPrint">
    <div class="container">
      <div>
        <RouterLink to="/">Home</RouterLink><br />
      </div>
    </div>
  </nav>
  <div id="Main">
    <p>{{ title }}</p>
    <div id="content" v-if="result && result.seasonContents">
      <div v-if="error">There's an error</div>
      <div v-if="loading">Loading...</div>

      <div id="SeasonLinks" class="DONTPrint">
        <SeasonDates :contents="result.seasonContents" :paramYear="paramYear" :year="year" :sport="sport"></SeasonDates>
      </div>
      <ConferenceList v-if="sport === 'football'" :conference-list="conferenceList" :year="paramYear" />
    </div>
    <div style="display: inline-block">
      <p>
        <span id="Label9"> Got a question, complaint, comment or know a game not listed here? </span><a id="HyperLink32"
          href="mailto:footballsked@gmail.com">Send it here</a>
      </p>
    </div>
    <GoogleSearch />
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

.navbar {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
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
  body {
    font-size: 0.85em;
  }

  #SeasonLinks {
    width: 100%;
  }

  .DONTPrint a {
    line-height: 13px;
  }
}
</style>
