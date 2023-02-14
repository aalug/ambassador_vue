<template>
  <v-table density="comfortable" hover>
    <thead class="t-head">
    <tr>
      <th class="text-left">
        #
      </th>
      <th class="text-left">
        Name
      </th>
      <th class="text-left">
        Email
      </th>
      <th class="text-right">
        Actions
      </th>
    </tr>
    </thead>
    <tbody>
    <tr
      v-for="user in users.slice((page - 1) * perPage, page*perPage)"
      :key="user.id"
      class="row"
    >
      <td>{{ user.id }}</td>
      <td>{{ `${user.firstName} ${user.lastName}` }}</td>
      <td>{{ user.email }}</td>
      <td class="text-right">
        <v-btn
          prepend-icon="mdi-eye"
          color="teal-darken-4"
          @click="goToUserLinks(user.id)"
        >
          View
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
import {useRouter} from 'vue-router'
import axios from 'axios'
import {User} from '@/types/user'

const router = useRouter()

const users = ref<User[]>([])
const page = ref<number>(1)
const perPage = ref<number>(10)
const lastPage = ref<number>(0)

onMounted(async () => {
  const {data} = await axios.get(`${import.meta.env.VITE_API_BASE}/admin/ambassadors/`, {withCredentials: true})
  users.value = data

  lastPage.value = Math.ceil(data.length / perPage.value)
})

const goToUserLinks = (userId: string) => {
  router.push({name: 'user-links', params: {userId: userId}})
}

</script>
