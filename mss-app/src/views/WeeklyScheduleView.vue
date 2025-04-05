<script setup lang="ts">
import { useRoute } from 'vue-router';
import { defineAsyncComponent } from 'vue';

const route = useRoute();
const {
  week,
  sport,
  year: paramYear
} = route.params as { week: string; sport: string; year: string };
const WeekSchedule = defineAsyncComponent(
  () => import('@/components/WeekSchedule.vue')
);
</script>

<template>
  <WeekSchedule
    :key="route.fullPath"
    :week="week"
    :sport="sport"
    :param-year="paramYear" />
</template>

<style scoped>
.coverage a img,
.network a img {
  border: 0;
}

.network {
  text-align: center;
  border: medium solid Gray;
  border-width: thin;
}

.coverage {
  border: medium solid Gray;
  border-width: thin;
  empty-cells: show;
  text-align: center;
}

.time {
  width: 60px;
  text-align: right;
  border: medium solid Gray;
  border-width: thin;
  padding: 2px;
}

.conference {
  width: 100px;
  text-align: center;
  border: medium solid Gray;
  border-width: thin;
  padding: 5px;
}

.telecast {
  width: 400px;
  text-align: center;
  border: medium solid Gray;
  border-width: thin;
  padding: 5px;
}

@media all and (min-width: 641px) {
  .network {
    width: 135px;
    padding: 2px;
  }

  .coverage {
    width: 189px;
  }
}

@media only screen and (max-width: 640px) {
  .network {
    width: 90px;
    padding: 0;
  }

  .coverage {
    width: 105px;
  }
}
</style>
