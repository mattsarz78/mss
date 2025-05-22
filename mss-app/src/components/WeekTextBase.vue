<script setup lang="ts">
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
  Array.from(selectors).map((selector) => {
    selector.classList.add('DONTPrint');
  });
};

addDontPrintClass();
</script>

<template>
  <div id="Main" v-reset-adsense-height>
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
#Directions {
  margin-top: 3px;
}

#Main {
  padding-top: 130px;
  min-height: 500px;
}

@media only screen and (max-width: 640px) {
  #Directions {
    margin-top: 6px;
  }

  #Main {
    padding-top: 100px;
  }
}
</style>
