<template>
  <v-card class="card">
    <v-form ref="form" @submit.prevent="handleSubmit">
      <v-text-field
        v-model="email"
        label="Email"
        type="email"
        required
      ></v-text-field>
      <v-text-field
        v-model="firstName"
        label="First Name"
        required
      ></v-text-field>
      <v-text-field
        v-model="lastName"
        label="Last Name"
        required
      ></v-text-field>

      <v-text-field
        v-model="password"
        label="Password"
        required
        :type="showPass ? 'text' : 'password'"
        hint="At least 6 characters"
      ></v-text-field>
      <v-text-field
        v-model="confirmPassword"
        label="Confirm Password"
        required
        :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
        :type="showPass ? 'text' : 'password'"
        hint="At least 6 characters"
        @click:append="showPass = !showPass"
      ></v-text-field>

      <v-radio-group
        v-model="userType"
        column
      >
        <v-radio
          label="Ambassador"
          value="ambassador"
        ></v-radio>
        <v-radio
          label="Administrator"
          value="admin"
        ></v-radio>
      </v-radio-group>

      <p class="errorMessage" v-if="errorMessage">{{ errorMessage }}</p>
      <div class="d-flex flex-column">
        <v-btn
          color="success"
          class="mt-4"
          type="submit"
          block
          :disabled="loading"
        >
          Submit
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
import {ref, watch} from 'vue'
import {useUserStore} from '@/store/users'
import {storeToRefs} from 'pinia'

const userStore = useUserStore()
const {errorMessage, loading} = storeToRefs(userStore)

const showPass = ref<boolean>(false)

const email = ref<string>('')
const password = ref<string>('')
const confirmPassword = ref<string>('')
const firstName = ref<string>('')
const lastName = ref<string>('')
const userType = ref<string>('ambassador')
let isAmbassador = true

watch(userType, () => {
  isAmbassador = userType.value === 'ambassador'
})

const handleSubmit = async (e: MouseEvent) => {
  await userStore.handleSignUp(
    firstName.value,
    lastName.value,
    email.value,
    password.value,
    confirmPassword.value,
    isAmbassador
  )
}

</script>

<style scoped>
.card {
  width: 40%;
  margin: 5rem auto;
  padding: 2rem;
}
</style>

