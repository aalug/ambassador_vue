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
import {useRouter} from 'vue-router'
import {storeToRefs} from 'pinia'
import {useUserStore} from '@/store/users'

const router = useRouter()

const showPass = ref<boolean>(false)

const email = ref<string>('')
const password = ref<string>('')

const userStore = useUserStore()
const {loading, errorMessage} = storeToRefs(userStore)

const handleSubmit = async () => {
  await userStore.handleLogin(email.value, password.value)
}

</script>

<style scoped>
.card {
  width: 40%;
  margin: 5rem auto;
  padding: 2rem;
}
</style>
