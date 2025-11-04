
<script setup lang="ts">
    import { ref, onMounted } from 'vue'
    import WorkRequestCard from '../components/ClientRequestCard.vue'

    interface WorkRequest {
        id: number
        title: string
        description: string
        price: number
    }

    const works = ref<WorkRequest[]>([])
    const loading = ref(true)

    
    onMounted(async () => {
        try {
            
            const response = await fetch('http://127.0.0.1:8000/api/clientrequests')
            const data = await response.json()
            works.value = data
        } catch (error) {
            console.error('Error fetching works:', error)
        } finally {
            loading.value = false
        }
    })
</script>

<template>
  <div>
    <h2>Pedidos</h2>
    <div v-if="loading">Cargando pedidos...</div>
    <div v-else>
      <WorkRequestCard v-for="work in works" :key="work.id" :work="work" />
    </div>
  </div>
</template>

