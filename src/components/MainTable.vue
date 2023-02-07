<template>
  <v-table density="compact" hover>
    <thead class="t-head">
      <tr>
        <th class="text-left">
          Name
        </th>
        <th class="text-left">
          Calories
        </th>
        <th class="text-left">
          Calories
        </th>
        <th class="text-left">
          Calories
        </th>
        <th class="text-left">
          Calories
        </th>
        <th class="text-left">
          Calories
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="item in 10"
        :key="item"
        @click="changeRoute(item)"
        class="row"
      >
        <td>some text</td>
        <td>some text</td>
        <td>some text</td>
        <td>some text</td>
        <td>some text</td>
        <td>some text</td>
      </tr>
    </tbody>
  </v-table>
</template>

<script setup lang="ts">
import {useRouter} from 'vue-router'

const router = useRouter()
const changeRoute = (path: string | number) => {
  router.push(path.toString())
}

</script>

<style scoped>
.row:hover {
  cursor: pointer;
}
.t-head {
  background-color: #1a1a1a;
}

</style>
