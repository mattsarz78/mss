<script setup lang="ts">
import { addMetaTags } from '@/utils/metaTags';
import { generateWeeklyTitle } from '@/utils/weeklyTitle';
import { useRoute } from 'vue-router';
import WeekTextSchedule from '@/components/WeekTextSchedule.vue';

const route = useRoute();
const { week, sport, year: paramYear } = route.params as { week: string; sport: string; year: string };

const title = generateWeeklyTitle(sport, week, paramYear, true);

addMetaTags(title);
</script>

<template>
  <WeekTextSchedule :key="route.fullPath" :week="week" :sport="sport" :param-year="paramYear" />
</template>

<style scoped>
@media only screen and (max-width: 640px) {
  .DONTPrint a {
    line-height: 13px;
  }
}
</style>
