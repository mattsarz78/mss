<script setup lang="ts">
import { useRoute } from 'vue-router';
import { defineAsyncComponent } from 'vue';
import { addMetaTags, generateWeeklyTitle } from '@/utils/base';

const route = useRoute();
const { week, sport, year: paramYear } = route.params as { week: string; sport: string; year: string };

const title = generateWeeklyTitle(sport, week, paramYear, false);

addMetaTags(title);

const WeekSchedule = defineAsyncComponent(() => import('@/components/WeekSchedule.vue'));
</script>

<template>
  <WeekSchedule :key="route.fullPath" :week="week" :sport="sport" :param-year="paramYear" />
</template>

<style scoped>
a img {
  border: 0;
}
</style>
