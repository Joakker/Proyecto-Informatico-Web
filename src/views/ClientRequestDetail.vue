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
  <div v-if="request" class="request">
    <h2>{{ request.title }}</h2>
    <p>Solicitado por {{ request.client?.user?.first_name }} {{ request.client?.user?.last_name }}.</p>
    <p>Calificación: {{ request.client?.user?.score }}/5</p>
    <p>{{ request.description }}</p>
    <p>Presupuesto: ${{ request.budget }}</p>
    <p>Dirección: {{ request.address }}</p>
    <h3>Información de contacto</h3>
    <p>Número de teléfono: {{ request.client?.user?.phone_number }}</p>
    <p>Correo electrónico: {{ request.client?.user?.email }}</p>
  </div>
</template>

<style>

.request {
  align-items: center;
  justify-items: center;
}

</style>