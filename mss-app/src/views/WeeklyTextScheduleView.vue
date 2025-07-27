<script setup lang="ts">
import WeekTextSchedule from '#text/WeekTextSchedule.vue';
import { addMetaTags } from '#utils/metaTags.mjs';
import { generateWeeklyTitle } from '#utils/weeklyTitle.mjs';
import { useRoute } from 'vue-router';

const route = useRoute();
const { week, sport, year: paramYear } = route.params as { week: string; sport: string; year: string };

const title = generateWeeklyTitle(sport, week, paramYear, true);

addMetaTags(title);
</script>

<template>
  <WeekTextSchedule :key="route.fullPath" v-reset-adsense-height :week="week" :sport="sport" :param-year="paramYear" />
</template>
