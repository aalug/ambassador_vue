<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="pa-6" color="green-darken-2">
          <v-card-title class="text-center">
            <h1>Payment Successful</h1>
          </v-card-title>
          <v-card-text class="text-center">
            <p>Thank you for your payment. Your transaction has been processed successfully.</p>
          </v-card-text>
          <div class="d-flex justify-center mt-10">
            <v-btn
              rounded="pill"
              color="blue"
              @click="goHome()"
            >
              Back to Home
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import {useRouter} from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push({name: 'home'})
}

</script>
