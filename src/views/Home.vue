<template>
  <h1>HOME PAGE</h1><br>
  <h2 v-if="user != null">You are logged in as an
    <span v-if="user.isAmbassador">Ambassador</span>
    <span v-else>Administrator</span>
  </h2>
</template>

<script lang="ts" setup>
import {storeToRefs} from 'pinia'
import {useUserStore} from '@/store/users'

const userStore = useUserStore()
const {user} = storeToRefs(userStore)


</script>
