<template>
  <v-card
    class="mx-auto mt-5 product-card"
    max-width="344"
    :class="{'over-others': showDescription}"
  >
    <v-img
      :src="imageUrl"
      height="200px"
      cover
    >
      <template v-slot:placeholder>
        <v-row
          class="fill-height ma-0"
          align="center"
          justify="center"
        >
          <v-progress-circular
            indeterminate
            color="grey-lighter-5"
            size="large"
          ></v-progress-circular>
        </v-row>
      </template>
    </v-img>

    <v-card-title>
      {{ title }}
    </v-card-title>

    <v-card-subtitle :class="{transparent: showDescription}">
      {{ description }}
    </v-card-subtitle>

    <v-card-actions>
    <h4 class="ml-3">${{ price }}</h4>

      <v-btn
        :icon="showDescription ? 'mdi-chevron-up' : 'mdi-chevron-down'"
        @click="showDescription = !showDescription"
        style="margin-right: 0; margin-left: auto;"
      ></v-btn>
    </v-card-actions>


    <v-expand-transition>
      <div v-show="showDescription">
        <v-divider></v-divider>
        <v-card-text>
          {{ description }}
        </v-card-text>
      </div>
    </v-expand-transition>

  </v-card>
</template>

<script setup lang="ts">
import {ref} from 'vue'

const showDescription = ref<boolean>(false)

defineProps<{
  title: string,
  description: string,
  imageUrl: string,
  price: string
}>()

</script>

<style scoped>
.product-card {
  transition: all 0.2s ease-in-out;
}

.product-card:hover {
  transform: scale(1.05);
  box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.8);
}

.transparent {
  transition: opacity 0.2s ease;
  opacity: 0;
}

</style>
