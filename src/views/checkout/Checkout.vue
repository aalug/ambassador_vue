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
                  :error-messages="errorMessages.firstName"
                  label="First name"
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                md="6"
              >
                <v-text-field
                  v-model="userDetails.lastName"
                  error-messages="error message"
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
                  label="Country"
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                md="5"
              >
                <v-text-field
                  v-model="userDetails.city"
                  label="City"
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                md="2"
              >
                <v-text-field
                  v-model="userDetails.zip"
                  label="Zip"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-btn
              class="me-4"
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
                  :rules="[v => Number.isInteger(Number(v)) || 'The value must be an integer']"
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

        </v-container>
      </v-col>
    </v-row>

  </v-container>

</template>

<script setup lang="ts">
import {ref, reactive, computed, onMounted} from 'vue'
import {useRoute} from 'vue-router'
import axios from 'axios'
import PageLoadingProgress from '@/components/PageLoadingProgress.vue'
import {User} from '@/types/user'
import {Product} from '@/types/product'

type errorMessage = { [key: number]: string }

const loading = ref<boolean>(false)
const user = ref<User | null>(null)
const products = ref<Product[]>([])
const quantities = ref<number[]>([])
const errorMessages = ref<errorMessage[]>([])

const userDetails = reactive({
  firstName: '',
  lastName: '',
  email: '',
  address: '',
  country: '',
  city: '',
  zip: ''
})

const {params} = useRoute()

const total = computed<number>(() => {
  return products.value.reduce((s, p) => {
    return s + p.price * quantities.value[p.id]
  }, 0)
})

const submit = () => {

}

onMounted(async () => {
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
