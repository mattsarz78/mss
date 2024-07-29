<script setup lang="ts">
import type { NoTvGame } from '@/graphQl';
import { DateTime } from 'luxon';
import NoTvGamesTable from '../noTVGames/NoTvGamesTable.vue';

const props = defineProps(['noTvGames']);
const noTvGames = props['noTvGames'] as NoTvGame[];
const datesList: string[] = [];

noTvGames.map((value) => {
  const date = DateTime.fromISO(value.timeWithOffset).toLocal().toISODate()!;
  if (!datesList.some((dateFromList) => dateFromList === date)) {
    datesList.push(date);
  }
});
const toggleNoTV = () => {
  const noTVDiv = document.querySelector('.slidingNoTVDiv') as HTMLElement;
  if (noTVDiv.hasAttribute('style')) {
    noTVDiv.style.display === 'none' ? (noTVDiv.style.display = 'block') : (noTVDiv.style.display = 'none');
  } else {
    noTVDiv.style.display = 'block';
  }

  const buttonTitle = document.querySelector('#btnConferenceGames')?.getAttribute('value');

  buttonTitle?.startsWith('Show')
    ? document.querySelector('#btnConferenceGames')?.setAttribute('value', 'Hide Non-Televised Games')
    : document.querySelector('#btnConferenceGames')?.setAttribute('value', 'Show Non-Televised Games');
};
</script>

<template>
  <div>
    <input
      id="btnConferenceGames"
      type="button"
      value="Show Non-Televised Games"
      class="show_hideNoTV"
      v-on:click="toggleNoTV()"
    />
    <div class="slidingNoTVDiv">
      <p v-if="!noTvGames.length">All FBS games scheduled for this week are being televised or shown online</p>
      <NoTvGamesTable
        v-for="noTVDate of datesList"
        :noTvDate="noTVDate"
        :noTvGamesForDate="
          noTvGames.filter((x) => DateTime.fromISO(x.timeWithOffset).toLocal().toISODate() === noTVDate)
        "
      />
      <!-- else
            {
            DateTime endDate = Model.WeekDates.EndDate;
            Model.WeekDates.CurrentDate = Model.WeekDates.StartDate.AddDays(-1);
            while ((Model.WeekDates.CurrentDate = Model.WeekDates.CurrentDate.AddDays(1)) <= endDate) { if
                (Model.NoTVGameList.Any(x=> x.Time.ToShortDateString() ==
                Model.WeekDates.CurrentDate.ToShortDateString()))
                {
                Html.RenderPartial("NoTVGamesTable", Model);
                }
                }
                } -->
      <br />
    </div>
  </div>
</template>

<style scoped>
.fcsgame {
  background-color: #ff0;
}

.slidingNoTVDiv {
  display: none;
  padding-top: 10px;
}

.show_hideNoTV,
.show_hideWeb {
  display: inline-block;
}

.webGame {
  display: table-row;
}

.game {
  width: 243px;
  border: medium;
  border-style: solid;
  border-color: Gray;
  border-width: thin;
}

.coverage a img,
.network a img,
.coverageppv a img {
  border: 0;
}

.network {
  text-align: center;
  border: medium;
  border-style: solid;
  border-color: Gray;
  border-width: thin;
}

.coverage,
.coverageppv {
  border: medium;
  border-color: Gray;
  border-style: solid;
  border-width: thin;
  empty-cells: show;
  text-align: center;
}

.ppv {
  border: medium;
  border-style: solid;
  border-color: Gray;
  border-width: thin;
  empty-cells: show;
  text-align: center;
}

.time {
  width: 60px;
  text-align: right;
  border: medium;
  border-color: Gray;
  border-style: solid;
  border-width: thin;
  padding: 2px;
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

.conference {
  width: 100px;
  text-align: center;
  border: medium;
  border-color: Gray;
  border-style: solid;
  border-width: thin;
  padding: 5px;
}

.telecast {
  width: 400px;
  text-align: center;
  border: medium;
  border-color: Gray;
  border-style: solid;
  border-width: thin;
  padding: 5px;
}

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

.imgLocation,
.rsnLabel {
  vertical-align: middle;
}

.FSNtable {
  border-width: 1px;
  border-style: solid;
  margin: auto;
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

:deep(.linkblock) {
  display: inline-block;
  padding-top: 7px;
  padding-bottom: 2px;
}

.filters {
  margin: 0;
}

.navbar {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}

.pad {
  padding: 5px 0;
}

@media all and (min-width: 641px) {
  .game {
    padding: 2px;
  }

  .network {
    width: 135px;
    padding: 2px;
  }

  .coverage {
    width: 189px;
  }

  .coverageppv {
    width: 260px;
  }

  .ppv {
    width: 135px;
  }

  #RSNLists {
    width: 250px;
  }

  :deep(.imageDimensions) {
    height: 40px;
    width: 55px;
  }

  .mobilespan {
    display: block;
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

  .coverageppv {
    width: 140px;
  }

  .ppv {
    width: 44.22px;
  }

  #RSNLists {
    width: 160px;
  }

  :deep(.imageDimensions) {
    height: 29px;
    width: 40px;
  }

  .mobilespan {
    display: inline-block;
    padding-right: 10px;
  }

  .blockspan {
    display: block;
    padding-bottom: 3px;
  }

  .mobilehide {
    display: none;
  }
}
</style>
