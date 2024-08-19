<script setup lang="ts">
import type { TvGame } from '@/graphQl';
import { formatGame, formatTime } from '@/utils';
import { DateTime } from 'luxon';

const props = defineProps(['tvGames', 'isBowlWeek', 'isMbkPostseason', 'showPpvColumn']);
const isBowlWeek = props['isBowlWeek'] as boolean;
const isMbkPostseason = props['isMbkPostseason'] as boolean;
const showPpvColumn = props['showPpvColumn'] as boolean;
const tvGames = props['tvGames'] as TvGame[];

const toggleRow = (event: any) => {
  console.log(event);
  const row = (event.target.parentElement as HTMLElement).closest('tr');
  if (event.target.checked) {
    row?.setAttribute('style', 'background-color: #CCC');
    row?.setAttribute('class', 'gamerow DOPrint rowstyle');
  } else {
    row?.setAttribute('style', 'background-color: #FFF');
    row?.setAttribute('class', 'gamerow DONTPrint rowstyle');
  }
};
</script>

<template>
  <div id="WeekTextGames">
    <table class="tableborder rowStyle DOPrint">
      <thead>
        <tr class="DOPrint">
          <th></th>
          <th>Game</th>
          <th>Network</th>
          <th v-if="!isBowlWeek && !isMbkPostseason && showPpvColumn">PPV</th>
          <th>Time</th>
        </tr>
      </thead>
      <tbody>
        <tr class="gamerow DONTPrint rowStyle" v-for="(tvGame, index) of tvGames" :key="index">
          <td class="tablecell">
            <input class="checkBoxRow" v-on:change="toggleRow($event)" type="checkbox" />
          </td>
          <td class="tablecell gamecell">
            <template v-if="tvGame.gameTitle">
              <b><i>{{ tvGame.gameTitle }}</i></b><br />
            </template>
            <template v-if="tvGame.visitingTeam?.length === 0"></template>
            <template v-else-if="tvGame.visitingTeam?.length === 1 && tvGame.homeTeam?.length === 1">
              {{ tvGame.visitingTeam![0] }} {{ tvGame.location ? 'vs.' : 'at' }} {{ tvGame.homeTeam![0] }}<br />
            </template>
            <template v-else>
              <div v-html="formatGame(tvGame)" />
            </template>
            <template v-if="tvGame.location">(at {{ tvGame.location }})</template>
          </td>
          <td class="tablecell networkcell" v-html="tvGame.network" />
          <td class="tablecell ppvcell" v-if="showPpvColumn">
            {{ tvGame.ppv === 'X' ? 'PPV' : '' }}
          </td>
          <td class="tablecell timecell">
            <template v-if="formatTime(tvGame.timeWithOffset!) === 'TBA'">
              <span></span>{{ DateTime.fromISO(tvGame.timeWithOffset!).toLocal().toFormat('MM/dd/yyyy') + ' TBA' }}
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

#TextNav {
  margin: 0;
}

#Directions {
  margin-top: 0;
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
