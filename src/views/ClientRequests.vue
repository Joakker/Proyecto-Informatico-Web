<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import WorkRequestCard from '../components/ClientRequestCard.vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

interface WorkRequest {
    client_request_id: number
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

onMounted(async () => {
    try {
        if (isLoggedIn.value) {
            await getUserType()
        }

        let endpoint = ''
        if (userType.value === 1) {
            endpoint = 'http://127.0.0.1:8000/api/my-requests'
        }
        // maestros y moderadores ven todas las solicitudes
        else if (userType.value === 2 || userType.value === 3) {
            endpoint = 'http://127.0.0.1:8000/api/clientrequests'
        }
        // usuario no autenticado las ve todas. ELIMINAR???
        else {
            endpoint = 'http://127.0.0.1:8000/api/clientrequests'
        }

        const response = await fetch(endpoint, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })

        const data = await response.json()
        works.value = data

    } catch (error) {
        console.error('Error fetching works:', error)
    } finally {
        loading.value = false
    }
})

function toCreateClientPost() {
    router.push('/createclientrequest')
}
</script>

<template>
  <div class="container my-5">

    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">Solicitudes de trabajo</h2>

      <template v-if="isLoggedIn && userType === 1">
        <button @click="toCreateClientPost" class="btn btn-primary">
          Pedir un maestro
        </button>
      </template>
    </div>

    <hr>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <div v-else class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      <WorkRequestCard 
        v-for="work in works" 
        :key="work.client_request_id" 
        :work="work" 
        class="col"
      />
    </div>

  </div>
</template>

<style scoped>
h2 {
  font-weight: 600;
}

button {
  font-weight: 500;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}

</style>
