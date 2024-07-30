<script setup lang="ts">
import type { WeekInfo } from '@/graphQl';
import { hasBasketballPostseason } from '@/utils';
import { DateTime } from 'luxon';
import WeekLink from '@/components/WeekLink.vue';

const props = defineProps(['contents', 'sport', 'year']);
const contents = props['contents'] as WeekInfo[];
const sport = props['sport'] as string;
const year = props['year'] as string;

const lastContent = contents[contents.length - 1];
</script>

<template>
  <div v-if="sport === 'football'">
    <template v-for="(content, index) of contents" :key="index">
      <template v-if="lastContent.week !== content.week">
        <WeekLink :year="year" :sport="sport" :content="content" :linkText="`Week ${content.week.toString()} - ${DateTime.fromISO(content.startDate).toFormat('MMMM dd')} to
                    ${DateTime.fromISO(content.endDate).toFormat('MMMM dd')}`" />
      </template>
      <template v-else>
        <WeekLink :sport="sport" :year="year" :content="content" :linkText="`Bowl Games`" />
      </template>
    </template>
  </div>
  <div v-else-if="sport === 'basketball' && hasBasketballPostseason(year)">
    <template v-for="(content, index) of contents" :key="index">
      <template v-if="!content.postseasonInd">
        <WeekLink :sport="sport" :content="content" :year="year" :linkText="`Week ${content.week.toString()} - ${DateTime.fromISO(content.startDate).toFormat('MMMM dd')} to
                    ${DateTime.fromISO(content.endDate).toFormat('MMMM dd')}`" />
      </template>
      <template v-if="content.postseasonInd === 'N'">
        <WeekLink :sport="sport" :year="year" :content="content" :linkText="`NCAA Tournament`" />
      </template>
      <template v-if="content.postseasonInd === 'I'">
        <WeekLink :sport="sport" :year="year" :content="content" :linkText="`NIT`" />
      </template>
      <template v-if="content.postseasonInd === 'O'">
        <WeekLink :sport="sport" :year="year" :content="content" :linkText="`Other Postseason Tournaments`" />
      </template>
    </template>
  </div>
  <div v-else>
    <template v-for="(content, index) of contents" :key="index">
      <WeekLink :sport="sport" :year="year" :content="content" :linkText="`Week ${content.week.toString()} - ${DateTime.fromISO(content.startDate).toFormat('MMMM dd')} to
                    ${DateTime.fromISO(content.endDate).toFormat('MMMM dd')}`" />
    </template>
  </div>
</template>
