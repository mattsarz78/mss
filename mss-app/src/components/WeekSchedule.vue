<script setup lang="ts">
import { NO_TV_GAMES, SEASON_CONTENTS, TV_GAMES, type NoTvGame, type TvGame, type WeekInfo } from '@/graphQl';
import {
    getBasketballSeason,
    flexScheduleLink,
    isBowlGameWeek,
    isBasketballPostseason,
    hasNoTVGames,
    shouldShowPpvColumn,
    isFirstWeek,
    isNextWeekBasketballPostseason,
    isNextWeekBowlGameWeek
} from '@/utils';
import { useQuery } from '@vue/apollo-composable';
import { defineAsyncComponent, onMounted, watch, type Ref } from 'vue';
import BackToTopButton from './shared/BackToTopButton.vue';
import WeeklyBase from './WeeklyBase.vue';
import NoTvGames from './noTVGames/NoTvGames.vue';
import { DateTime } from 'luxon';

const GoogleSearch = defineAsyncComponent(() => import('./shared/GoogleSearchBar.vue'));
const BackToTopScript = defineAsyncComponent(() => import('./shared/BackToTopScript.vue'));

const props = defineProps(['week', 'sport', 'paramYear', 'key']);
const week = parseInt(props['week'] as string);
const sport = props['sport'] as string;
const paramYear = props['paramYear'] as string;

const year = sport === 'football' ? paramYear : getBasketballSeason(paramYear);
const flexLink = flexScheduleLink(year);
const showNoTvGames = hasNoTVGames(year);

const getTVGames = (year: string, sport: string, week: number) => {
    const {
        result: tvGameResult,
        loading: tvGameLoading,
        error: tvGameError
    } = useQuery<{ tvGames: TvGame[] }>(TV_GAMES, {
        input: {
            season: year,
            sport,
            week
        }
    })
    return {
        tvGameResult,
        tvGameLoading,
        tvGameError
    }
};

const {
    tvGameResult,
    tvGameLoading,
    tvGameError
} = getTVGames(year, sport, week);

const {
    result: seasonContentsResult,
    loading: seasonContentsLoading,
    error: seasonContentsError
} = useQuery<{ seasonContents: WeekInfo[] }>(SEASON_CONTENTS, {
    input: {
        season: year
    }
});

const {
    result: noTvGamesResult,
    loading: noTvGamesLoading,
    error: noTvGamesError
} = useQuery<{ noTvGames: NoTvGame[] }>(NO_TV_GAMES, {
    input: {
        season: year,
        week
    }
});

const nextWeek = week + 1;
const previousWeek = week - 1;

let isBowlWeek: boolean = false;
let isMbkPostseason: boolean = false;
let currentWeek: WeekInfo;
let gamesToday: boolean = false;
let isWeekOne: boolean = false;
let isNextWeekMbkPostseason: boolean = false;
let isNextWeekBowlWeek: boolean = false;

watch([seasonContentsResult, noTvGamesResult, tvGameResult], ([seasonContentsValue, noTvGamesValue, tvGameValue]) => {
    if (!!seasonContentsValue && !!noTvGamesValue && !!tvGameValue) {
        isBowlWeek = isBowlGameWeek(sport, seasonContentsResult.value?.seasonContents!, week);
        isMbkPostseason = isBasketballPostseason(sport, seasonContentsResult.value?.seasonContents!, week);
        currentWeek = seasonContentsResult.value?.seasonContents.filter((x) => x.week === week)[0]!;
        gamesToday = seasonContentsResult.value?.seasonContents.filter(x => x.week === week).some((x) =>
            DateTime.fromISO(x.endDate) >= DateTime.now() && DateTime.fromISO(x.startDate) <= DateTime.now()
        ) ?? false;
        isWeekOne = isFirstWeek(seasonContentsResult.value?.seasonContents!, week)
        isNextWeekMbkPostseason = isNextWeekBasketballPostseason(sport, seasonContentsResult.value?.seasonContents!, week)
        isNextWeekBowlWeek = isNextWeekBowlGameWeek(sport, seasonContentsResult.value?.seasonContents!, week)
    }
}, { immediate: true });

</script>

<template>
    <div>
        <div v-if="seasonContentsLoading || noTvGamesLoading || tvGameLoading">Loading</div>
        <div v-if="seasonContentsResult && noTvGamesResult && tvGameResult">
            <nav class="navbar DONTPrint">
                <div class="container">
                    <div>
                        <span class="blockspan">
                            <RouterLink class="mobilespan" to="/">Home</RouterLink>
                            <RouterLink class="mobilespan" :to="`/season/${sport}/${paramYear}`">Season Home
                            </RouterLink>
                            <RouterLink class="mobilespan" v-if="gamesToday" :to="`/schedule/${sport}/daily`">Today's
                                Schedule
                            </RouterLink>
                        </span>
                        <span class="blockspan">
                            <RouterLink v-if="flexLink" class="mobilespan" :to="`/tv-windows/${paramYear}`"
                                target="_blank">
                                Available TV Windows</RouterLink>
                            <!-- <a class="mobilespan" href="@Url.Content(" ~/Schedule/WeeklyText/" + Model.SportYear + "/" +
                              Model.Week)">Customizable Text-Only Page</a> -->
                        </span>
                        <div class="pad" v-if="!isMbkPostseason && !isBowlWeek">
                            <template v-if="isWeekOne">
                                <span style="float: left">
                                    <RouterLink :to="{ path: `/schedule/${sport}/${paramYear}/${nextWeek}` }">Next
                                        Week
                                    </RouterLink>
                                </span>
                            </template>
                            <template v-else>
                                <span style="float: left">
                                    <RouterLink :to="{ path: `/schedule/${sport}/${paramYear}/${previousWeek}` }">
                                        Previous Week
                                    </RouterLink>
                                </span>
                                <span style="float: right" v-if="!isNextWeekMbkPostseason && !isNextWeekBowlWeek">
                                    <RouterLink
                                        :to="{ path: `/schedule/${sport}/${paramYear}/${nextWeek}`, force: true }">Next
                                        Week
                                    </RouterLink>
                                </span>
                            </template>
                            <br class="mobilehide" />
                        </div>
                        <br />
                        <div class="filters" v-if="tvGameResult">
                            <input v-if="!isBowlWeek && !isMbkPostseason" id="btnWebGames" type="button"
                                value="Hide Web Exclusive Games" class="show_hideWeb" />
                            <!-- @Html.Partial("TimeZoneDropDown") -->
                        </div>
                    </div>
                </div>
            </nav>
            <template v-if="currentWeek && tvGameResult">
                <!-- <form action="@ViewBag.ActionName" id="WeekForm" method="post"> -->
                <!-- @if (Model.ShowRSNPartialView)
              {
              @Html.Partial("CoverageNotes/" + Model.SportYear + "/FSNWeek" + Model.Week)
              } -->
                <WeeklyBase :season="year" :tvGames="tvGameResult.tvGames" :currentWeek="currentWeek"
                    :isBowlWeek="isBowlWeek" :isMbkPostseason="isMbkPostseason"
                    :showPpvColumn="shouldShowPpvColumn(year)" />
                <NoTvGames v-if="!isBowlWeek && showNoTvGames && noTvGamesResult"
                    :noTvGames="noTvGamesResult?.noTvGames" />
                <p>
                    <BackToTopScript />
                    <BackToTopButton />
                </p>
                <!-- </form> -->
                <GoogleSearch />
            </template>
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
