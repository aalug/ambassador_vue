<template>
  <ConfirmDialog
    v-if="showConfirmationDialog"
    title="Are you sure"
    info="that you want the price to be 0?"
    :key="refreshDialog"
    @confirmed="handleDialogResponse"
  />

  <div class="text-right">
    <v-btn
      color="red"
      class="my-4"
      @click="clearTheForm()"
    >
      Clear
    </v-btn>
  </div>

  <v-form ref="form" @submit.prevent="handleSubmit()">
    <v-text-field
      v-model="title"
      label="Title"
      required
    ></v-text-field>
    <v-textarea
      v-model="description"
      label="Description"
      required
    ></v-textarea>
    <v-text-field
      v-model="image"
      label="Image"
      required
    ></v-text-field>
    <v-text-field
      v-model="price"
      label="Price"
      type="number"
      min="0"
      required
    ></v-text-field>
    <p class="errorMessage">{{ errorMessage }}</p>
    <div class="d-flex flex-column">
      <v-btn
        color="light-blue-lighten-1"
        class="mt-4"
        type="submit"
        block
      >
        Save
      </v-btn>
      <v-btn
        color="teal-lighten-3"
        class="mt-4"
        type="submit"
        @click="addAnother = true"
        block
      >
        Save and add another
      </v-btn>
    </div>
  </v-form>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue'
import {useRouter, useRoute} from 'vue-router'
import axios from 'axios'
import ConfirmDialog from '@/components/ConfirmDialog.vue'

const router = useRouter()

const errorMessage = ref<string>('')

const title = ref<string>('')
const description = ref<string>('')
const image = ref<string>('')
const price = ref<number>(0)

const showConfirmationDialog = ref<boolean>(false)
const continueWithPriceZero = ref<boolean>(false)

// It will change every time dialog answer is received. Because of the `key`
// in the ConfirmDialog component it will be refreshed every time this value changes.
const refreshDialog = ref<boolean>(false)

const addAnother = ref<boolean>(false)

const {params} = useRoute()
const id = params.productId
onMounted(async () => {
  /**
   * Checks the route and if it is for editing then fetches the data.
   */
  if (id) {
    try {
      const {data} = await axios.get(
        `${import.meta.env.VITE_API_BASE}/admin/products/${id}/`,
        {withCredentials: true}
      )
      title.value = data.title
      description.value = data.description
      image.value = data.image
      price.value = data.price
    } catch (e) {
      console.error(e)
    }
  }

})

const validateInput = () => {
  /**
   * Validate the data in the form and set the error message accordingly.
   */
  if (!title.value) return errorMessage.value = 'The title cannot be empty.'
  else if (!description.value) return errorMessage.value = 'The description cannot be empty.'
  else if (!image.value) return errorMessage.value = 'The image url cannot be empty.'
  return errorMessage.value = ''
}

const clearTheForm = () => {
  title.value = ''
  description.value = ''
  image.value = ''
  price.value = 0
}

const handleDialogResponse = (wasConfirmedClicked: boolean) => {
  /**
   * This function is called when dialog has received a response (emit).
   */
  if (wasConfirmedClicked) {
    continueWithPriceZero.value = wasConfirmedClicked
    handleSubmit()
  }
}

const handleSubmit = async () => {
  /**
   * Gets inputted data and makes a post request to the backend to
   * `/admin/products/` endpoint which will create and save the new product.
   */

  // function validateInput() return the error message, so if it returns falsy value
  // (empty string) that means that there is no error message and that the data is valid.
  if (validateInput()) return

  refreshDialog.value = !refreshDialog.value

  if (price.value == 0 && !continueWithPriceZero.value) {
    showConfirmationDialog.value = true
    return
  }
  const data = {
    title: title.value,
    description: description.value,
    image: image.value,
    price: price.value
  }
  // If `id` exists, that means that user is editing product - PUT.
  if (id) {
    await axios.put(
      `${import.meta.env.VITE_API_BASE}/admin/products/${id}/`,
      data,
      {withCredentials: true}
    )
  } else {
    // There is no `id` so we are creating a new product - POST.
    await axios.post(
      `${import.meta.env.VITE_API_BASE}/admin/products/`,
      data,
      {withCredentials: true}
    )
  }

  if (!addAnother.value) {
    await router.push({name: 'products'})
  } else {
    addAnother.value = false
    showConfirmationDialog.value = false
    clearTheForm()
  }
}

</script>
