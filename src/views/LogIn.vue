<template>
  <v-card class="card">
    <v-form ref="form" @submit.prevent="handleSubmit()">
      <v-text-field
        v-model="email"
        label="Email"
        type="email"
        required
      ></v-text-field>

      <v-text-field
        v-model="password"
        label="Password"
        required
        :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
        :type="showPass ? 'text' : 'password'"
        hint="At least 6 characters"
        @click:append="showPass = !showPass"
      ></v-text-field>

      <div class="userTypeBox">
        <v-switch
          v-model="isAdmin"
          label="Login as administrator"
          color="indigo"
          hide-details
        ></v-switch>
      </div>

      <p class="errorMessage">{{ errorMessage }}</p>
      <div class="d-flex flex-column">
        <v-btn
          color="success"
          class="mt-4"
          type="submit"
          block
          :disabled="loading"
        >
          Login
        </v-btn>
      </div>
    </v-form>
    <v-progress-linear
      v-if="loading"
      indeterminate
      :height="5"
      style="position: absolute;"
    ></v-progress-linear>
  </v-card>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {storeToRefs} from 'pinia'
import {useUserStore} from '@/store/users'

const showPass = ref<boolean>(false)

const email = ref<string>('')
const password = ref<string>('')
const isAdmin = ref<boolean>(false)

const userStore = useUserStore()
const {loading, errorMessage} = storeToRefs(userStore)

const handleSubmit = async () => {
  /**
   * Handles submitting the login form. It sends `userType`
   * to inform what type of user is trying to log in - to which endpoint
   * should the request be made.
   */
  const userType = isAdmin.value ? 'admin' : 'ambassador'
  await userStore.handleLogin(email.value, password.value, userType)
}

</script>

<style scoped>
.card {
  width: 40%;
  margin: 5rem auto;
  padding: 2rem;
}
</style>
