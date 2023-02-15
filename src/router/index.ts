// Composables
import {createRouter, createWebHistory} from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/Default.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/views/Home.vue'),
      },
      {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('@/views/DashBoard.vue'),
      },
      {
        path: '/users/:userId/links',
        name: 'user-links',
        component: () => import('@/views/UserLinks.vue'),
      },
      {
        path: '/products',
        name: 'products',
        component: () => import('@/views/products/Products.vue'),
      },
      {
        path: '/products/create',
        name: 'create-product',
        component: () => import('@/views/products/CreateProduct.vue'),
      },
    ],
  },
  {
    path: '/',
    component: () => import('@/layouts/NotLoggedIn.vue'),
    children: [
      {
        path: '/sign-up',
        name: 'sign-up',
        component: () => import('@/views/SignUp.vue'),
      },
      {
        path: '/login',
        name: 'login',
        component: () => import('@/views/LogIn.vue'),
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
