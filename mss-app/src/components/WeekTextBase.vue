<script setup lang="ts">
import { onMounted } from 'vue';
import { adjustNavBar } from '@/utils';
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

onMounted(() => {
  adjustNavBar();
  const selectors = document.querySelectorAll<HTMLElement>(
    'ins.adsbygoogle,ins.adsbygoogle.adsbygoogle-noablate,.gsc-control-cse'
  );
  selectors.forEach((selector) => selector.classList.add('DONTPrint'));
});
</script>

<template>
  <div id="Main">
    <p id="Directions" class="DONTPrint">
      Choose your time zone and check the games that you want to print your own customized schedule. If you have trouble
      selecting &amp; printing games, please try selecting games, changing your print settings to "Print to PDF", print,
      then open the PDF file and print that.
    </p>
    <WeekTextTable :season="season" :isBowlWeek="isBowlWeek" :isMbkPostseason="isMbkPostseason"
      :showPpvColumn="showPpvColumn" :tvGames="tvGames" />
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
