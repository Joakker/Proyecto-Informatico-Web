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
    async logout() {
      try {
        // Llamar al backend para revocar el token
        await fetch('http://127.0.0.1:8000/api/logout', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        })
      } catch (error) {
        console.error('Error al cerrar sesión en backend:', error)
      } finally {
        // Limpiar estado local y storage
        this.user = null
        localStorage.clear()
      }
    },
  },
})
