<script setup lang="ts">
import { generateWeeklyTitle } from '@/utils/base';
import { useSeoMeta } from '@unhead/vue';
import { defineAsyncComponent } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const { week, sport, year: paramYear } = route.params as { week: string; sport: string; year: string };

const title = generateWeeklyTitle(sport, week, paramYear, false);

useSeoMeta({ title, twitterTitle: title, ogTitle: title, ogUrl: window.location.href });

const WeekTextSchedule = defineAsyncComponent(() => import('@/components/WeekTextSchedule.vue'));
</script>

<template>
  <WeekTextSchedule :key="route.fullPath" :week="week" :sport="sport" :param-year="paramYear" />
</template>

<style scoped>
#TextNav {
  margin: 0;
}

#Directions {
  margin-top: 0;
}

@media only screen and (max-width: 640px) {
  .DONTPrint a {
    line-height: 13px;
  }
}
</style>
