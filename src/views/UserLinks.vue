<template>
  <v-table density="comfortable" hover>
    <thead class="t-head">
    <tr>
      <th class="text-left">#</th>
      <th class="text-left">Code</th>
      <th class="text-left">Count</th>
      <th class="text-center">Revenue</th>
    </tr>
    </thead>
    <tbody v-if="links.length > 0">
    <tr
      v-for="link in links"
      :key="link.id"
      class="row"
    >
      <td>{{ link.id }}</td>
      <td>{{ link.code }}</td>
      <td>{{ link.orders.length }}</td>
      <td class="text-center">{{ link.orders.reduce((s, o) => s + o.total, 0) }}</td>
    </tr>
    </tbody>
  </v-table>
  <div v-if="links.length === 0" class="text-center mt-7">
    <h3>No links for this user</h3>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue'
import {useRoute} from 'vue-router'
import axios from 'axios'
import {Link} from '@/types/link'

const links = ref<Link[]>([])

const {params} = useRoute()

onMounted(async () => {
  const {data} = await axios.get(
    `${import.meta.env.VITE_API_BASE}/admin/users/${params.userId}/links/`,
    {withCredentials: true}
  )
  links.value = data
})

</script>
