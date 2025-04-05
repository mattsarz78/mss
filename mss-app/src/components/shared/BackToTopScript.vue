<template>
  <div />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';

const scrollFunction = () => {
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    backToTopBtn?.classList.add('show');
  } else {
    backToTopBtn?.classList.remove('show');
  }
};

onMounted(() => {
  window.addEventListener('scroll', scrollFunction);
});

onUnmounted(() => {
  window.removeEventListener('scroll', scrollFunction);
});
</script>
