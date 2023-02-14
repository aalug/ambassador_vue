<template>
  <v-table density="default" hover>
    <thead class="t-head">
    <tr>
      <th class="text-left">
        #
      </th>
      <th class="text-left">
        Image
      </th>
      <th class="text-left">
        Title
      </th>
      <th class="text-center">
        Description
      </th>
      <th class="text-right">
        Price
      </th>
      <th class="text-right">
        Actions
      </th>
    </tr>
    </thead>
    <tbody>
    <tr
      v-for="product in products.slice((page - 1) * perPage, page*perPage)"
      :key="product.id"
      class="row"
    >
      <td>{{ product.id }}</td>
      <td>
        <v-img :src="product.image" max-height="80" max-width="120"/>
      </td>
      <td>{{ product.title }}</td>
      <td>{{ product.description }}</td>
      <td class="text-right">{{ product.price }}</td>
      <td class="text-right">
        <v-btn
          color="error"
          @click="deleteProduct(product.id)"
        >
          Delete
        </v-btn>
      </td>
    </tr>
    </tbody>
  </v-table>
  <div class="text-center">
    <v-pagination
      v-model="page"
      class="my-4"
      :length="lastPage"
    ></v-pagination>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue'
import axios from 'axios'
import {Product} from '@/types/product'

const products = ref<Product[]>([])
const page = ref<number>(1)
const perPage = ref<number>(10)
const lastPage = ref<number>(0)

onMounted(async () => {
  const {data} = await axios.get(
    `${import.meta.env.VITE_API_BASE}/admin/products/`,
    {withCredentials: true}
  )
  products.value = data
  lastPage.value = Math.ceil(data.length / perPage.value)
})

const deleteProduct = async (productId: number) => {
  if (confirm('Are you sure you want to delete this product?')) {
    await axios.delete(
      `${import.meta.env.VITE_API_BASE}/admin/products/${productId}/`,
      {withCredentials: true}
    )
    products.value = products.value.filter(p => p.id != productId)
  }
}

</script>
