<script setup lang="ts">
import AdsByGoogle from '@/components/shared/AdsByGoogle.vue';
import Copyright from '@/components/shared/CopyrightLink.vue';
import { addMetaTags } from '@/utils/metaTags';
import { RouterLink } from 'vue-router';

const title = "Matt's College Sports on TV";

addMetaTags(title);
</script>

<template>
  <div id="Main" v-reset-adsense-height>
    <div><img id="imgtitle" loading="lazy" alt="Matt's College Sports" src="/images/logo.jpg" /><br /></div>
    <div id="content">
      <div id="Links">
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
        <a
          class="twitter-timeline"
          href="https://twitter.com/mattsarz?ref_src=twsrc%5Etfw"
          data-height="300"
          data-tweet-limit="5"
          >Tweets by mattsarz</a
        >
        <component :is="'script'" async src="https://platform.twitter.com/widgets.js" charset="utf-8" />
      </div>
    </div>
    <iframe
      id="Facebook"
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
    <AdsByGoogle />
  </div>
  <Copyright />
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
  }

  #Links,
  #content {
    height: 330px;
  }

  #Twitter {
    width: 55%;
  }
}

@media only screen and (max-width: 640px) {
  #Facebook {
    height: 100px;
    width: 300px;
  }

  #Links {
    width: 100%;
  }

  #Links,
  #content {
    height: 280px;
  }

  #Twitter {
    width: 100%;
  }

  #Main {
    padding-top: 48px;
  }
}
</style>
