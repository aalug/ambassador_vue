<template>
  <v-app-bar>
    <v-app-bar-title
      @click="changeRoute('home')"
      class="bar-title"
    >
      Ambassador app
    </v-app-bar-title>
    <div class="d-flex align-center">
      <div v-if="isUserAmbassador">
        <v-btn
          variant="flat"
          color="cyan-darken-3"
        >
          Frontend
        </v-btn>
        <v-btn
          variant="flat"
          color="brown-darken-3"
          class="mr-6 ml-2"
        >
          Backend
        </v-btn>
      </div>
      <v-text-field label="Search..." class="mt-5 mr-7" style="width: 300px;"/>
    </div>
    <div v-if="!isUserLoggedIn">
      <v-btn
        variant="outlined"
        color="blue-lighten-1"
        @click="changeRoute('login')"
      >
        <v-icon left size="large" color="blue-lighten-1">
          mdi-login
        </v-icon>&nbsp;
        Login
      </v-btn>
      <v-btn
        variant="outlined"
        color="green-lighten-1"
        class="mx-3"
        @click="changeRoute('sign-up')"
      >
        <v-icon left size="large" color="green-lighten-1">
          mdi-account-plus
        </v-icon>&nbsp;
        Register
      </v-btn>
    </div>

  </v-app-bar>
</template>

<script setup lang="ts">
import {useRouter} from 'vue-router'

defineProps<{
  isUserLoggedIn: boolean,
  isUserAmbassador: boolean
}>()

const router = useRouter()
const changeRoute = (pathName: string) => {
  router.push({name: pathName})
}
</script>

<style scoped>
.bar-title:hover {
  cursor: pointer;
  color: #46ee9a;
}
</style>
