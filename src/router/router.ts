import { createRouter, createWebHistory } from 'vue-router'
import Signup from '../views/Sign-up.vue'
import App from '../views/App.vue'
import Home from '../views/Home.vue'
import ClientRequests from '../views/ClientRequests.vue'
import WorkerRequests from '@/views/WorkerRequests.vue'
import SearchWorkers from '@/views/SearchWorkers.vue'
import LogIn from '@/views/Log-in.vue'
import Profile from '@/views/Profile.vue'
import CreateClientRequest from '@/views/CreateClientRequest.vue'
import ClientRequestDetail from '@/views/ClientRequestDetail.vue'
import ModPage from '@/views/ModPage.vue'
import SupportChat from '@/views/SupportChat.vue'
import WorkChats from '@/views/WorkChats.vue'
import WorkChat from '@/views/WorkChat.vue'

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
  },

  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  },

  {
    path: '/createclientrequest',
    name: 'CreateClientRequest',
    component: CreateClientRequest
  },

  {
    path: '/clientrequests/:id',
    name: 'ClientRequestDetail',
    component: ClientRequestDetail
  },

  {
    path: '/search-workers', 
    name: 'SearchWorkers',
    component: SearchWorkers
  },

  {
    path: '/modpage',
    name: 'ModPage',
    component: ModPage
  },

  {
    path: '/support',
    name: 'Support',
    component: SupportChat
  }, 

  {
    path: '/work-chats',
    name: 'WorkChats',
    component: WorkChats
  },
  {
    path: '/work-chat/:id',
    name: 'WorkChat',
    component: WorkChat,
    props: true
  }

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
