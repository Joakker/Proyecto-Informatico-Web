import { createApp } from 'vue'
import App from './views/App.vue'
import Router from './router/router'
import { createPinia } from 'pinia'

import 'bootstrap/dist/css/bootstrap.min.css' // CSS de Bootstrap
import 'bootstrap/dist/js/bootstrap.bundle.min.js' // JS de Bootstrap
import 'bootstrap-icons/font/bootstrap-icons.css' //  íconos

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
