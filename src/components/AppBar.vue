<template>
  <v-app-bar title="Application bar">
    <div class="d-flex align-center">
      <v-text-field label="Search..." class="mt-5 mr-4" style="width: 300px;"/>
    </div>
    <div v-if="!isUserLoggedIn">
      <v-btn
        variant="outlined"
        color="blue-lighten-1"
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

defineProps<{
  isUserLoggedIn: boolean
}>()
</script>
