<template>
  <div style="width: 60%; margin-bottom: 10rem; margin-top: 4rem;">
    <v-card class="card">
      <h2>Account Information</h2>
      <v-form ref="form" @submit.prevent="handleSubmitNewInfo">
        <v-text-field
          v-model="firstName"
          label="First Name"
        ></v-text-field>
        <v-text-field
          v-model="lastName"
          label="Last Name"
        ></v-text-field>
        <v-text-field
          v-model="email"
          label="Email"
          type="email"
        ></v-text-field>
        <p class="errorMessage">{{ errorMessage }}</p>
        <div class="d-flex flex-column">
          <v-btn
            color="light-blue-lighten-1"
            class="mt-4"
            type="submit"
            block
          >
            Save
          </v-btn>
        </div>
      </v-form>
    </v-card>
  </div>

  <hr>

  <div class="change-pass-container">
    <v-card class="card">
      <h2>Change the password</h2>
      <v-form ref="form" @submit.prevent="handleSubmitNewPassword">
        <v-text-field
          v-model="password"
          label="Password"
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
        <p class="errorMessage" v-if="errorMessage">{{ errorMessage }}</p>
        <div class="d-flex flex-column">
          <v-btn
            color="light-blue-lighten-1"
            class="mt-4"
            type="submit"
            block
          >
            Save
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
  </div>

</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue'
import axios from 'axios'
import {useUserStore} from "@/store/users";
import {storeToRefs} from "pinia";

const userStore = useUserStore()
const {errorMessage, loading, user} = storeToRefs(userStore)

const showPass = ref<boolean>(false)

const email = ref<string>('')
const firstName = ref<string>('')
const lastName = ref<string>('')

const password = ref<string>('')
const confirmPassword = ref<string>('')

onMounted(async () => {
  // @ts-ignore
  const userType = user.value.isAmbassador ? 'ambassador' : 'admin'
  try {
    const {data} = await axios.get(
      `${import.meta.env.VITE_API_BASE}/${userType}/user/`,
      {withCredentials: true}
    )
    email.value = data.email
    firstName.value = data.firstName
    lastName.value = data.lastName
  } catch (e) {
    console.error(e)
  }
})

const handleSubmitNewInfo = async () => {
  await userStore.handleChangeAccountInfo(
    email.value,
    firstName.value,
    lastName.value
  )
}

const handleSubmitNewPassword = async () => {
  await userStore.handleChangePassword(
    password.value,
    confirmPassword.value
  )
}

</script>

<style scoped>
.change-pass-container {
  width: 60%;
  margin: 10rem 0 auto auto;
}

.card {
  padding: 2rem;
}

hr {
  transform: rotate(-25deg);
}
</style>
