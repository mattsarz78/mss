<script setup lang="ts">
import { useRoute } from 'vue-router';
import { addMetaTags } from '@/utils/metaTags';
import { generateWeeklyTitle } from '@/utils/weeklyTitle';
import WeekSchedule from '@/components/weekly/WeekSchedule.vue';

const route = useRoute();
const { week, sport, year: paramYear } = route.params as { week: string; sport: string; year: string };

const title = generateWeeklyTitle(sport, week, paramYear, false);

addMetaTags(title);
</script>

<template>
  <WeekSchedule :key="route.fullPath" v-reset-adsense-height :week="week" :sport="sport" :param-year="paramYear" />
</template>
