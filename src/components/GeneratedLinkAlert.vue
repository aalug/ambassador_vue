<template>
  <v-alert
    color="cyan-darken-4"
    :text="generatedLink"
    closable
    style="width: 80%; margin: auto;"
  >
    <v-btn
      :icon="!clicked ? 'mdi-content-copy' : 'mdi-check'"
      variant="outlined"
      color="white"
      style="position: absolute; right: 5%; bottom: 10%"
      @click="copyLink()"
    >
    </v-btn>
  </v-alert>
</template>

<script setup lang="ts">
import {ref} from 'vue'

const props = defineProps<{
  generatedLink: string
}>()

const clicked = ref<boolean>(false)

const copyLink = () => {
  navigator.clipboard.writeText(props.generatedLink)
  clicked.value = true
}
</script>
