<script lang="ts" setup>
import { RouterLink } from 'vue-router';
import type { WeekInfo } from '../graphQl';

const props = defineProps(['content', 'sport', 'linkText', 'year']);
const content = props['content'] as WeekInfo;
const sport = props['sport'] as string;
const year = props['year'] as string;
const linkText = props['linkText'] as string;
</script>

<template>
  <RouterLink :to="`/schedule/${sport}/${year}/${content.week}`"> {{ linkText }} </RouterLink><br />
</template>
