<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const { week, sport, year: paramYear } = route.params as { week: string; sport: string; year: string };
const WeekTextSchedule = defineAsyncComponent(() => import('../components/WeekTextSchedule.vue'));

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
