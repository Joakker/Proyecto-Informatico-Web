import { defineStore } from 'pinia'

interface User {
  name: string
  email: string
}

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as null | { id: number; name: string; email: string },
  }),
  actions: {
    setUser(userData: { id: number; name: string; email: string }) {
      this.user = userData
    },
    logout() {
      this.user = null
      localStorage.clear()
    },
  },
})

