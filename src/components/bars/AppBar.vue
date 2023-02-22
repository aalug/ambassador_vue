<template>
  <v-app-bar>
    <v-app-bar-title
      @click="changeRoute('home')"
      class="bar-title"
    >
      Ambassador app
    </v-app-bar-title>
    <div class="d-flex align-center">
      <div v-if="isUserAmbassador && (inProductsFrontend || inProductsBackend)">
        <v-btn
          variant="flat"
          color="var(--dark-cyan)"
          :class="{active: inProductsFrontend}"
          @click="changeRoute('products-frontend')"
        >
          Frontend
        </v-btn>
        <v-btn
          variant="flat"
          color="var(--dark-cyan)"
          class="mr-6 ml-2"
          :class="{active: inProductsBackend}"
          @click="changeRoute('products-backend')"
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
import {ref, watch} from 'vue'
import {useRouter, useRoute} from 'vue-router'

defineProps<{
  isUserLoggedIn: boolean,
  isUserAmbassador: boolean
}>()

const route = useRoute()
const router = useRouter()
const changeRoute = (pathName: string) => {
  router.push({name: pathName})
}

const inProductsFrontend = ref<boolean>(route.path.includes('/products-frontend'))
const inProductsBackend = ref<boolean>(route.path.includes('/products-backend'))

watch(route, () => {
  inProductsFrontend.value = route.path.includes('/products-frontend')
  inProductsBackend.value = route.path.includes('/products-backend')
})

</script>

<style scoped>
.bar-title:hover {
  cursor: pointer;
  color: #46ee9a;
}

.active {
  background-color: #199393 !important;
}
</style>
