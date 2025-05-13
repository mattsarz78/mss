<script setup lang="ts">
import type { TvGame } from '@/graphQl';
import { formatTime } from '@/utils/game';

const props = defineProps<{ tvGame: TvGame; season: string }>();
const { tvGame } = props;
</script>

<template>
  <td class="game">
    <template v-if="tvGame.gameTitle">
      <span class="gameTitle">{{ tvGame.gameTitle }}</span>
      <br />
    </template>
    <template v-if="tvGame.location">
      <template v-if="tvGame.visitingTeam?.length">
        {{ tvGame.visitingTeam[0] }} vs. {{ tvGame.homeTeam![0] }}<br />
      </template>
      (at {{ tvGame.location }})<br />
    </template>
    <template v-else>
      <template v-if="tvGame.visitingTeam?.length">
        {{ tvGame.visitingTeam[0] }} at {{ tvGame.homeTeam![0] }}<br />
      </template>
    </template>
  </td>
  <td v-dompurify-html="tvGame.networkJpg" class="network" />
  <td v-dompurify-html="tvGame.coverageNotes" class="coverage" />
  <td class="time">
    {{ formatTime(tvGame.timeWithOffset!) }}
  </td>
</template>

<style scoped>
.game {
  width: 270px;
  border: medium solid Gray;
  border-width: thin;
}

:deep(.imgBorder) {
  border: 0;
}

.network {
  text-align: center;
  border: medium solid Gray;
  border-width: thin;
}

.coverage {
  border: medium solid Gray;
  border-width: thin;
  empty-cells: show;
  text-align: center;
}

.time {
  width: 70px;
  text-align: right;
  border: medium solid Gray;
  border-width: thin;
  padding: 2px;
}

:deep(.linkblock) {
  display: inline-block;
  padding-top: 7px;
  padding-bottom: 2px;
}

.gameTitle {
  font-weight: bold;
  font-style: italic;
}

@media all and (min-width: 641px) {
  .game {
    padding: 2px;
    width: 245px;
  }

  .network {
    width: 150px;
    padding: 2px;
  }

  .coverage {
    width: 210px;
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

  .coverage {
    width: 105px;
  }
}
</style>
