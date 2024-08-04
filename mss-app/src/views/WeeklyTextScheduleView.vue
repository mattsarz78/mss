<script setup lang="ts">
import { useRoute } from 'vue-router';
import WeekTextSchedule from '@/components/WeekTextSchedule.vue';

const route = useRoute();
const week = route.params.week as string;
const sport = route.params.sport as string;
const paramYear = route.params.year as string;
</script>

<template>
  <WeekTextSchedule :week="week" :sport="sport" :paramYear="paramYear" :key="route.fullPath"></WeekTextSchedule>
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
