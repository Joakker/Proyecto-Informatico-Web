import { createRouter, createWebHistory } from 'vue-router'
import Signup from '../views/Sign-up.vue'
import App from '../views/App.vue'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  },

  {
    path: '/',
    name: 'Home',
    component: Home
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
