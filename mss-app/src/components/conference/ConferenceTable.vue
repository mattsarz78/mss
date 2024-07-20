<script setup lang="ts">
import type { ConferenceGame } from '@/graphQl';
import { formatGame } from '../../utils';
import { DateTime } from 'luxon';

const props = defineProps(['games']);
const games: ConferenceGame[] = props['games'];
</script>

<template>
  <table class="noTVTable">
    <tbody>
      <tr class="header">
        <th>Game</th>
        <th>Network</th>
        <th>Time</th>
      </tr>
      <tr v-for="game of games">
        <td class="game">
          <template v-if="game.gameTitle">
            <b><i>{{ game.gameTitle }}</i></b><br />
          </template>
          <template v-if="game.visitingTeam!.length === 0"></template>
          <template v-else-if="game.visitingTeam!.length === 1 && game.homeTeam!.length === 1">
            {{ game.visitingTeam![0] }} {{ game.location ? 'vs.' : 'at' }} {{ game.homeTeam![0] }}<br />
          </template>
          <template v-else v-html="formatGame(game)">
          </template>
          <template v-if="game.location">(at {{ game.location }})</template>
        </td>
        <td class="network">
          {{ game.network }}
        </td>
        <td class="time">
          {{ game.time }}
          <!-- {{ DateTime.fromISO(game.time!).toLocal().toFormat('t') }} -->
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.game,
.network,
.time {
  border: medium;
  border-style: solid;
  border-color: Gray;
  border-width: thin;
}

.network {
  text-align: center;
}

.time {
  width: 60px;
  text-align: right;
  padding: 2px;
}

.game {
  width: 243px;
}

.noTVTable {
  background-color: #fff;
  border-color: #fff;
  border-style: ridge;
  border-width: 2px;
  border-spacing: 1px;
  border-collapse: collapse;
  font-family: Arial;
}

.back-to-top {
  position: fixed;
  bottom: 2em;
  right: 0;
  text-decoration: none;
  padding: 1em;
  display: none;
}

.navbar {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}

@media all and (min-width: 641px) {
  .game {
    padding: 2px;
  }

  .network {
    width: 135px;
    padding: 2px;
  }

  .imageDimensions {
    height: 40px;
    width: 55px;
  }

  .homelink,
  .seasonhome {
    display: block;
  }

  #Main {
    padding-top: 56px;
  }
}

@media only screen and (max-width: 640px) {
  .game {
    padding: 1px;
  }

  .network {
    width: 90px;
    padding: 0;
  }

  .imageDimensions {
    height: 29px;
    width: 40px;
  }

  .homelink,
  .seasonhome {
    display: inline-block;
    padding-right: 10px;
  }

  #Main {
    padding-top: 61px;
  }
}
</style>
