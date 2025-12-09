<script setup lang="ts">
import AdsByGoogle from '#shared/AdsByGoogle.vue';
import Copyright from '#shared/CopyrightLink.vue';
import { addMetaTags } from '#utils/metaTags.mjs';
import { RouterLink } from 'vue-router';

const title = 'Archive Listings';

addMetaTags(title);

const footballSeasons = [
  '2019',
  '2018',
  '2017',
  '2016',
  '2015',
  '2014',
  '2013',
  '2012',
  '2011',
  '2010',
  '2009',
  '2008',
  '2007',
  '2006',
  '2005'
];

const basketballSeasons = [
  '2019-20',
  '2018-19',
  '2017-18',
  '2016-17',
  '2015-16',
  '2014-15',
  '2013-14',
  '2012-13',
  '2011-12',
  '2010-11',
  '2009-10',
  '2008-09',
  '2007-08',
  '2006-07',
  '2005-06'
];
</script>

<template>
  <main v-reset-adsense-height>
    <div id="content">
      <div id="Links">
        <RouterLink to="/"> Home </RouterLink><br />
        <br />
        <RouterLink to="/season/football/2021s"> 2021 Football - Spring FCS only </RouterLink><br />
        <RouterLink to="/season/football/2020r"> 2020 Football - Revised </RouterLink><br />
        <RouterLink to="/season/football/2020"> 2020 Football - Pre-Conference Only Announcements </RouterLink><br />
        <RouterLink to="/season/basketball/2020-21"> 2020-21 Men's Basketball </RouterLink><br />
        <br />
        <div v-for="(season, index) in footballSeasons" :key="index">
          <RouterLink :to="`/season/football/${season}`"> {{ season }} Football </RouterLink><br />
          <RouterLink :to="`/season/basketball/${basketballSeasons[index]}`">
            {{ basketballSeasons[index] }} Men's Basketball </RouterLink
          ><br />
          <br />
        </div>
      </div>
    </div>
    <AdsByGoogle />
  </main>
  <Copyright />
</template>

<style scoped>
@media all and (min-width: 641px) {
  #Links {
    width: 45%;
    float: left;
    display: inline;
  }

  main {
    padding-top: 37px;
  }
}

@media only screen and (max-width: 640px) {
  #Links {
    width: 100%;
    float: left;
    display: inline;
  }

  main {
    padding-top: 48px;
  }
}
</style>
