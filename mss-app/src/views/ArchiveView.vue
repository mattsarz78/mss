<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { defineAsyncComponent } from 'vue';

const GoogleSearch = defineAsyncComponent(() => import('../components/shared/GoogleSearchBar.vue'));
</script>

<template>
  <div id="Main">
    <div id="content">
      <div id="Links">
        <RouterLink to="/">Home</RouterLink><br />
        <br />
        <RouterLink to="/season/football/2019">2019 Football</RouterLink><br />
        <RouterLink to="/season/basketball/201920">2019-20 Men's Basketball</RouterLink><br />
        <br />
        <RouterLink to="/season/football/2018">2018 Football</RouterLink><br />
        <RouterLink to="/season/basketball/201819">2018-19 Men's Basketball</RouterLink><br />
        <br />
        <RouterLink to="/season/football/2017">2017 Football</RouterLink><br />
        <RouterLink to="/season/basketball/201718">2017-18 Men's Basketball</RouterLink><br />
        <br />
        <RouterLink to="/season/football/2016">2016 Football</RouterLink><br />
        <RouterLink to="/season/basketball/201617">2016-17 Men's Basketball</RouterLink><br />
        <br />
        <RouterLink to="/season/football/2015">2015 Football</RouterLink><br />
        <RouterLink to="/season/basketball/201516">2015-16 Men's Basketball</RouterLink><br />
        <br />
        <RouterLink to="/season/football/2014">2014 Football</RouterLink><br />
        <RouterLink to="/season/basketball/201415">2014-15 Men's Basketball</RouterLink><br />
        <br />
        <RouterLink to="/season/football/2013">2013 Football</RouterLink><br />
        <RouterLink to="/season/basketball/201314">2013-14 Men's Basketball</RouterLink><br />
        <br />
        <RouterLink to="/season/football/2012">2012 Football</RouterLink><br />
        <RouterLink to="/season/basketball/201213">2012-13 Men's Basketball</RouterLink><br />
        <br />
        <RouterLink to="/season/football/2011">2011 Football</RouterLink><br />
        <RouterLink to="/season/basketball/201112">2011-12 Men's Basketball</RouterLink><br />
        <br />
        <RouterLink to="/season/football/2010">2010 Football</RouterLink><br />
        <RouterLink to="/season/basketball/201011">2010-11 Men's Basketball</RouterLink><br />
        <br />
        <RouterLink to="/season/football/2009">2009 Football</RouterLink><br />
        <RouterLink to="/season/basketball/200910">2009-10 Men's Basketball</RouterLink><br />
        <br />
        <RouterLink to="/season/football/2008">2008 Football</RouterLink><br />
        <RouterLink to="/season/basketball/200809">2008-09 Men's Basketball</RouterLink><br />
        <br />
        <RouterLink to="/season/football/2007">2007 Football</RouterLink><br />
        <RouterLink to="/season/basketball/200708">2007-08 Men's Basketball</RouterLink><br />
        <br />
        <RouterLink to="/season/football/2006">2006 Football</RouterLink><br />
        <RouterLink to="/season/basketball/200607">2006-07 Men's Basketball</RouterLink><br />
        <br />
        <RouterLink to="/season/football/2005">2005 Football</RouterLink><br />
        <RouterLink to="/season/basketball/200506">2005-06 Men's Basketball</RouterLink><br />
        <br />
      </div>
    </div>
    <GoogleSearch />
  </div>
</template>

<style scoped>
.navbar {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}

@media all and (min-width: 641px) {
  #Links {
    width: 45%;
    float: left;
    display: inline;
  }

  #Main {
    padding-top: 37px;
  }
}

@media only screen and (max-width: 640px) {
  #Links {
    width: 100%;
    float: left;
    display: inline;
  }

  body {
    font-size: 0.85em;
  }

  #Main {
    padding-top: 48px;
  }
}
</style>
