import { createRouter, createWebHistory } from 'vue-router'
import Signup from '../views/Sign-up.vue'
import App from '../views/App.vue'
import Home from '../views/Home.vue'
import ClientRequests from '../views/ClientRequests.vue'
import WorkerRequests from '@/views/WorkerRequests.vue'
import LogIn from '@/views/Log-in.vue'

const routes = [
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  },

  {
    path: '/login',
    name: 'Login',
    component: LogIn
  },

  {
    path: '/',
    name: 'Home',
    component: Home
  },

  {
    path: '/clientrequests',
    name: 'ClientRequests',
    component: ClientRequests
  },

  {
    path: '/workerrequests',
    name: 'WorkerRequests',
    component: WorkerRequests
  }

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
