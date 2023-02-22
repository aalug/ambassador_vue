<template>
  <div v-if="loading">
    <PageLoadingProgress/>
  </div>
  <div v-else>
    <v-table hover>
      <thead>
      <tr>
        <th class="text-left">
          Link
        </th>
        <th class="text-left">
          Users
        </th>
        <th class="text-left">
          Revenue
        </th>
      </tr>
      </thead>
      <tbody>
      <tr
        v-for="link in links"
        :key="link.id"
      >
        <td><router-link :to="`/checkout/${link.code}`">{{ link.code }}</router-link></td>
        <td>{{ link.count }}</td>
        <td>{{ link.revenue }}</td>
      </tr>
      </tbody>
    </v-table>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue'
import axios from 'axios'
import {StatsLink} from '@/types/stats-link'
import PageLoadingProgress from '@/components/PageLoadingProgress.vue'

const links = ref<StatsLink[]>([])
const loading = ref<boolean>(false)

onMounted(async () => {
  loading.value = true
  try {
    const {data} = await axios.get<StatsLink[]>(
      `${import.meta.env.VITE_API_BASE}/ambassador/stats/`,
      {withCredentials: true}
    )
    links.value = data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})

</script>
