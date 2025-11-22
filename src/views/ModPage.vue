<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { computed, onMounted, ref } from 'vue'
import WorkRequestCard from '../components/ClientRequestCard.vue'
import SupportTicket from './SupportTicket.vue'

interface WorkRequest {
  client_request_id: number
  title: string
  description: string
  budget: number
}

interface User {
    user_id: number
    first_name: string
    last_name: string
    email: string
    type: number
}

interface Conversation {
    conversation_id: number
    mod_id: number
    user_id: number
    created_at: string
    updated_at: string
}

const userStore = useUserStore()
const isLoggedIn = computed(() => userStore.user !== null)

const works = ref<WorkRequest[]>([])
const userType = ref<number|null>(null)
const userInfo = ref()
const userList = ref<User[]>([])
const userTickets = ref<Conversation[]>([])

async function getUserType() {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/user/type', {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        if (!response.ok) throw new Error(`Error ${response.status}`)
        const data = await response.json()
        userType.value = data.type
    } catch (error) {
        console.error(error)
    }
}

async function getUserInfo() {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/user', {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        if (!response.ok) throw new Error(`Error ${response.status}`)
        userInfo.value = await response.json()
    } catch (error) {
        console.error(error)
    }
}

async function getUsersList() {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/get_users', {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        if (!response.ok) throw new Error(`Error ${response.status}`)
        userList.value = await response.json()
    } catch (error) {
        console.error(error)
    }
}

async function deleteUser(userId: number) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        if (!response.ok) throw new Error(`Error ${response.status}`)
        userList.value = userList.value.filter(u => u.user_id !== userId)
    } catch (error) {
        console.error(error)
    }
}

async function getTickets() {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/mod_conversations', {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        if (!response.ok) throw new Error(`Error ${response.status}`)
        const result = await response.json()
        userTickets.value = result.data
    } catch (error) {
        console.error(error)
    }
}

onMounted(async () => {
    if (isLoggedIn.value) {
        await Promise.all([getTickets(), getUserType(), getUserInfo(), getUsersList()])
        const response = await fetch('http://127.0.0.1:8000/api/clientrequests')
        works.value = await response.json()
    }
})
</script>

<template>
<template v-if="userType !== 3">
    <div class="text-center my-5">
        <div class="alert alert-danger">
            No tienes privilegios para entrar a esta página 😅
        </div>
    </div>
</template>

<template v-else>
<div class="container my-5">

    <!-- Solicitudes de clientes -->
    <h3 class="mb-4">Solicitudes de clientes</h3>
    <div class="row g-4">
        <div class="col-md-6 col-lg-4" v-for="work in works" :key="work.client_request_id">
            <WorkRequestCard :work="work" />
        </div>
    </div>

    <hr class="my-5">

    <!-- Lista de usuarios como lista vertical -->
    <h3 class="mb-4">Lista de usuarios</h3>
    <ul class="list-group">
        <li class="list-group-item d-flex justify-content-between align-items-center" v-for="user in userList" :key="user.user_id">
            <span>{{ user.first_name }} {{ user.last_name }} - {{ user.email }}</span>
            <button class="btn btn-danger btn-sm" @click="deleteUser(user.user_id)">
                Eliminar
            </button>
        </li>
    </ul>

    <h3 class="mb-4">Tickets</h3>
    <ul class="list-group">
        <li class="list-group-item d-flex justify-content-between align-items-center" v-for="ticket in userTickets" :key="ticket.conversation_id">
            <span>Usuario {{ ticket.user_id }}</span>
            <span>Ticket creado el {{ ticket.created_at }}</span>
            <button class="btn btn-danger btn-sm">
                Eliminar
            </button>
            <SupportTicket
                :conversation_id="ticket.conversation_id"
            />
        </li>
    </ul>

</div>
</template>
</template>

<style scoped>
h3 {
    font-weight: 600;
}

hr {
    border-top: 2px solid #dee2e6;
}
</style>
