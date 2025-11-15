
<script setup lang="ts">
    import { computed, ref, onMounted } from 'vue'
    import WorkRequestCard from '../components/WorkerRequestCard.vue'
    import { useUserStore } from '@/stores/user'
    import { useRouter } from 'vue-router'

    interface WorkRequest {
        id: number
        title: string
        description: string
        budget: number
    }

    const router = useRouter()
    const works = ref<WorkRequest[]>([])
    const loading = ref(true)

    const userStore = useUserStore()
    const isLoggedIn = computed(() => userStore.user !== null)

    const userType = ref<number|null>(null)

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
        } catch (error) {
            console.error(error)
        }
    }

    onMounted(async () => {
        try {
            getUserType();
            const response = await fetch('http://127.0.0.1:8000/api/workerrequests')
            const data = await response.json()
            works.value = data
        } catch (error) {
            console.error('Error fetching works:', error)
        } finally {
            loading.value = false
        }
    })

    function toCreateWorkerPost() {
      router.push('/createworkerrequest')
    }
</script>

<template>
  <div>
    <h2>Trabajadores</h2>

    <template v-if="isLoggedIn">
      <template v-if="userType === 2">
        <button @click="toCreateWorkerPost">Crear anuncio</button>
      </template>
    </template>

    <div v-if="loading">Cargando pedidos...</div>
    <div v-else>
      <WorkRequestCard v-for="work in works" :key="work.id" :work="work" />
    </div>
  </div>
</template>

