<script setup lang="ts">
import type { WeekInfo } from '@/graphQl';
import { DateTime } from 'luxon';
import WeekLink from '@/components/WeekLink.vue';
import { computed } from 'vue';
import validSportYears from '@/staticData/validSportYears.json';
import type { ValidSportYear } from '@/staticData/exportTypes';

const props = defineProps<{ contents: WeekInfo[]; sport: string; paramYear: string; year: string }>();

const { contents, sport, paramYear, year } = props;

const hasBasketballPostseason = (year: string): boolean => {
  return (
    validSportYears.find((validSportYear: ValidSportYear) => validSportYear.season === year)?.hasPostseason ?? false
  );
};

const lastContent = contents[contents.length - 1];

const filteredContents = computed(() => contents.filter((x) => !x.postseasonInd));
const postseasonContents = computed(() => contents.filter((x) => x.postseasonInd));

const getLinkText = (content: WeekInfo) => {
  if (lastContent.week !== content.week) {
    return `Week ${content.week.toString()} - ${DateTime.fromISO(content.startDate, { zone: 'utc' }).toFormat('MMMM dd')} to ${DateTime.fromISO(content.endDate, { zone: 'utc' }).toFormat('MMMM dd')}`;
  }
  return 'Bowl Games';
};

const getPostseasonLinkText = (content: WeekInfo) => {
  if (content.postseasonInd === 'N') {
    return 'NCAA Tournament';
  } else if (content.postseasonInd === 'I') {
    return 'NIT';
  }
  return 'Other Postseason Tournaments';
};
</script>

<template>
  <div v-if="sport === 'football'">
    <template v-for="(content, index) in contents" :key="index">
      <WeekLink :year="paramYear" :sport="sport" :content="content" :link-text="getLinkText(content)" />
    </template>
  </div>
  <div v-else-if="sport === 'basketball' && hasBasketballPostseason(year)">
    <template v-for="(content, index) in filteredContents" :key="index">
      <WeekLink :sport="sport" :content="content" :year="paramYear"
        :link-text="`Week ${content.week.toString()} - ${DateTime.fromISO(content.startDate, { zone: 'utc' }).toFormat('MMMM dd')} to ${DateTime.fromISO(content.endDate, { zone: 'utc' }).toFormat('MMMM dd')}`" />
    </template>
    <p v-if="postseasonContents.length">
      <template v-for="(content, index) in postseasonContents" :key="index">
        <WeekLink :sport="sport" :year="paramYear" :content="content" :link-text="getPostseasonLinkText(content)" />
      </template>
    </p>
  </div>
  <div v-else>
    <template v-for="(content, index) in contents" :key="index">
      <WeekLink :sport="sport" :year="paramYear" :content="content"
        :link-text="`Week ${content.week.toString()} - ${DateTime.fromISO(content.startDate, { zone: 'utc' }).toFormat('MMMM dd')} to ${DateTime.fromISO(content.endDate, { zone: 'utc' }).toFormat('MMMM dd')}`" />
    </template>
  </div>
</template>
