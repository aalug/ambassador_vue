<template>
  <PageLoadingProgress v-if="loading"/>
  <ConfirmDialog
    v-if="showConfirmationDialog"
    title="Are you sure"
    info="you want to delete this product?"
    :key="refreshDialog"
    @confirmed="handleDialogResponse"
  />
  <v-btn
    variant="outlined"
    prepend-icon="mdi-plus"
    color="blue-lighten-1"
    class="mb-5"
    @click="goToCreateProduct()"
  >
    Add
  </v-btn>

  <v-table
    style="table-layout:fixed; width:100%"
    density="default"
    hover>
    <colgroup>
      <col style="width:3%">
      <col style="width:5%">
      <col style="width:15%">
      <col style="width:67%">
      <col style="width:5%">
      <col style="width:5%">
    </colgroup>
    <thead class="t-head">
    <tr>
      <th>#</th>
      <th>Image</th>
      <th>Title</th>
      <th class="text-center">Description</th>
      <th>Price</th>
      <th class="text-center">Actions</th>
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
        <v-img :src="product.image" max-height="80" max-width="120">
          <template v-slot:placeholder>
            <v-row
              class="fill-height ma-0"
              align="center"
              justify="center"
            >
              <v-progress-circular
                indeterminate
                color="grey-lighter-5"
              ></v-progress-circular>
            </v-row>
          </template>
        </v-img>
      </td>
      <td>{{ product.title }}</td>
      <td>{{ product.description }}</td>
      <td>{{ product.price }}</td>
      <td class="center">
        <div class="d-flex align-center flex-column flex-md-row fill-height">
          <v-btn
            color="light-blue-accent-3"
            variant="flat"
            icon="mdi-pencil"
            size="small"
            class="mr-2"
            @click="goToEditProduct(product.id)"
          ></v-btn>
          <v-btn
            color="red"
            variant="flat"
            icon="mdi-delete"
            size="small"
            @click="startDeletingProcess(product.id)"
          ></v-btn>
        </div>
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
import {Product} from '@/types/product'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import PageLoadingProgress from '@/components/PageLoadingProgress.vue'

const products = ref<Product[]>([])
const productId = ref<number>(0)
const page = ref<number>(1)
const perPage = ref<number>(10)
const lastPage = ref<number>(0)

const loading = ref<boolean>(false)

const showConfirmationDialog = ref<boolean>(false)

// It will change every time dialog answer is received. Because of the `key`
// in the ConfirmDialog component it will be refreshed every time this value changes.
const refreshDialog = ref<boolean>(false)

const router = useRouter()

onMounted(async () => {
  /**
   * Gets all products.
   */
  loading.value = true
  try {
    const {data} = await axios.get(
      `${import.meta.env.VITE_API_BASE}/admin/products/`,
      {withCredentials: true}
    )
    products.value = data
    lastPage.value = Math.ceil(data.length / perPage.value)
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})

const startDeletingProcess = (id: number) => {
  /**
   * Start deleting process. After the `delete` button is clicked, this function
   * will be called, and it will:
   * 1. Refresh the dialog component
   * 2. Display the confirmation dialog
   * 3. Set the productId value to the id of the product that the `delete` button was clicked.
   */
  refreshDialog.value = !refreshDialog.value
  showConfirmationDialog.value = true
  productId.value = id
}

const handleDialogResponse = (wasConfirmedClicked: boolean) => {
  /**
   * This function is called when dialog has received a response (emit).
   * If the response is `OK` then it will proceed and delete the product.
   */
  if (wasConfirmedClicked) {
    deleteProduct(productId.value)
  }
}


const deleteProduct = async (productId: number) => {
  loading.value = true
  try {
    await axios.delete(
      `${import.meta.env.VITE_API_BASE}/admin/products/${productId}/`,
      {withCredentials: true}
    )
    products.value = products.value.filter(p => p.id != productId)
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const goToCreateProduct = () => {
  router.push({name: 'create-product'})
}

const goToEditProduct = (productId: number) => {
  router.push({name: 'edit-product', params: {productId: productId}})
}

</script>
