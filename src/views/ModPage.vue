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
    const userInfo = ref();
    const userList = ref<User[]>([])

    async function getUserType() {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/user/type', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}` // token from login
            }
            })

            if (!response.ok) {
            throw new Error(`Error ${response.status}`)
            }

            const data = await response.json()
            userType.value = data.type
            console.log('User type:', data.type)
        } catch (error) {
            console.error(error)
        }
    }

    async function getUserInfo() {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/user', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}` // token from login
            }
            })

            if (!response.ok) {
            throw new Error(`Error ${response.status}`)
            }

            const data = await response.json()
            userInfo.value = data
        } catch (error) {
            console.error(error)
        }
    }

    async function getUsersList() {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/get_users', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}` // token from login
            }
            })

            if (!response.ok) {
                throw new Error(`Error ${response.status}`);
            }

            const data = await response.json();
            userList.value = data;
            console.log(userList);
        } catch (error) {
            console.error(error);
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
            });

            if (!response.ok) {
            throw new Error(`Error ${response.status}`);
            }

            const data = await response.json();
            console.log(data.message);

            // Actualizar lista local
            userList.value = userList.value.filter(u => u.user_id !== userId);
        } catch (error) {
            console.error(error);
        }
    }


    onMounted(async () => {
        if (isLoggedIn.value) {
            await Promise.all([
                getUserType(),
                getUserInfo(),
                getUsersList()
            ]);

            const response = await fetch('http://127.0.0.1:8000/api/clientrequests')
            const data = await response.json()
            works.value = data
        }
    })
</script>

<template>
    <template v-if="userType != 3">
        <p>No tienes privilegios para entrar a esta página :p</p>
    </template>
    <template v-else>

        <div class="requests-mod">
            <h3>Solicitudes de clientes</h3>
            <div class="request-container">
                <WorkRequestCard v-for="work in works" :key="work.client_request_id" :work="work" />
            </div>
        </div>

        <div class="users-mod">
            <h3>Lista de usuarios</h3>
            <div v-for="user in userList" :key="user.user_id">
                <div class="user-div">
                    <p>{{ user.first_name }} {{ user.last_name }} - {{ user.email }}</p>
                    <button @click="deleteUser(user.user_id)">Eliminar usuario</button>
                </div>
            </div>

        </div>

    </template>
</template>

<style>

.requests-mod {
    margin: 6rem;
}

.request-container {
    padding: 2rem;
    border: 2px solid;
    border-color: gray;
}

.users-mod {
    margin: 6rem;
}

.user-div {
    padding: 2rem;
    border: 2px solid;
    border-color: gray;
}
</style>