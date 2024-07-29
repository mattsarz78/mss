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
.game {
  width: 243px;
  border: medium;
  border-style: solid;
  border-color: Gray;
  border-width: thin;
}

.tablecell {
  border: medium;
  border-style: solid;
  border-color: gray;
  border-width: thin;
}

.tableborder {
  border-style: ridge;
  border-width: 2px;
  border-spacing: 1px;
  border-collapse: collapse;
  font-family: Arial;
}

.networkcell {
  width: 165px;
  text-align: center;
}

.ppvcell {
  width: 25px;
  text-align: center;
}

.timecell {
  margin: 0 auto;
  padding: 0 2px;
}

.gamecell {
  width: 250px;
}

.inputpad {
  padding-left: 10px;
  margin-right: 3px;
}

.back-to-top {
  position: fixed;
  bottom: 2em;
  right: 0;
  text-decoration: none;
  padding: 1em;
  display: none;
}

#TextNav {
  margin: 0;
}

#Directions {
  margin-top: 0;
}

.navbar {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}

@media all and (min-width: 641px) {
  .tableborder {
    font-size: 11px;
  }

  .rowStyle {
    width: 580px;
  }

  .homelink,
  .seasonhome {
    display: block;
  }
}

@media only screen and (max-width: 640px) {
  .tableborder {
    font-size: 7pt;
  }

  .DONTPrint a {
    line-height: 13px;
  }

  .homelink,
  .seasonhome {
    display: inline-block;
    padding-right: 10px;
  }
}
</style>
