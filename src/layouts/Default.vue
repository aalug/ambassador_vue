<template>
  <v-layout>
    <SideBar v-if="user != null"
             :firstName="user.firstName"
             :lastName="user.lastName"
             :email="user.email"
    />

    <AppBar :isUserLoggedIn="user != null"/>

    <div class="main-container">
      <v-main>
        <router-view/>
      </v-main>
    </div>
  </v-layout>
</template>

<script lang="ts" setup>
import {onMounted} from 'vue'
import {storeToRefs} from 'pinia'
import SideBar from '@/components/SideBar.vue'
import AppBar from '@/components/AppBar.vue'
import {useUserStore} from '@/store/users'

const userStore = useUserStore()

onMounted(() => {
  userStore.getUser()
})

const {user} = storeToRefs(userStore)

</script>

<style scoped>
.main-container {
  width: 70%;
  margin: 2rem auto;
}
</style>
