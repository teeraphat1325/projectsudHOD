import { defineStore, acceptHMRUpdate } from 'pinia'
import { computed, ref } from 'vue'
import { useUserStore } from './userStore'
import { type User } from 'src/models'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()
  const $q = useQuasar()
  const isLogin = computed(() => {
    return user.value !== null
  })
  const user = ref<User | null>(null)
  const userStore = useUserStore()

  function saveUserToStorage() {
    // localStorage.setItem('user', JSON.stringify(user.value))
    $q.localStorage.setItem('user', user.value)
  }
  function loadUserFromStorage() {
    user.value = $q.localStorage.getItem('user')
  }
  function clearUserFromStroage() {
    $q.localStorage.removeItem('user')
  }
  async function login(email: string, password: string): Promise<boolean> {
    console.log('Login attempt with:', email, password)
    const u = await userStore.getUserByEmail(email)
    console.log('User from API:', u)

    if (u && u.password === password) {
      user.value = {
        ...u,
        roles: Array.isArray(u.roles) ? u.roles : [{ id: 2 }],
        password: '',
      }
      saveUserToStorage()
      return true
    }
    return false
  }
  function logout() {
    router.replace({ path: '/login' })
    clearUserFromStroage()
    user.value = null
  }
  loadUserFromStorage()
  return { login, isLogin, logout, user }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
