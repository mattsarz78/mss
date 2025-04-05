<script setup lang="ts">
import { onMounted } from 'vue';
import { adjustNavBar } from '@/domUtils';
import WeekTextTable from './WeekTextTable.vue';
import type { TvGame } from '@/graphQl';

const props = defineProps<{
  tvGames: TvGame[];
  isBowlWeek: boolean;
  isMbkPostseason: boolean;
  showPpvColumn: boolean;
  season: string;
}>();

const { tvGames, isBowlWeek, isMbkPostseason, showPpvColumn, season } = props;

const addDontPrintClass = () => {
  const selectors = document.querySelectorAll<HTMLElement>(
    'ins.adsbygoogle,ins.adsbygoogle.adsbygoogle-noablate,.gsc-control-cse'
  );
  selectors.forEach((selector) => {
    selector.classList.add('DONTPrint');
  });
};

onMounted(() => {
  adjustNavBar();
  addDontPrintClass();
});
</script>

<template>
  <div id="Main">
    <p id="Directions" class="DONTPrint">
      All start times displayed are based on your device's location. If you have trouble selecting &amp; printing games,
      please try selecting games, changing your print settings to "Print to PDF", print, then open the PDF file and
      print that.
    </p>
    <WeekTextTable
      :season="season"
      :is-bowl-week="isBowlWeek"
      :is-mbk-postseason="isMbkPostseason"
      :show-ppv-column="showPpvColumn"
      :tv-games="tvGames" />
  </div>
</template>

<style scoped>
#TextNav {
  margin: 0;
}

#Directions {
  margin-top: 0;
}

.navbar {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}

@media only screen and (max-width: 640px) {
  .DONTPrint a {
    line-height: 13px;
  }
}
</style>
