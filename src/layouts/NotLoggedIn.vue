<template>
  <v-layout>
    <AppBar :isUserLoggedIn="false" />

    <div class="main-container">
      <v-main>
        <router-view/>
      </v-main>
    </div>
  </v-layout>
</template>

<script lang="ts" setup>
import AppBar from '@/components/AppBar.vue'

</script>

<style scoped>
.main-container {
  width: 70%;
  margin: 2rem auto;
}
</style>
