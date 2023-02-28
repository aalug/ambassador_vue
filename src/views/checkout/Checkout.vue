<template>
  <PageLoadingProgress v-if="loading"/>
  <v-container v-else>
    <v-card color="green-darken-1" style="width: 50%; margin: auto;">
      <h1 class="text-center">Welcome</h1>
      <h3 v-if="user" class="text-center">
        {{ user.firstName }} {{ user.lastName }}
        <span class="font-weight-regular">has invited you to buy these products.</span>
      </h3>
    </v-card>
    <v-row>
      <v-col
        cols="12"
        md="8"
      >
        <v-form @submit.prevent="submit">
          <v-container class="mt-10">
            <h2 class="mb-6">Personal info</h2>
            <v-row>
              <v-col
                cols="12"
                md="6"
              >
                <v-text-field
                  v-model="userDetails.firstName"
                  :rules="[v => v.length > 0 || 'This field is required.']"
                  label="First name"
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                md="6"
              >
                <v-text-field
                  v-model="userDetails.lastName"
                  :rules="[v => v.length > 0 || 'This field is required.']"
                  label="Last name"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                cols="12"
                md="12"
              >
                <v-text-field
                  v-model="userDetails.email"
                  :rules="[
                    v => v.length > 0 || 'This field is required.',
                    v => validateEmail(v) || 'E-mail is invalid.'
                    ]"
                  label="E-mail"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                cols="12"
                md="12"
              >
                <v-text-field
                  v-model="userDetails.address"
                  :rules="[v => v.length > 0 || 'This field is required.']"
                  label="Address"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col
                cols="12"
                md="5"
              >
                <v-text-field
                  v-model="userDetails.country"
                  :rules="[v => v.length > 0 || 'This field is required.']"
                  label="Country"
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                md="5"
              >
                <v-text-field
                  v-model="userDetails.city"
                  :rules="[v => v.length > 0 || 'This field is required.']"
                  label="City"
                  required
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                md="2"
              >
                <v-text-field
                  v-model="userDetails.zipCode"
                  :rules="[v => (v.length < 9 && v.length > 3) || 'The value must be between 4 and 8 characters.']"
                  label="Zip Code"
                ></v-text-field>
              </v-col>
            </v-row>

            <p v-if="errorMessage" class="errorMessage">{{ errorMessage }}</p>

            <v-btn
              class="me-4 mt-5"
              type="submit"
              color="blue"
              block
            >
              Checkout
            </v-btn>
          </v-container>
        </v-form>
      </v-col>
      <v-col
        cols="12"
        md="4"
      >
        <v-container class="mt-10">
          <h2 class="mb-6">Products</h2>
          <v-list density="comfortable" class="px-1 py-4">

            <v-list-item
              v-for="(product, index) in products"
              :key="product.id"
              :style="index % 2 === 1 ? 'background-color: #2a2a2a;': ''"
            >
              <v-list-item-title class="d-flex justify-space-between">
                {{ product.title }} <span>${{ product.price }}</span>
              </v-list-item-title>

              <v-list-item-subtitle style="width: 85%">
                {{ product.description }} {{ product.price }}
              </v-list-item-subtitle>

              <v-list-item-action>
                <v-text-field
                  v-model="quantities[product.id]"
                  :rules="[
                    v => Number.isInteger(Number(v)) || 'The value must be an integer',
                    v => v > 0 || 'The quantity must be at least 1.'
                    ]"
                  label="Quantity"
                  type="number"
                  min="0"
                ></v-text-field>
              </v-list-item-action>

            </v-list-item>

          </v-list>
          <v-divider></v-divider>
          <v-list>
            <v-list-item>
              <v-list-item-title class="d-flex justify-space-between">
                <h3>TOTAL</h3>
                <h2>${{ total.toFixed(2) }}</h2>
              </v-list-item-title>
            </v-list-item>
          </v-list>
          <p v-if="quantityErrorMessage" class="errorMessage">{{ quantityErrorMessage }}</p>
        </v-container>
      </v-col>
    </v-row>
  </v-container>

</template>

<script setup lang="ts">
import {ref, reactive, computed, onMounted} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import axios from 'axios'
import PageLoadingProgress from '@/components/PageLoadingProgress.vue'
import {User} from '@/types/user'
import {Product} from '@/types/product'

const loading = ref<boolean>(false)
const user = ref<User | null>(null)
const products = ref<Product[]>([])
const quantities = ref<number[]>([])
const errorMessage = ref<string>('')
const quantityErrorMessage = ref<string>('')

const userDetails = reactive({
  firstName: '',
  lastName: '',
  email: '',
  address: '',
  country: '',
  city: '',
  zipCode: ''
})

const {params} = useRoute()
const router = useRouter()

const total = computed<number>(() => {
  return products.value.reduce((s, p) => {
    return s + p.price * quantities.value[p.id]
  }, 0)
})

const validateInputs = () => {
  /**
   * Check if all the personal info inputs are valid, and
   * if the quantity fields are equal to at least 1.
   */
  let valid = true
  for (const v of quantities.value) {
    if (v < 1) {
      quantityErrorMessage.value = 'Quantity must be at least 1.'
      valid = false
    }
  }
  if (valid) quantityErrorMessage.value = ''

  for (const value of Object.values(userDetails)) {
    if (!value) {
      errorMessage.value = 'All fields are required.'
      return valid = false
    }
  }
  errorMessage.value = ''
  return valid
}

const submit = async () => {
  /**
   * Handle submit of the form.
   */
  if (!validateInputs()) return

  loading.value = true
  try {
    await axios.post(
      `${import.meta.env.VITE_API_BASE}/checkout/orders/`,
      {
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        email: userDetails.email,
        address: userDetails.address,
        country: userDetails.country,
        city: userDetails.city,
        zipCode: userDetails.zipCode,
        code: params.code,
        products: products.value.map(p => ({
          productId: p.id,
          quantity: quantities.value[p.id]
        }))
      }
    )
    await router.push({name: 'checkout-success'})
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
}

onMounted(async () => {
  /**
   * Get the link for the giver parameter in the route.
   */
  loading.value = true
  try {
    const {data} = await axios.get(
      `${import.meta.env.VITE_API_BASE}/checkout/links/${params.code}/`
    )
    user.value = data.user
    products.value = data.products
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
    products.value.forEach(p => {
      quantities.value[p.id] = 0
    })
  }
})

</script>
