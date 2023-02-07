<template>
  <v-navigation-drawer
    expand-on-hover
    rail
  >
    <v-list>
      <v-list-item
        prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg"
        :title="username"
        :subtitle="userEmail"
      ></v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list density="compact" nav>
      <v-list-item prepend-icon="mdi-home"
                   title="Home"
                   value="home"
                   @click="changeRoute('home')"
      ></v-list-item>
      <v-list-item prepend-icon="mdi-account"
                   title="Dashboard"
                   value="dashboard"
                   @click="changeRoute('dashboard')"
      ></v-list-item>
    </v-list>
    <template v-slot:append>
      <div class="pa-2">
        <v-list-item prepend-icon="mdi-logout"
                     title="Logout"
                     value="logout"
                     @click="changeRoute('dashboard')"
        ></v-list-item>
      </div>
    </template>

  </v-navigation-drawer>
</template>

<script setup lang="ts">
import {useRouter} from 'vue-router'

defineProps<{
  username: string,
  userEmail: string,
}>()

const router = useRouter()

const changeRoute = (path: string) => {
  router.push({name: path})
}

</script>

<style scoped>

</style>
