<script setup lang="ts">
import { onMounted } from 'vue';
import { adjustNavBar } from '@/utils';
import WeekTextTable from './WeekTextTable.vue';
import type { TvGame } from '@/graphQl';

const props = defineProps(['tvGames', 'isBowlWeek', 'isMbkPostseason', 'showPpvColumn', 'season']);
const season = props['season'] as string;
const isBowlWeek = props['isBowlWeek'] as boolean;
const isMbkPostseason = props['isMbkPostseason'] as boolean;
const showPpvColumn = props['showPpvColumn'] as boolean;
const tvGames = props['tvGames'] as TvGame[];

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
    <!-- <form action="@ViewBag.ActionName" id="TextForm" method="post"> -->
    <p id="Directions" class="DONTPrint">
      Choose your time zone and check the games that you want to print your own customized schedule. If you have trouble
      selecting &amp; printing games, please try selecting games, changing your print settings to "Print to PDF", print,
      then open the PDF file and print that.
      <!-- Those in Arizona and Hawai'i, your states are available as a specific
            choice and adjust based on the week of the season. -->
    </p>
    <WeekTextTable :season="season" :isBowlWeek="isBowlWeek" :isMbkPostseason="isMbkPostseason"
      :showPpvColumn="showPpvColumn" :tvGames="tvGames" />
    <!-- </form> -->
  </div>
</template>

<style scoped>
.game {
  width: 243px;
  border: medium;
  border-style: solid;
  border-color: Gray;
  border-width: thin;
}

.tablecell {
  border: medium;
  border-style: solid;
  border-color: gray;
  border-width: thin;
}

.tableborder {
  border-style: ridge;
  border-width: 2px;
  border-spacing: 1px;
  border-collapse: collapse;
  font-family: Arial;
}

.networkcell {
  width: 165px;
  text-align: center;
}

.ppvcell {
  width: 25px;
  text-align: center;
}

.timecell {
  margin: 0 auto;
  padding: 0 2px;
}

.gamecell {
  width: 250px;
}

.inputpad {
  padding-left: 10px;
  margin-right: 3px;
}

.back-to-top {
  position: fixed;
  bottom: 2em;
  right: 0;
  text-decoration: none;
  padding: 1em;
  display: none;
}

#TextNav {
  margin: 0;
}

#Directions {
  margin-top: 0;
}

.navbar {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}

@media all and (min-width: 641px) {
  .tableborder {
    font-size: 11px;
  }

  .rowStyle {
    width: 580px;
  }

  .homelink,
  .seasonhome {
    display: block;
  }
}

@media only screen and (max-width: 640px) {
  .tableborder {
    font-size: 7pt;
  }

  .DONTPrint a {
    line-height: 13px;
  }

  .homelink,
  .seasonhome {
    display: inline-block;
    padding-right: 10px;
  }
}
</style>
