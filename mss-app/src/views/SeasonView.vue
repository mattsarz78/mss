<script setup lang="ts">
import { useRoute } from 'vue-router';
import { defineAsyncComponent, ref, watch } from 'vue';
import { getBasketballSeason } from '@/utils/base';
import ConferenceList from '@/components/ConferenceList.vue';
import SeasonDates from '@/components/SeasonDates.vue';
import { useSeasonContents } from '@/composables/useSeasonContents';
import { validSportYears } from '@/constants/validSportYears';
import { addMetaTags } from '@/utils/metaTags';
import Copyright from '@/components/shared/CopyrightLink.vue';
import AdsByGoogle from '@/components/shared/AdsByGoogle.vue';

const conferenceListBase = (sport: string, year: string): string => {
  return sport === 'football' && year !== '2021s'
    ? (validSportYears.find((validSportYear) => validSportYear.season === year)?.conferenceListBase ?? '')
    : '';
};

const createTitle = (sport: string, year: string): string => {
  const capitalized = `${sport.charAt(0).toUpperCase()}${sport.slice(1)}`;
  return `${year} ${capitalized} Season`;
};

const GoogleSearch = defineAsyncComponent(() => import('@/components/shared/GoogleSearchBar.vue'));

const route = useRoute();
const sport = route.params.sport as string;
const paramYear = route.params.year as string;
const year = sport === 'football' ? paramYear : getBasketballSeason(paramYear);

const title = createTitle(sport, paramYear);

addMetaTags(title);

const { result, loading, error } = useSeasonContents(year);

const conferenceList = conferenceListBase(sport, year);

const contentRef = ref<HTMLElement | null>(null);
const seasonLinksRef = ref<HTMLElement | null>(null);
const conferenceRef = ref<HTMLElement | null>(null);

const updateStyles = () => {
  if (contentRef.value && seasonLinksRef.value) {
    const contentWidth = contentRef.value.clientWidth;
    const height = seasonLinksRef.value.clientHeight;

    if (contentWidth > 640) {
      contentRef.value.style.minHeight = `${height.toString()}px`;
      if (conferenceRef.value) {
        conferenceRef.value.style.minHeight = `${height.toString()}px`;
      }
    }
  }
};

watch(result, updateStyles);
</script>

<template>
  <nav class="navbar DONTPrint">
    <div class="container">
      <div><RouterLink to="/"> Home </RouterLink><br /></div>
    </div>
  </nav>
  <div id="Main">
    <p>{{ title }}</p>
    <template v-if="error">Got a problem. Let Matt know.</template>
    <template v-if="loading">Loading...</template>
    <template v-if="result && result.seasonContents">
      <div id="content" ref="contentRef">
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
    <GoogleSearch />
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

  .DONTPrint a {
    line-height: 13px;
  }
}
</style>
