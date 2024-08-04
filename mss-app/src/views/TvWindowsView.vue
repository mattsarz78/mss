<script setup lang="ts">
import { adjustNavBar, flexScheduleLink } from '@/utils';
import { defineAsyncComponent, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const year = route.params.year as string;

const flexLink = `${flexScheduleLink(year)}/pubhtml?widget=true&amp;headers=false`;

const GoogleSearch = defineAsyncComponent(() => import('../components/shared/GoogleSearchBar.vue'));

onMounted(() => {
  adjustNavBar();
});
</script>

<template>
  <nav class="navbar DONTPrint">
    <div class="container">
      <div>
        <span class="blockspan">
          <RouterLink class="homelink" to="/">Home</RouterLink><br />
          <RouterLink class="seasonhome" :to="`/season/football/${year}`">Season Home</RouterLink>
        </span>
      </div>
    </div>
  </nav>
  <div id="Main">
    <iframe class="tvFrame" :src="flexLink"></iframe>
    <GoogleSearch />
  </div>
</template>

<style scoped>
.coverage a img,
.network a img {
  border: 0;
}

.network {
  text-align: center;
  border: medium;
  border-style: solid;
  border-color: Gray;
  border-width: thin;
}

.coverage {
  border: medium;
  border-color: Gray;
  border-style: solid;
  border-width: thin;
  empty-cells: show;
  text-align: center;
}

.time {
  width: 60px;
  text-align: right;
  border: medium;
  border-color: Gray;
  border-style: solid;
  border-width: thin;
  padding: 2px;
}

.conference {
  width: 100px;
  text-align: center;
  border: medium;
  border-color: Gray;
  border-style: solid;
  border-width: thin;
  padding: 5px;
}

.telecast {
  width: 400px;
  text-align: center;
  border: medium;
  border-color: Gray;
  border-style: solid;
  border-width: thin;
  padding: 5px;
}

.overlay {
  display: none;
  position: absolute;
  z-index: 100000;
  opacity: 0.4;
  filter: alpha(opacity=40);
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #333;
}

#RSNLists {
  position: absolute;
  z-index: 99999999;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  border: 1px solid #000;
  padding: 10px;
  display: none;
}

.FSNLink,
.closer {
  text-decoration: underline;
  color: #00f;
  cursor: pointer;
}

.FSNrow {
  border-width: 1px;
  border-style: solid;
  vertical-align: top;
}

.rsnLabel {
  vertical-align: middle;
}

.FSNtable {
  border-width: 1px;
  border-style: solid;
  margin: auto;
  font-family: Arial;
}

.navbar {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}

.tvFrame {
  height: 400px;
}

@media all and (min-width: 641px) {
  .network {
    width: 135px;
    padding: 2px;
  }

  .coverage {
    width: 189px;
  }

  #RSNLists {
    width: 250px;
  }

  .tvFrame {
    width: 700px;
  }

  .homelink,
  .seasonhome {
    display: block;
  }

}

@media only screen and (max-width: 640px) {
  .network {
    width: 90px;
    padding: 0;
  }

  .coverage {
    width: 105px;
  }

  #RSNLists {
    width: 160px;
  }

  .blockspan {
    display: block;
    padding-bottom: 3px;
  }

  .tvFrame {
    width: 90%;
  }

  .homelink,
  .seasonhome {
    display: inline-block;
    padding-right: 10px;
  }

}
</style>
