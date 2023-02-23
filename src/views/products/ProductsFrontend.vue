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

  <div
    class="d-flex justify-center mt-5 mb-6"
    v-if="page < lastPage"
  >
    <v-btn
      variant="plain"
      @click="page++"
    >
      Load more
    </v-btn>
  </div>

</template>

<script setup lang="ts">
import {ref, onMounted, watch} from 'vue'
import axios from 'axios'
import Products from '@/components/Products.vue'
import AmbassadorRevenueCard from '@/components/AmbassadorRevenueCard.vue'
import {Product} from '@/types/product'

let allProducts: Product[] = []
const perPage = 12

const filteredProducts = ref<Product[]>([])
const loading = ref<boolean>(false)

const page = ref<number>(1)
const search = ref<string>('')
const sortBy = ref<string>('')

const lastPage = ref<number>(0)

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
    filteredProducts.value = data.slice(0, page.value * perPage)
    allProducts = data
    lastPage.value = Math.ceil(allProducts.length / perPage)
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})

const sortProducts = () => {
  if (sortBy.value === 'Price Ascending' || sortBy.value === 'Price Descending') {
    filteredProducts.value = allProducts.sort((a, b) => {
      const diff = a.price - b.price

      if (diff === 0) return 0

      // 1 or -1
      const sign = Math.abs(diff) / diff
      // if it is ascending - return base diff value, otherwise return the opposite value
      return sortBy.value === 'Price Ascending' ? sign : -sign
    }).slice(0, page.value * perPage)
  } else {
    filteredProducts.value = allProducts.sort((a, b) => {
      const titleA = a.title.toLowerCase()
      const titleB = b.title.toLowerCase()

      if (titleA < titleB) {
        return sortBy.value === 'Title Ascending' ? -1 : 1
      }
      if (titleA > titleB) {
        return sortBy.value === 'Title Ascending' ? 1 : -1
      }
      // titles are the same
      return 0
    }).slice(0, page.value * perPage)
  }
}

let searchedProducts: Product[] = []
const handleSearch = () => {
  /**
   * filter products to ones that contain the given phrase
   */
  page.value = 1

  searchedProducts = allProducts.filter(product => {
      return product.title.toLowerCase().includes(search.value.toLowerCase()) ||
        product.description.toLowerCase().includes(search.value.toLowerCase())
    }
  )

  // set the lastPage value before slicing products into pages
  lastPage.value = Math.ceil(searchedProducts.length / perPage)

  // slice products after setting value of the lastPage
  filteredProducts.value = searchedProducts.slice(0, 12)
}
// if the search changes (user entered something to search input)
// filter products with handleSearch() function.
watch(search, () => handleSearch())

watch(page, () => {
  // load next 12 products
  // if there is search.value - user products already set by handleSearch()
  // otherwise, use allProducts
  const products = search.value ? searchedProducts : allProducts
  const next1Products = products.slice((page.value - 1) * perPage, page.value * perPage)
  filteredProducts.value = [
    ...filteredProducts.value, ...next1Products
  ]

  // sort products, so the newly added are also sorted the way they should be
  if (sortBy.value) sortProducts()
})

// if the sortBy changes, sort by chosen option
watch(sortBy, () => sortProducts())

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
