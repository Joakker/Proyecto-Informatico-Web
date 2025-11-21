<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { computed, onMounted, ref } from 'vue'
import WorkRequestCard from '../components/ClientRequestCard.vue'

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

const userStore = useUserStore()
const isLoggedIn = computed(() => userStore.user !== null)

const works = ref<WorkRequest[]>([])
const userType = ref<number|null>(null)
const userInfo = ref()
const userList = ref<User[]>([])

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

async function deleteClientRequest(requestId: number) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/clientrequests/${requestId}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (!response.ok) throw new Error(`Error ${response.status}`);

        works.value = works.value.filter(w => w.client_request_id !== requestId);
    } catch (error) {
        console.error(error);
    }
}

onMounted(async () => {
    if (isLoggedIn.value) {
        await Promise.all([getUserType(), getUserInfo(), getUsersList()])
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
            <WorkRequestCard :work="work" 
            :isModerator="userType === 3" 
            @delete="deleteClientRequest"
            />
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
