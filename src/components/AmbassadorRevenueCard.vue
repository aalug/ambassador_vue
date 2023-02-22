<template>
  <v-card
    class="mx-auto mt-7 card"
    variant="outlined"
  >
    <h1>{{ title }}</h1>
    <h2>{{ description }}</h2>
  </v-card>
</template>

<script setup lang="ts">
import {ref, watch} from 'vue'
import {storeToRefs} from 'pinia'
import {useUserStore} from '@/store/users'

const userStore = useUserStore()
const {user} = storeToRefs(userStore)

const title = ref<string>('')
const description = ref<string>('')

const setTitleAndDescription = () => {
  if (user.value) {
    title.value = `$ ${user.value.revenue}`
    description.value = 'You have earned this far.'
  } else {
    title.value = 'Welcome'
    description.value = 'Share links to earn money.'
  }
}
setTitleAndDescription()
watch(user, setTitleAndDescription)


</script>

<style scoped>
.card {
  padding: 3rem;
  width: 50%;
  text-align: center;
  background-color: #004D40;
}
</style>
