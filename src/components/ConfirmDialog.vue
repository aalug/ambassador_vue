<template>
  <v-dialog
    v-model="dialog"
    persistent
    width="auto"
  >
    <v-card class="pa-2">
      <v-card-title class="text-h5 text-center">
        {{ title }}
      </v-card-title>
      <v-card-text>{{ info }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="red-darken-1"
          variant="text"
          @click="emitSelectOption(false)"
        >
          Cancel
        </v-btn>
        <v-btn
          color="green-darken-1"
          variant="text"
          @click="emitSelectOption(true)"
        >
          Ok
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import {ref} from 'vue'

defineProps<{
  title: string,
  info: string
}>()

const emit = defineEmits(['confirmed'])

const emitSelectOption = (confirmedClicked: boolean) => {
  dialog.value = false
  emit('confirmed', confirmedClicked)
}

const dialog = ref<boolean>(true)

</script>
