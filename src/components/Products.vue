<template>
  <v-container style="width: 90%; margin-top: 1rem;">
    <v-row>
      <v-col
        v-for="product in products"
        v-bind:key="product.id"
        cols="3"
        sm="12"
        md="6"
        lg="3"
      >
        <ProductCard
          :title="product.title"
          :description="product.description"
          :imageUrl="product.image"
          :price="product.price"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import {Product} from '@/types/product'
import ProductCard from '@/components/ProductCard.vue'

defineProps<{
  products: Product[]
}>()

</script>
