<script setup lang="ts">
import { useRoute } from 'vue-router';
import { defineAsyncComponent, onMounted, ref, watch } from 'vue';
import { addMetaTags, conferenceListBase, createTitle, getBasketballSeason } from '@/utils/base';
import ConferenceList from '@/components/ConferenceList.vue';
import SeasonDates from '@/components/SeasonDates.vue';
import { useSeasonContents } from '@/composables/useSeasonContents';

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

onMounted(updateStyles);
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
    <div v-if="result && result.seasonContents" id="content" ref="contentRef">
      <div v-if="error">There's an error</div>
      <div v-if="loading">Loading...</div>

      <div id="SeasonLinks" ref="seasonLinksRef" class="DONTPrint">
        <SeasonDates :contents="result.seasonContents" :param-year="paramYear" :year="year" :sport="sport" />
      </div>
      <ConferenceList v-if="sport === 'football'" :conference-list="conferenceList" :year="paramYear" />
    </div>
    <div class="inline-block">
      <p>
        <span id="Label9"> Got a question, complaint, comment or know a game not listed here? </span
        ><a id="HyperLink32" href="mailto:footballsked@gmail.com">Send it here</a>
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
