<script setup lang="ts">
import { addMetaTags } from '#utils/metaTags.mjs';
import { setupPrintListener } from '#utils/printListener.mts';
import { generateWeeklyTitle } from '#utils/weeklyTitle.mjs';
import WeekSchedule from '#weekly/WeekSchedule.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const { week, sport, year: paramYear } = route.params as { week: string; sport: string; year: string };

const title = generateWeeklyTitle(sport, week, paramYear, false);

addMetaTags(title);

setupPrintListener();
</script>

<template>
  <WeekSchedule :key="route.fullPath" v-reset-adsense-height :week="week" :sport="sport" :param-year="paramYear" />
</template>
