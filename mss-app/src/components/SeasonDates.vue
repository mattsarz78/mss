<script setup lang="ts">
import type { WeekInfo } from '@/graphQl';
import { hasBasketballPostseason } from '@/utils';
import { DateTime } from 'luxon';
import WeekLink from '@/components/WeekLink.vue';

const props = defineProps(['contents', 'sport', 'paramYear', 'year']);
const contents = props['contents'] as WeekInfo[];
const sport = props['sport'] as string;
const paramYear = props['paramYear'] as string;
const year = props['year'] as string;

const lastContent = contents[contents.length - 1];
</script>

<template>
  <div v-if="sport === 'football'">
    <template v-for="(content, index) of contents" :key="index">
      <template v-if="lastContent.week !== content.week">
        <WeekLink :year="paramYear" :sport="sport" :content="content" :linkText="`Week ${content.week.toString()} - ${DateTime.fromISO(content.startDate).toFormat('MMMM dd')} to
                    ${DateTime.fromISO(content.endDate).toFormat('MMMM dd')}`" />
      </template>
      <template v-else>
        <WeekLink :sport="sport" :year="paramYear" :content="content" :linkText="`Bowl Games`" />
      </template>
    </template>
  </div>
  <div v-else-if="sport === 'basketball' && hasBasketballPostseason(year)">
    <template v-for="(content, index) of contents.filter(x => x.postseasonInd === null)" :key="index">
      <template v-if="!content.postseasonInd">
        <WeekLink :sport="sport" :content="content" :year="paramYear" :linkText="`Week ${content.week.toString()} - ${DateTime.fromISO(content.startDate).toFormat('MMMM dd')} to
                    ${DateTime.fromISO(content.endDate).toFormat('MMMM dd')}`" />
      </template>
    </template>
    <p v-if="contents.some(x => x.postseasonInd)">
      <template v-for="(content, index) of contents.filter(x => x.postseasonInd)" :key="index">
        <template v-if="content.postseasonInd === 'N'">
          <WeekLink :sport="sport" :year="paramYear" :content="content" :linkText="`NCAA Tournament`" />
        </template>
        <template v-if="content.postseasonInd === 'I'">
          <WeekLink :sport="sport" :year="paramYear" :content="content" :linkText="`NIT`" />
        </template>
        <template v-if="content.postseasonInd === 'O'">
          <WeekLink :sport="sport" :year="paramYear" :content="content" :linkText="`Other Postseason Tournaments`" />
        </template>
      </template>
    </p>
  </div>
  <div v-else>
    <template v-for="(content, index) of contents" :key="index">
      <WeekLink :sport="sport" :year="paramYear" :content="content" :linkText="`Week ${content.week.toString()} - ${DateTime.fromISO(content.startDate).toFormat('MMMM dd')} to
                    ${DateTime.fromISO(content.endDate).toFormat('MMMM dd')}`" />
    </template>
  </div>
</template>
