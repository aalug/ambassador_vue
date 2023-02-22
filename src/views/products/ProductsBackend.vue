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
        @keyup="searchData()"
      ></v-text-field>

      <v-select
        clearable
        label="Sort by"
        :items="Object.keys(sortingOptions)"
        v-model="sortBy"
        class="select"
      ></v-select>
    </v-layout>
  </div>

  <Products v-if="!loading" :products="products"/>

  <div class="d-flex justify-center mt-5 mb-6">
    <v-btn
      variant="plain"
      @click="page++"
    >
      Load more
    </v-btn>
  </div>

</template>

<script setup lang="ts">
import {ref, watch, onMounted} from 'vue'
import axios from 'axios'
import Products from '@/components/Products.vue'
import AmbassadorRevenueCard from '@/components/AmbassadorRevenueCard.vue'
import {Product} from '@/types/product'

const products = ref<Product[]>([])
const loading = ref<boolean>(false)

const page = ref<number>(1)
const search = ref<string>('')
const sortBy = ref<string>('')

type SortingOptions = {
  [key: string]: string
}

const sortingOptions: SortingOptions = {
  'Price Ascending': 'price-asc',
  'Price Descending': 'price-desc',
  'Title Ascending': 'title-asc',
  'Title Descending': 'title-desc'
}

const loadData = async () => {
  /**
   * Get data based on the value of the `search` and `page` number.
   * When it runs onMounted, it fetches data for page = 1 and
   * no value for search.
   * Every time, the page number is changed, the function runs and gets the data
   * for a different value of the page query parameter.
   */
  const queryParams: string[] = []

  if (search.value) {
    queryParams.push(
      `&search=${search.value.replace(/ /g, '&')}`
    )
  }
  if (sortBy.value) {
    queryParams.push(
      `&sort=${sortingOptions[sortBy.value]}`
    )
  }
  if (page.value) {
    queryParams.push(
      `&page=${page.value}`
    )
  }

  loading.value = true
  try {
    console.log(`${import.meta.env.VITE_API_BASE}/ambassador/products/backend?${queryParams.join('')}`,)
    const {data} = await axios.get(
      `${import.meta.env.VITE_API_BASE}/ambassador/products/backend?${queryParams.join('')}`,
      {withCredentials: true}
    )
    // Add new data to existing products. It's for the `load more` feature, so it doesn't
    // replace the old products with new ones but add new items from the next page to the
    // old ones.
    products.value = page.value === 1 ? data.data : [...products.value, ...data.data]
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const searchData = async () => {
  products.value = []
  page.value = 1
  await loadData()
}

watch(sortBy, async () => {
  await searchData()
})
watch(page, async () => await loadData())

onMounted(async () => await loadData())

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

