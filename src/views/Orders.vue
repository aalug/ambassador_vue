<template>
  <v-expansion-panels
    variant="popout"
    class="my-4"
  >
    <v-expansion-panel
      v-for="order in orders"
      :key="order.id"
      :title="`${order.firstName} ${order.lastName} ${order.total}`"
    >
      <v-expansion-panel-text>
        <v-table density="comfortable" hover>
          <thead class="t-head">
          <tr>
            <th>#</th>
            <th>Product Title</th>
            <th>Price</th>
            <th class="text-center">Quantity</th>
          </tr>
          </thead>
          <tbody>
          <tr
            v-for="item in order.orderItems"
            :key="item.id"
            class="row"
          >
            <td>{{ item.id }}</td>
            <td>{{ item.productTitle }}</td>
            <td>{{ item.price }}</td>
            <td class="text-center">{{ item.quantity }}</td>
          </tr>
          </tbody>
        </v-table>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue'
import axios from 'axios'
import {Order} from '@/types/order'

const orders = ref<Order[]>([])

onMounted(async () => {
  try {
    const {data} = await axios.get(
      `${import.meta.env.VITE_API_BASE}/admin/orders/`,
      {withCredentials: true}
    )
    orders.value = data
  } catch (e) {
    console.error(e)
  }
})


</script>
