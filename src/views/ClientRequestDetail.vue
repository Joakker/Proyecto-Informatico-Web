<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'

const userType = ref<number|null>(null)
const userStore = useUserStore()
const isLoggedIn = computed(() => userStore.user !== null)


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

interface User {
  id: number
  first_name: string   
  last_name?: string  
  email: string
  phone_number: string
  score: number
}

interface Category {
  category_id: number
  name: string
  description?: string
}

interface Client {
  client_id: number
  user_id: number
  user?: User     
}

interface ClientRequest {
  client_request_id: number
  client_id?: number
  title: string
  description: string
  budget: number
  address: string
  client?: Client 
  category?: Category
}

const route = useRoute()
const requestId = route.params.id as string

const request = ref<ClientRequest | null>(null)

onMounted(async () => {
  if (isLoggedIn.value) getUserType()
  const response = await fetch(`http://127.0.0.1:8000/api/clientrequests/${requestId}`);
  request.value = await response.json();
  console.log(request);
})

async function TakeJob(){
  try{
    const response = await fetch(`http://127.0.0.1:8000/api/create_work`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json', 
        'Accept': 'application/json' ,
        'Authorization': `Bearer ${localStorage.getItem('token')}`,      
        },
        body: JSON.stringify({
          client_id: request.value?.client_id,
          worker_id: userStore.$id,
          client_request_id: request.value?.client_request_id,
          state: 'postulado',
        }),
      })
  } catch (error) {
    console.error(error)
    alert(error)
  }
  
}
</script>

<template>
  <div class="container my-5" v-if="request">
    <div class="card shadow-sm">
      <div class="card-body">
        <h2 class="card-title mb-3">{{ request.title }}</h2>

        <p class="text-muted">
          <strong>Solicitado por:</strong> {{ request.client?.user?.first_name }} {{ request.client?.user?.last_name }}
          <span class="badge bg-primary ms-2">Calificación: {{ request.client?.user?.score }}/5</span>
        </p>

        <p class="card-text">{{ request.description }}</p>

        <ul class="list-group list-group-flush mb-3">
          <li class="list-group-item"><strong>Presupuesto:</strong> ${{ request.budget }}</li>
          <li class="list-group-item"><strong>Categoría:</strong> {{ request.category?.name || 'Sin categoría' }}</li>
          <li class="list-group-item"><strong>Dirección:</strong> {{ request.address }}</li>
        </ul>

        <h5>Información de contacto</h5>
        <ul class="list-group list-group-flush">
          <li class="list-group-item"><strong>Teléfono:</strong> {{ request.client?.user?.phone_number }}</li>
          <li class="list-group-item"><strong>Correo:</strong> {{ request.client?.user?.email }}</li>
        </ul>

        <template v-if="userType === 2">
          <div class="mt-4 d-flex justify-content-center">
            <router-link to="/clientrequests" class="btn btn-primary" @click.once="TakeJob">Tomar trabajo</router-link>
          </div>
        </template>

        <div class="mt-4 d-flex justify-content-center">
          <router-link to="/clientrequests" class="btn btn-secondary">Volver a la lista</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 700px;
}
.card-title {
  font-weight: 600;
}
</style>
