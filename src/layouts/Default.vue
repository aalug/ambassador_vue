<template>
  <PageLoadingProgress v-if="loading"/>

  <v-layout v-else>
    <div v-if="user != null">
      <component
        :is="user.isAmbassador ? AmbassadorSideBar : AdminSideBar"
        :firstName="user.firstName"
        :lastName="user.lastName"
        :email="user.email"
      />
    </div>

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
import AdminSideBar from '@/components/bars/AdminSideBar.vue'
import AmbassadorSideBar from '@/components/bars/AmbassadorSideBar.vue'
import AppBar from '@/components/bars/AppBar.vue'
import PageLoadingProgress from '@/components/PageLoadingProgress.vue'
import {useUserStore} from '@/store/users'

const userStore = useUserStore()

const {loading} = storeToRefs(userStore)

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
