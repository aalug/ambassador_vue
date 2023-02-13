<template>
  <v-navigation-drawer
    expand-on-hover
    rail
    style="position: fixed;"
  >
    <v-list>
      <v-list-item
        prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg"
        :title="`${firstName} ${lastName}`"
        :subtitle="email"
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
                     style="color: var(--light-red);"
                     @click="userStore.handleLogout()"
        ></v-list-item>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import {useRouter} from 'vue-router'
import {useUserStore} from '@/store/users'

defineProps<{
  firstName: string,
  lastName: string,
  email: string
}>()

const userStore = useUserStore()

const router = useRouter()
const changeRoute = (path: string) => {
  router.push({name: path})
}

</script>

<style scoped>

</style>
