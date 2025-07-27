<script lang="ts" setup>
import type { WeekInfo } from '#/graphQl.mjs';
import { RouterLink } from 'vue-router';

const props = defineProps<{ content: WeekInfo; sport: string; linkText: string; year: string }>();
const { content, sport, linkText, year } = props;
</script>

<template>
  <RouterLink :to="`/schedule/${sport}/${year}/${content.week}`"> {{ linkText }} </RouterLink><br />
</template>
