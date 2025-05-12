<script setup lang="ts">
import conferenceCasing from '@/staticData/conferenceCasing.json';
import type { ConferenceCasing } from '@/staticData/exportTypes';
import { computed } from 'vue';

const props = defineProps<{ conferenceList: string; year: string }>();
const { conferenceList, year } = props;

const getConferenceCasing = (conference: string) => conferenceCasing.find((x: ConferenceCasing) => x.id === conference);

const conferenceLinks = computed(() => {
  const links = [
    { key: 'acc', link: getConferenceCasing('acc') },
    { key: 'b12', link: getConferenceCasing('b12') },
    { key: 'b1g', link: getConferenceCasing('b1g') },
    { key: 'cusa', link: getConferenceCasing('cusa') },
    { key: 'ind', link: getConferenceCasing('ind') },
    { key: 'mac', link: getConferenceCasing('mac') },
    { key: 'mw', link: getConferenceCasing('mw') },
    { key: 'pac', link: conferenceList === 'ListBase1' ? getConferenceCasing('p10') : getConferenceCasing('p12') },
    { key: 'sec', link: getConferenceCasing('sec') },
    { key: 'sbc', link: getConferenceCasing('sbc') }
  ];

  if (conferenceList === 'ListBase3') {
    links.splice(1, 0, { key: 'aac', link: getConferenceCasing('aac') });
  } else {
    links.splice(1, 0, { key: 'beast', link: getConferenceCasing('beast') });
  }

  if (conferenceList === 'ListBase1') {
    links.push({ key: 'wac', link: getConferenceCasing('wac') });
  }

  return links;
});
</script>

<template>
  <div id="Conference" ref="conferenceRef" class="DONTPrint">
    <p><span>By Conference</span></p>
    <div v-for="conference in conferenceLinks" :key="conference.key">
      <RouterLink :to="`/contract/${conference.link?.slug}/${year}`"> {{ conference.link?.cased }} </RouterLink><br />
    </div>
  </div>
</template>
