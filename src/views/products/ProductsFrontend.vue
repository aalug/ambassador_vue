<template>
  <AmbassadorRevenueCard/>

  <div class="filters">
    <v-layout>
      <v-text-field
        label="Search..."
        hide-details="auto"
        class="search"
        :loading="loading"
        v-model="search"
      ></v-text-field>

      <v-select
        clearable
        label="Sort by"
        :items="sortingOptions"
        v-model="sortBy"
        class="select"
      ></v-select>
    </v-layout>
  </div>

  <Products v-if="!loading" :products="filteredProducts"/>
</template>

<script setup lang="ts">
import {ref, onMounted, watch} from 'vue'
import axios from 'axios'
import Products from '@/components/Products.vue'
import AmbassadorRevenueCard from '@/components/AmbassadorRevenueCard.vue'
import {Product} from '@/types/product'

let allProducts: Product[] = []

const filteredProducts = ref<Product[]>([])
const loading = ref<boolean>(false)
const search = ref<string>('')

const sortBy = ref<string>('')

const sortingOptions = [
  'Price Ascending',
  'Price Descending',
  'Title Ascending',
  'Title Descending'
]

onMounted(async () => {
  loading.value = true
  try {
    const {data} = await axios.get<Product[]>(
      `${import.meta.env.VITE_API_BASE}/ambassador/products/frontend/`,
      {withCredentials: true}
    )
    filteredProducts.value = data
    allProducts = data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})

// if the search changes (user entered something to search input)
// filter products to ones that contain the given phrase
watch(search, () => {
  filteredProducts.value = allProducts.filter(product => {
      return product.title.toLowerCase().includes(search.value.toLowerCase()) ||
        product.description.toLowerCase().includes(search.value.toLowerCase())
    }
  )
})

// if the sortBy changes, sort by chosen option
watch(sortBy, () => {
  if (sortBy.value === 'Price Ascending' || sortBy.value === 'Price Descending') {
    filteredProducts.value.sort((a, b) => {
      const diff = a.price - b.price

      if (diff === 0) return 0

      // 1 or -1
      const sign = Math.abs(diff) / diff
      // if it is ascending - return base diff value, otherwise return the opposite value
      return sortBy.value === 'Price Ascending' ? sign : -sign
    })
  } else {
    filteredProducts.value.sort((a, b) => {
      const titleA = a.title.toLowerCase()
      const titleB = b.title.toLowerCase()

      if (titleA < titleB) {
        return sortBy.value === 'Title Ascending' ? -1 : 1;
      }
      if (titleA > titleB) {
        return sortBy.value === 'Title Ascending' ? 1 : -1;
      }
      // titles are the same
      return 0;
    })
  }
})

</script>

<style scoped>
.filters {
  width: 80%;
  margin: 8rem auto 0 auto;
}

.search {
  width: 70%;
  height: 100%;
  margin-right: 1rem;
}

.select {
  width: 30%;
  height: 100%;
}
</style>
