<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { defineAsyncComponent, nextTick, onMounted, ref } from 'vue';
import { addMetaTags } from '@/utils/base';

const title = "Matt's College Sports on TV";

addMetaTags(title);

const linksRef = ref<HTMLElement | null>(null);
const contentRef = ref<HTMLElement | null>(null);
const facebookRef = ref<HTMLElement | null>(null);

const adjustLayout = () => {
  if (linksRef.value && contentRef.value && facebookRef.value) {
    const linksHeight = linksRef.value.clientHeight;
    const windowWidth = window.innerWidth - 6;

    contentRef.value.style.height = `${linksHeight.toString()}px`;
    facebookRef.value.style.maxWidth = `${windowWidth.toString()}px`;
  }
};

onMounted(async () => {
  await nextTick();
  adjustLayout();
});

const GoogleSearch = defineAsyncComponent(() => import('@/components/shared/GoogleSearchBar.vue'));
const TwitterRetrieval = defineAsyncComponent(() => import('@/components/TwitterRetrieval.vue'));
</script>

<template>
  <div id="Main">
    <div><img id="imgtitle" alt="Matt's College Sports" src="/images/logo.jpg" /><br /></div>
    <div id="content" ref="contentRef">
      <div id="Links" ref="linksRef">
        <RouterLink to="/season/football/2025"> 2025 Football </RouterLink><br />
        <br />
        <RouterLink to="/season/football/2024"> 2024 Football </RouterLink><br />
        <RouterLink to="/season/basketball/2024-25"> 2024-25 Men's Basketball </RouterLink><br />
        <br />
        <RouterLink to="/season/football/2023"> 2023 Football </RouterLink><br />
        <RouterLink to="/season/basketball/2023-24"> 2023-24 Men's Basketball </RouterLink><br />
        <br />
        <RouterLink to="/season/football/2022"> 2022 Football </RouterLink><br />
        <RouterLink to="/season/basketball/2022-23"> 2022-23 Men's Basketball </RouterLink><br />
        <br />
        <RouterLink to="/season/football/2021"> 2021 Football </RouterLink><br />
        <RouterLink to="/season/basketball/2021-22"> 2021-22 Men's Basketball </RouterLink><br />
        <br />
        <RouterLink to="/archive"> Archived Seasons </RouterLink>
        <p>
          Check out my
          <a href="http://mattsarzsports.blogspot.com/" target="_blank">blog</a>. Discussing college sports and how
          we're watching the games.
        </p>
      </div>
      <div id="Twitter">
        <a class="twitter-timeline" href="https://twitter.com/mattsarz" data-height="300"> Tweets by @mattsarz </a>
        <TwitterRetrieval />
      </div>
    </div>
    <iframe
      id="Facebook"
      ref="facebookRef"
      lazy="true"
      src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fmattsarzsports%2F&tabs&height=80&small_header=true&adapt_container_width=true&hide_cover=true&show_facepile=false&appId"
      height="80"
      style="border: none; overflow: hidden"
      scrolling="no"
      frameborder="0"
      allowfullscreen="true"
      allowtransparency="true"
      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" />
    <p>
      Got a question, complaint, comment or know a game not listed here?
      <a href="mailto:footballsked@gmail.com"> Send it here </a>
    </p>
    <GoogleSearch />
  </div>
</template>

<style scoped>
#imgtitle {
  max-width: 100%;
  padding-bottom: 5px;
}

#Links,
#Twitter {
  float: left;
  display: inline;
}

#Facebook {
  border: 0;
  overflow: hidden;
}

#Main {
  padding-top: 37px;
}

@media all and (min-width: 641px) {
  #Facebook {
    height: 80px;
    width: 450px;
  }

  #Links {
    width: 45%;
    min-height: 250px;
  }

  #Twitter {
    width: 55%;
  }
}

@media only screen and (max-width: 640px) {
  body {
    font-size: 0.85em;
  }

  #Facebook {
    height: 100px;
    width: 300px;
  }

  #Links {
    width: 100%;
    min-height: 250px;
  }

  #Twitter {
    width: 100%;
  }

  #Main {
    padding-top: 48px;
  }
}
</style>
