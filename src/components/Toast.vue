<template>
<v-snackbar
      :timeout="2000"
      color="deep-purple-accent-4"
      elevation="24"
    >
      <template v-slot:activator="{ props }">
        <v-btn color="deep-purple-accent-4" class="ma-2" v-bind="props">open</v-btn>
      </template>

      <strong>Your account has been created!</strong>
    </v-snackbar>
</template>

<script setup>

</script>

<style scoped>

</style>
