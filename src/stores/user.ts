import { defineStore } from 'pinia'

interface User {
  name: string
  email: string
}

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null,
  }),
  actions: {
    setUser(userData: User) {
      this.user = userData
    },
    logout() {
      this.user = null
    },
  },
})
