<template>
  <div class="DONTPrint">
    <p>
      <RouterLink to="/copyright">Website Copyright</RouterLink>
    </p>
  </div>
</template>

<style scoped>
@media print {
  .DONTPrint {
    display: none;
  }
}
</style>
