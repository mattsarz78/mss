<script setup lang="ts">
import type { TvGame } from '@/graphQl';
import { adjustNavBar } from '@/utils';
import { DateTime } from 'luxon';
import { onMounted } from 'vue';
import WeekGamesTable from '../components/weekly/WeekGamesTable.vue';

const props = defineProps(['tvGames', 'isBowlWeek', 'isMbkPostseason', 'showPpvColumn', 'season']);
const tvGames = props['tvGames'] as TvGame[];
const isBowlWeek = props['isBowlWeek'] as boolean;
const isMbkPostseason = props['isBowlWeek'] as boolean;
const datesList: string[] = [];
const showPpvColumn = props['showPpvColumn'] as boolean;
const season = props['season'] as string;

tvGames.map((value) => {
  const date = DateTime.fromISO(value.timeWithOffset!).toLocal().toISODate()!;
  if (!datesList.some((dateFromList) => dateFromList === date)) {
    datesList.push(date);
  }
});

onMounted(() => adjustNavBar());
</script>

<template v-if="datesList">
  <div id="Main">
    <div id="WeeksBase">
      <template v-if="tvGames.length === 0">
        <p>There are no televised games at this time</p>
      </template>
      <template v-else>
        <div v-for="(weekDate, index) of datesList" :key="index">
          <WeekGamesTable :season="season" :weekDate="weekDate" :isBowlWeek="isBowlWeek"
            :isMbkPostseason="isMbkPostseason" :showPpvColumn="showPpvColumn" :tvGamesForDate="tvGames.filter((x) => DateTime.fromISO(x.timeWithOffset!).toLocal().toISODate() === weekDate)
              " />
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  display: none;
  position: absolute;
  z-index: 100000;
  opacity: 0.4;
  filter: alpha(opacity=40);
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #333;
}

#RSNLists {
  position: absolute;
  z-index: 99999999;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  border: 1px solid #000;
  padding: 10px;
  display: none;
}

.FSNLink,
.closer {
  text-decoration: underline;
  color: #00f;
  cursor: pointer;
}

.FSNrow {
  border-width: 1px;
  border-style: solid;
  vertical-align: top;
}

.rsnLabel {
  vertical-align: middle;
}

.FSNtable {
  border-width: 1px;
  border-style: solid;
  margin: auto;
  font-family: Arial;
}

@media all and (min-width: 641px) {
  #RSNLists {
    width: 250px;
  }
}

@media only screen and (max-width: 640px) {
  #RSNLists {
    width: 160px;
  }
}
</style>
