<script setup lang="ts">
import { useAppUtils } from '#composables/useAppUtils.mjs';
import { checkVersion } from '#utils/versionCheck.mjs';
import { onMounted, onUnmounted, ref } from 'vue';
import { RouterView } from 'vue-router';

const { isOnline } = useAppUtils();

const needsUpdate = ref(false);

const reload = () => window.location.reload();

onMounted(() => {
  const checkInterval = setInterval(async () => {
    needsUpdate.value = await checkVersion();
  }, 300000); // Check every 5 minutes

  onUnmounted(() => clearInterval(checkInterval));
});
</script>

<template>
  <div v-reset-adsense-height class="maincontainer">
    <div v-if="needsUpdate" class="update-banner">
      A new version is available.
      <button @click="reload()">Refresh</button>
    </div>
    <div v-if="!isOnline" class="offline-banner">You are currently offline</div>
    <RouterView />
  </div>
</template>

<style scoped>
.update-banner {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: #4caf50;
  color: white;
  padding: 1rem;
  text-align: center;
  z-index: 99999;
}
</style>
