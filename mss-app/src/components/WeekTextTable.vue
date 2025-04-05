<script setup lang="ts">
import type { TvGame } from '@/graphQl';
import { formatGame, formatTime } from '@/gameUtils';
import { DateTime } from 'luxon';

const props = defineProps<{
  tvGames: TvGame[];
  isBowlWeek: boolean;
  isMbkPostseason: boolean;
  showPpvColumn: boolean;
}>();

const { tvGames, isBowlWeek, isMbkPostseason, showPpvColumn } = props;

const toggleRow = (event: Event) => {
  const parentElement = (event.target as HTMLInputElement).parentElement;
  const row = parentElement ? parentElement.closest('tr') : null;
  if (!row) return;
  if ((event.target as HTMLInputElement).checked) {
    row.classList.add('DOPrint');
    row.classList.remove('DONTPrint');
    row.style.setProperty('background-color', '#CCC');
  } else {
    row.classList.add('DONTPrint');
    row.classList.remove('DOPrint');
    row.style.setProperty('background-color', '#FFF');
  }
};
</script>

<template>
  <div id="WeekTextGames">
    <table class="tableborder rowStyle DOPrint">
      <thead>
        <tr class="DOPrint">
          <th />
          <th>Game</th>
          <th>Network</th>
          <th v-if="!isBowlWeek && !isMbkPostseason && showPpvColumn">PPV</th>
          <th>Time</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(tvGame, index) in tvGames" :key="index" class="gamerow DONTPrint rowStyle">
          <td class="tablecell">
            <input class="checkBoxRow" type="checkbox" @change="toggleRow" />
          </td>
          <td class="tablecell gamecell">
            <template v-if="tvGame.gameTitle">
              <b
                ><i>{{ tvGame.gameTitle }}</i></b
              ><br />
            </template>
            <template v-if="tvGame.visitingTeam?.length === 0" />
            <template v-else-if="tvGame.visitingTeam?.length === 1 && tvGame.homeTeam?.length === 1">
              {{ tvGame.visitingTeam![0] }}
              {{ tvGame.location ? 'vs.' : 'at' }} {{ tvGame.homeTeam![0] }}<br />
            </template>
            <template v-else>
              <!-- eslint-disable-next-line -->
              <div v-html="formatGame(tvGame)" />
            </template>
            <template v-if="tvGame.location"> (at {{ tvGame.location }}) </template>
          </td>
          <!-- eslint-disable-next-line -->
          <td class="tablecell networkcell" v-html="tvGame.network" />
          <td v-if="showPpvColumn" class="tablecell ppvcell">
            {{ tvGame.ppv === 'X' ? 'PPV' : '' }}
          </td>
          <td class="tablecell timecell">
            <template v-if="formatTime(tvGame.timeWithOffset!) === 'TBA'">
              <span />{{ DateTime.fromISO(tvGame.timeWithOffset!).toLocal().toFormat('MM/dd/yyyy') + ' TBA' }}
            </template>
            <template v-else>
              {{ DateTime.fromISO(tvGame.timeWithOffset!).toLocal().toFormat('MM/dd/yyyy t') }}
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.tablecell {
  border: medium solid gray;
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

@media all and (min-width: 641px) {
  .tableborder {
    font-size: 11px;
  }

  .rowStyle {
    width: 580px;
  }
}

@media only screen and (max-width: 640px) {
  .tableborder {
    font-size: 7pt;
  }

  .DONTPrint a {
    line-height: 13px;
  }
}
</style>
