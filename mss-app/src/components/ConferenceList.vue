<script setup lang="ts">
import { getConferenceCasing } from '@/utils';
import { computed } from 'vue';

const props = defineProps<{ conferenceList: string; year: string }>();
const { conferenceList, year } = props;

const accLink = getConferenceCasing('acc');
const aacLink = computed(() => conferenceList === 'ListBase3' ? getConferenceCasing('aac') : undefined);
const beastLink = computed(() => conferenceList !== 'ListBase3' ? getConferenceCasing('beast') : undefined);
const b12Link = getConferenceCasing('b12');
const b1gLink = getConferenceCasing('b1g');
const cusaLink = getConferenceCasing('cusa');
const indLink = getConferenceCasing('ind');
const macLink = getConferenceCasing('mac');
const mwLink = getConferenceCasing('mw');
const secLink = getConferenceCasing('sec');
const sbcLink = getConferenceCasing('sbc');
const pacLink = computed(() => conferenceList === 'ListBase1' ? getConferenceCasing('p10') : getConferenceCasing('p12'));
const wacLink = computed(() => conferenceList === 'ListBase1' ? getConferenceCasing('wac') : undefined);

</script>

<template>
  <div id="Conference" ref="conferenceRef" class="DONTPrint">
    <span>By Conference</span><br />
    <br />
    <RouterLink :to="`/contract/${accLink?.slug}/${year}`">{{ accLink?.cased }}</RouterLink><br />
    <div v-if="aacLink">
      <RouterLink :to="`/contract/${aacLink?.slug}/${year}`">{{ aacLink?.cased }}</RouterLink><br />
    </div>
    <RouterLink :to="`/contract/${b12Link?.slug}/${year}`">{{ b12Link?.cased }}</RouterLink><br />
    <template v-if="beastLink">
      <RouterLink :to="`/contract/${beastLink?.slug}/${year}`">{{ beastLink?.cased }}</RouterLink><br />
    </template>
    <RouterLink :to="`/contract/${b1gLink?.slug}/${year}`">{{ b1gLink?.cased }}</RouterLink><br />
    <RouterLink :to="`/contract/${cusaLink?.slug}/${year}`">{{ cusaLink?.cased }}</RouterLink><br />
    <RouterLink :to="`/contract/${indLink?.slug}/${year}`">{{ indLink?.cased }}</RouterLink><br />
    <RouterLink :to="`/contract/${macLink?.slug}/${year}`">{{ macLink?.cased }}</RouterLink><br />
    <RouterLink :to="`/contract/${mwLink?.slug}/${year}`">{{ mwLink?.cased }}</RouterLink><br />
    <RouterLink :to="`/contract/${pacLink?.slug}/${year}`">{{ pacLink?.cased }}</RouterLink><br />
    <RouterLink :to="`/contract/${secLink?.slug}/${year}`">{{ secLink?.cased }}</RouterLink><br />
    <RouterLink :to="`/contract/${sbcLink?.slug}/${year}`">{{ sbcLink?.cased }}</RouterLink><br />
    <template v-if="wacLink">
      <RouterLink :to="`/contract/wac/${year}`">WAC</RouterLink><br />
    </template>
  </div>
</template>
