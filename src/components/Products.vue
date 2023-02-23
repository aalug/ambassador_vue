<template>
  <v-container style="width: 90%; margin-top: 1rem;">

    <div
      v-if="selectedProducts.length > 0"
      class="d-flex justify-space-between mb-3"
    >
      <h3>Number of selected products: {{ selectedProducts.length }}</h3>
      <v-btn
        size="large"
        color="blue-darken-1"
        @click="generate()"
      >
        Generate link
      </v-btn>
      <v-btn
        size="small"
        color="error"
        @click="removeAllSelectedProducts()"
      >
        Remove all selected products
      </v-btn>
    </div>

    <v-row>
      <v-col
        v-for="product in products"
        v-bind:key="product.id"
        @click="select(product.id)"
        cols="3"
        sm="12"
        md="6"
        lg="3"
      >
        <ProductCard
          :title="product.title"
          :description="product.description"
          :imageUrl="product.image"
          :price="product.price.toString()"
          :isSelected="selectedProducts.includes(product.id)"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue'
import axios from 'axios'
import {Product} from '@/types/product'
import ProductCard from '@/components/ProductCard.vue'

defineProps<{
  products: Product[]
}>()

const emit = defineEmits(['generateLink'])

const selectedProducts = ref<number[]>([])
const link = ref<string>('')

const select = (productId: number) => {
  if (!selectedProducts.value.includes(productId)) {
    selectedProducts.value.push(productId)
  } else {
    const index = selectedProducts.value.indexOf(productId)
    selectedProducts.value.splice(index, 1)
  }
  // update the local storage
  localStorage.setItem('selectedProducts', JSON.stringify(selectedProducts.value))
}

const removeAllSelectedProducts = () => {
  selectedProducts.value = []
  localStorage.setItem('selectedProducts', '')
}

const generate = async () => {
  /**
   * Send request to generate a link and then emit it.
   */
  try {
    // @ts-ignore
    const {data} = await axios.post(
      `${import.meta.env.VITE_API_BASE}/ambassador/links/`,
      {products: selectedProducts.value},
      {withCredentials: true}
    )
    link.value = `${import.meta.env.VITE_FRONTEND_BASE_URL}/${data.code}`
  } catch (e) {
    console.error(e)
  }
  emit('generateLink', link.value)
}

onMounted(() => {
  /**
   * Get the selectedProducts from the local storage
   */
  const selectedProductsFromStorage = localStorage.getItem('selectedProducts')

  if (selectedProductsFromStorage) {
    // If there is a value in local storage, parse it into an array of numbers
    selectedProducts.value = JSON.parse(selectedProductsFromStorage)
  }
})

</script>
