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
if (savedUser) {
  userStore.setUser(JSON.parse(savedUser))
}

app.mount('#app')
