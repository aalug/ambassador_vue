<template>
  <div class="loading-container">
    <v-progress-circular
      indeterminate
      size="128"
      width="12"
    ></v-progress-circular>
  </div>
</template>

<script>

</script>

<style scoped>
.loading-container {
  position: fixed;
  top: 50%;
  left: 50%;
  margin-left: -30px;
  margin-top: -200px;
}
</style>
