<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

interface ClientRequest {
  client_request_id: number
  client_id?: number
  title: string
  description: string
  budget: number
  address: string
}

const route = useRoute()
const requestId = route.params.id as string

const request = ref<ClientRequest | null>(null)

onMounted(async () => {
  const response = await fetch(`http://127.0.0.1:8000/api/clientrequests/${requestId}`)
  request.value = await response.json()
})
</script>

<template>
  <div v-if="request">
    <h2>{{ request.title }}</h2>
    <p>{{ request.description }}</p>
    <p>Presupuesto: ${{ request.budget }}</p>
    <p>Dirección: {{ request.address }}</p>
  </div>
</template>
