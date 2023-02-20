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
                              password: string, confirmPassword: string,
                              isAmbassador: boolean) => {

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

    const userType = isAmbassador ? 'ambassador' : 'admin'
    loading.value = true
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE}/${userType}/register/`, {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        confirmPassword: confirmPassword
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

  const handleLogin = async (email: string, password: string, typeOfUser: string) => {
    localStorage.setItem('userType', typeOfUser);

    loading.value = true
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE}/${typeOfUser}/login/`, {
        email: email,
        password: password
      }, {withCredentials: true})
      errorMessage.value = ''
      await router.push({name: 'home'})
    } catch (e) {
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

    // @ts-ignore
    const adminOrAmbassador = user.value.isAmbassador ? 'ambassador' : 'admin';

    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE}/${adminOrAmbassador}/logout/`,
        null,
        {withCredentials: true}
      )
      user.value = null
      await router.push({name: 'login'})
    } catch (e) {
      console.error(e)
    }
  }

  const handleChangeAccountInfo = async (newEmail: string,
                                         newFirstName: string,
                                         newLastName: string) => {
    const newAccountInfo: { [key: string]: string } = {}

    // Validation
    if (!validateEmail(newEmail)) return errorMessage.value = 'Email is invalid.'
    if (!newFirstName) return errorMessage.value = 'First name is required.'
    if (!newLastName) return errorMessage.value = 'Last name is required.'
    errorMessage.value = ''

    // @ts-ignore
    if (newEmail !== user.value.email)
      newAccountInfo['email'] = newEmail
    // @ts-ignore
    if (newFirstName !== user.value.firstName)
      newAccountInfo['firstName'] = newFirstName
    // @ts-ignore
    if (newLastName !== user.value.lastName)
      newAccountInfo['lastName'] = newLastName

    // @ts-ignore
    const adminOrAmbassador = user.value.isAmbassador ? 'ambassador' : 'admin'

    loading.value = true
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE}/${adminOrAmbassador}/user/info/`,
        newAccountInfo,
        {withCredentials: true}
      )
      await getUser()
    } catch (e) {
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  const handleChangePassword = async (newPassword: string, newConfirmPassword: string) => {
    if (newPassword != newConfirmPassword) {
      return errorMessage.value = 'Passwords do not match.'
    }
    if (newPassword.length < 6) {
      return errorMessage.value = 'Password must be at least 6 characters.'
    }
    errorMessage.value = ''

    // @ts-ignore
    const adminOrAmbassador = user.value.isAmbassador ? 'ambassador' : 'admin'

    loading.value = true
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE}/${adminOrAmbassador}/user/password/`,
        {password: newPassword, confirmPassword: newConfirmPassword},
        {withCredentials: true}
      )
    } catch (e) {
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  const getUser = async () => {
    loading.value = true
    try {
      const storedUserType = localStorage.getItem('userType')
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE}/${storedUserType}/user/`,
        {withCredentials: true}
      )
      if (response.data) {
        user.value = {
          id: response.data.id,
          email: response.data.email,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          isAmbassador: response.data.isAmbassador
        }
      } else {
        return user.value = null
      }
    } catch (e) {
      user.value = null
      await router.push({name: 'login'})
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    errorMessage,
    loading,
    handleSignUp,
    handleLogin,
    handleLogout,
    handleChangeAccountInfo,
    handleChangePassword,
    getUser,
  }
})
