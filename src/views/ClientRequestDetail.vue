<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

interface User {
  id: number
  first_name: string   
  last_name?: string  
  email: string
  phone_number: string
  score: number
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
}

const route = useRoute()
const requestId = route.params.id as string

const request = ref<ClientRequest | null>(null)

onMounted(async () => {
  const response = await fetch(`http://127.0.0.1:8000/api/clientrequests/${requestId}`);
  request.value = await response.json();
  console.log(request);
})
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
          <li class="list-group-item"><strong>Dirección:</strong> {{ request.address }}</li>
        </ul>

        <h5>Información de contacto</h5>
        <ul class="list-group list-group-flush">
          <li class="list-group-item"><strong>Teléfono:</strong> {{ request.client?.user?.phone_number }}</li>
          <li class="list-group-item"><strong>Correo:</strong> {{ request.client?.user?.email }}</li>
        </ul>

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
