<template>
  <p>
    <a
      id="backToTopBtn"
      href="#"
    >Back to top</a>
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

#backToTopBtn.show {
  display: block;
  opacity: 1;
}
</style>
