<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { addMetaTags } from '@/utils/metaTags';
import Copyright from '@/components/shared/CopyrightLink.vue';
import AdsByGoogle from '@/components/shared/AdsByGoogle.vue';

const title = 'Copyright and Disclaimer';

addMetaTags(title);
</script>

<template>
  <div id="Main" v-reset-adsense-height>
    <div id="content">
      <div id="Links"><RouterLink to="/"> Home </RouterLink><br /></div>
      <div>
        <p>Copyright © 2005 MattSarzSports.com</p>
        <p>
          <strong>Credit</strong>
        </p>
        <p>
          This document was created using a Contractology template available at
          <a href="http://www.freenetlaw.com"> FreeNetLaw.com. </a>
        </p>
        <p>
          <strong>Ownership of copyright</strong>
        </p>
        <p>
          The copyright in this website and the material on this website (including without limitation the text,
          computer code, artwork, photographs, images, music, audio material, video material and audio-visual material
          on this website) is owned by MattSarzSports.com.
        </p>
        <p>
          <strong>Copyright license</strong>
        </p>
        <p>MattSarzSports.com grants to you a worldwide non-exclusive royalty-free revocable license to:</p>
        <ul>
          <li>view this website and the material on this website on a computer or mobile device via a web browser;</li>
          <li>copy and store this website and the material on this website in your web browser cache memory; and</li>
          <li>print pages from this website for your own personal and non-commercial use.</li>
        </ul>
        <p>
          MattSarzSports.com does not grant you any other rights in relation to this website or the material on this
          website. In other words, all other rights are reserved.
        </p>
        <p>
          For the avoidance of doubt, you must not adapt, edit, change, transform, publish, republish, distribute,
          redistribute, broadcast, rebroadcast or show or play in public this website or the material on this website
          (in any form or media) without MattSarzSports.com's prior written permission.
        </p>
        <p>
          <strong>Data mining</strong>
        </p>
        <p>The automated and/or systematic collection of data from this website is prohibited.</p>
        <p>
          <strong>Permissions</strong>
        </p>
        <p>
          You may request permission to use the copyright materials on this website by writing to
          <a href="mailto:footballsked@gmail.com">footballsked@@gmail.com</a>.
        </p>
        <p>
          <strong>Enforcement of copyright</strong>
        </p>
        <p>
          MattSarzSports.com takes the protection of its copyright very seriously. If MattSarzSports.com discovers that
          you have used its copyright materials in contravention of the license above, MattSarzSports.com may bring
          legal proceedings against you seeking monetary damages and an injunction to stop you using those materials.
          You could also be ordered to pay legal costs. If you become aware of any use of MattSarzSports.com's copyright
          materials that contravenes or may contravene the license above, please report this by email to
          <a href="mailto:footballsked@gmail.com">footballsked@@gmail.com</a>.
        </p>
        <p>
          <strong>Infringing material</strong>
        </p>
        <p>
          If you become aware of any material on the website that you believe infringes your or any other person's
          copyright, please report this by email to
          <a href="mailto:footballsked@gmail.com">footballsked@@gmail.com</a>.
        </p>
      </div>
    </div>
    <AdsByGoogle />
  </div>
  <Copyright />
</template>

<style scoped>
#Main {
  padding-top: 37px;
}

@media only screen and (max-width: 640px) {
  #Main {
    padding-top: 48px;
  }
}
</style>
