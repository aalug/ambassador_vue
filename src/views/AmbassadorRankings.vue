<template>
  <div v-if="loading">
    <PageLoadingProgress/>
  </div>
  <div v-else>
    <v-table hover>
      <thead>
      <tr>
        <th class="text-left">
          #
        </th>
        <th class="text-left">
          Name
        </th>
        <th class="text-left">
          Revenue
        </th>
      </tr>
      </thead>
      <tbody>
      <tr
        v-for="(value, name, index) in rankings"
        :key="index"
        :class="{
          gold: index === 0,
          silver: index === 1,
          bronze: index === 2
        }"
      >
        <td>{{ index + 1 }}</td>
        <td>{{ name }}
        <span v-if="index < 3">
          <v-icon v-if="index === 0" size="large">mdi-trophy</v-icon>
          <v-icon v-if="index === 1">mdi-trophy</v-icon>
          <v-icon v-if="index === 2" size="x-small">mdi-trophy</v-icon>
        </span>
        </td>
        <td>{{ value }}</td>
      </tr>
      </tbody>
    </v-table>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue'
import axios from 'axios'
import {Ranking} from '@/types/ranking'
import PageLoadingProgress from '@/components/PageLoadingProgress.vue'

const rankings = ref<Ranking[]>([])
const loading = ref<boolean>(false)

onMounted(async () => {
  loading.value = true
  try {
    const {data} = await axios.get<Ranking[]>(
      `${import.meta.env.VITE_API_BASE}/ambassador/rankings/`,
      {withCredentials: true}
    )
    rankings.value = data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})

</script>

<style scoped>
.gold {
  color: gold;
  font-weight: bold;
}

.silver {
  color: silver;
  font-weight: bold;
}

.bronze {
  color: #CD7F32;
  font-weight: bold;
}
</style>
