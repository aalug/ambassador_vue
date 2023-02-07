<template>
  <v-layout>
    <SideBar v-if="isUserLoggedIn"
             userEmail="user@example.com"
             username="Adam"/>

    <AppBar :is-user-logged-in=isUserLoggedIn />

    <div class="main-container">
      <v-main>
        <router-view/>
      </v-main>
    </div>
  </v-layout>
</template>

<script lang="ts" setup>
import SideBar from '@/components/SideBar.vue'
import AppBar from '@/components/AppBar.vue'

const isUserLoggedIn = true // for the time being, later will be replaced with user store

</script>

<style scoped>
.main-container {
  width: 70%;
  margin: 2rem auto;
}
</style>
