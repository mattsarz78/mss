<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const showButton = ref(false);

const handleScroll = () => {
  showButton.value = window.scrollY > 200;
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <p>
    <a id="backToTopBtn" href="#" :class="{ show: showButton }" @click.prevent="scrollToTop">Back to top</a>
  </p>
</template>

<style scoped>
#backToTopBtn {
  display: none;
  position: fixed;
  bottom: 20px;
  right: 20px;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}

.show {
  display: block;
  opacity: 1;
}
</style>
