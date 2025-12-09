<script setup lang="ts">
import type { TvGame } from '#/graphQl.mjs';
import WeekTextTable from '#text/WeekTextTable.vue';

const props = defineProps<{
  tvGames: TvGame[];
  isBowlWeek: boolean;
  isMbkPostseason: boolean;
  showPpvColumn: boolean;
  season: string;
}>();

const { tvGames, isBowlWeek, isMbkPostseason, showPpvColumn, season } = props;
</script>

<template>
  <main v-reset-adsense-height>
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
  </main>
</template>

<style scoped>
#Directions {
  margin-top: 3px;
}

main {
  padding-top: 130px;
}

@media only screen and (max-width: 640px) {
  #Directions {
    margin-top: 6px;
  }

  main {
    padding-top: 100px;
  }
}
</style>
