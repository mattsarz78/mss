<script setup lang="ts">
import { addMetaTags } from '@/utils/metaTags';
import { generateWeeklyTitle } from '@/utils/weeklyTitle';
import { useRoute } from 'vue-router';
import WeekTextSchedule from '@/components/weeklyText/WeekTextSchedule.vue';

const route = useRoute();
const { week, sport, year: paramYear } = route.params as { week: string; sport: string; year: string };

const title = generateWeeklyTitle(sport, week, paramYear, true);

addMetaTags(title);
</script>

<template>
  <WeekTextSchedule :key="route.fullPath" v-reset-adsense-height :week="week" :sport="sport" :param-year="paramYear" />
</template>
