import {ref} from 'vue'
import {useRouter} from 'vue-router'
import {defineStore} from 'pinia'
import axios from 'axios'
import {User} from '@/types/user'

export const useUserStore = defineStore('users', () => {
  const user = ref<User | null>(null)
  const errorMessage = ref<string>('')
  const loading = ref<boolean>(false)

  const router = useRouter()

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
  };

  const handleSignUp = async (firstName: string, lastName: string,
                              email: string,
                              password: string, confirmPassword: string) => {

    if (!validateEmail(email)) {
      return errorMessage.value = 'Email is invalid.'
    }

    if (!firstName) {
      return errorMessage.value = 'First name is required.'
    }
    if (!lastName) {
      return errorMessage.value = 'Last name is required.'
    }

    if (password != confirmPassword) {
      return errorMessage.value = 'Passwords do not match.'
    }
    if (password.length < 6) {
      return errorMessage.value = 'Password must be at least 6 characters.'
    }

    errorMessage.value = ''

    loading.value = true
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE}/admin/register/`, {
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password,
        confirm_password: confirmPassword
      })
      errorMessage.value = ''
      await router.push({name: 'login'})
    } catch (e) {
      errorMessage.value = 'Error occurred while registering.'
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  const handleLogin = async (email: string, password: string) => {
    loading.value = true
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE}/admin/login/`, {
        email: email,
        password: password
      }, {withCredentials: true})
      errorMessage.value = ''
      await router.push({name: 'home'})
    } catch (e) {
      console.error(e)
      // @ts-ignore
      if (e.response.status === 401) {
        errorMessage.value = 'Incorrect credentials. Please try again.';
      } else {
        errorMessage.value = 'Login failed. Please try again.'
      }
    } finally {
      loading.value = false
    }
  }

  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE}/admin/logout/`,
        null,
        {withCredentials: true}
      )
      user.value = null
      await router.push({name: 'login'})
    } catch (e) {
      console.error(e)
    }
  }

  const getUser = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE}/admin/user/`, {withCredentials: true})
      if (response.data) {
        user.value = {
          id: response.data.id,
          email: response.data.email,
          firstName: response.data.first_name,
          lastName: response.data.last_name,
          isAmbassador: response.data.is_ambassador
        }
      } else {
        return user.value = null
      }
    } catch (e) {
      user.value = null
      await useRouter().push({name: 'login'})
    }
  }

  return {
    user,
    errorMessage,
    loading,
    handleSignUp,
    handleLogin,
    handleLogout,
    getUser,
  }
})
