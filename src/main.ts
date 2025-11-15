import { createApp } from 'vue'
import App from './views/App.vue'
import Router from './router/router'
import { createPinia } from 'pinia'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(Router)

import { useUserStore } from '@/stores/user'
const userStore = useUserStore()

const savedUser = localStorage.getItem('user')
const savedToken = localStorage.getItem('token')
if (savedUser && savedToken) {
  userStore.setUser(JSON.parse(savedUser), savedToken)
}

app.mount('#app')
