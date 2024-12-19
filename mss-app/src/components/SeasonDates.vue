<script setup lang="ts">
import type { WeekInfo } from '@/graphQl';
import { hasBasketballPostseason } from '@/utils';
import { DateTime } from 'luxon';
import WeekLink from '@/components/WeekLink.vue';
import { computed } from 'vue';

const props = defineProps<{
  contents: WeekInfo[];
  sport: string;
  paramYear: string;
  year: string;
}>();

const { contents, sport, paramYear, year } = props;

const lastContent = contents[contents.length - 1];

const filteredContents = computed(() => contents.filter(x => x.postseasonInd === null));
const postseasonContents = computed(() => contents.filter(x => x.postseasonInd));

</script>

<template>
  <div v-if="sport === 'football'">
    <template v-for="(content, index) in contents" :key="index">
      <WeekLink :year="paramYear" :sport="sport" :content="content" :linkText="lastContent.week !== content.week
        ? `Week ${content.week.toString()} - ${DateTime.fromISO(content.startDate).toFormat('MMMM dd')} to ${DateTime.fromISO(content.endDate).toFormat('MMMM dd')}`
        : 'Bowl Games'" />
    </template>
  </div>
  <div v-else-if="sport === 'basketball' && hasBasketballPostseason(year)">
    <template v-for="(content, index) in filteredContents" :key="index">
      <template v-if="!content.postseasonInd">
        <WeekLink :sport="sport" :content="content" :year="paramYear" :linkText="`Week ${content.week.toString()} - ${DateTime.fromISO(content.startDate).toFormat('MMMM dd')} to
                    ${DateTime.fromISO(content.endDate).toFormat('MMMM dd')}`" />
      </template>
    </template>
    <p v-if="postseasonContents.length">
      <template v-for="(content, index) in postseasonContents" :key="index">
        <WeekLink :sport="sport" :year="paramYear" :content="content" :linkText="content.postseasonInd === 'N'
          ? 'NCAA Tournament'
          : content.postseasonInd === 'I'
            ? 'NIT'
            : 'Other Postseason Tournaments'" />
      </template>
    </p>
  </div>
  <div v-else>
    <template v-for="(content, index) in contents" :key="index">
      <WeekLink :sport="sport" :year="paramYear" :content="content" :linkText="`Week ${content.week.toString()} - ${DateTime.fromISO(content.startDate).toFormat('MMMM dd')} to
                    ${DateTime.fromISO(content.endDate).toFormat('MMMM dd')}`" />
    </template>
  </div>
</template>
