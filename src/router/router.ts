import { createRouter, createWebHistory } from 'vue-router'

import Signup from '../views/Sign-up.vue'
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

// NUEVAS VISTAS ADMIN
import AdminRequests from '@/views/AdminRequests.vue'
import AdminUsers from '@/views/AdminUsers.vue'
import AdminTickets from '@/views/AdminTickets.vue'
import SignupMod from '@/views/Sign-upMod.vue'

const routes = [
  // AUTH
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

  // HOME
  {
    path: '/',
    name: 'Home',
    component: Home
  },

  // CLIENT REQUESTS
  {
    path: '/clientrequests',
    name: 'ClientRequests',
    component: ClientRequests
  },
  {
    path: '/clientrequests/:id',
    name: 'ClientRequestDetail',
    component: ClientRequestDetail
  },
  {
    path: '/createclientrequest',
    name: 'CreateClientRequest',
    component: CreateClientRequest
  },

  // WORKER REQUESTS
  {
    path: '/workerrequests',
    name: 'WorkerRequests',
    component: WorkerRequests
  },

  // SEARCH
  {
    path: '/search-workers',
    name: 'SearchWorkers',
    component: SearchWorkers
  },

  // PROFILE
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  },

  // SUPPORT
  {
    path: '/support',
    name: 'Support',
    component: SupportChat
  },

  // 🛠 ADMIN PANEL (Nuevo)
  {
    path: '/modpage',
    name: 'ModPage',
    component: ModPage
  },

  {
    path: '/admin/requests',
    name: 'AdminRequests',
    component: AdminRequests
  },
  {
    path: '/admin/users',
    name: 'AdminUsers',
    component: AdminUsers
  },
  {
    path: '/admin/tickets',
    name: 'AdminTickets',
    component: AdminTickets
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
  },

  {
    path: '/my-works',
    name: 'my-works',
    component: () => import('@/views/MyWorks.vue')
  },
  
  {
    path: '/work/:id',
    name: 'work-detail',
    component: () => import('@/views/WorkDetail.vue'),
    props: true
  },
  {
  path: '/admin/create-moderator',
  name: 'CreateModerator',
  component: SignupMod
  },

  {
    path: '/my-reviews',
    name: 'my-reviews',
    component: () => import('@/views/MyReviews.vue')
  }


]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
