
<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import WorkRequestCard from '../components/ClientRequestCard.vue'
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

  function toCreatePost() {
    router.push('/createclientrequest')
  }
</script>

<template>
  <div>
    <h2>Solicitudes de trabajo</h2>
    <button @click="toCreatePost">Pedir un maestro</button>
    <div v-if="loading">Cargando pedidos...</div>
    <div v-else>
      <WorkRequestCard v-for="work in works" :key="work.id" :work="work" />
    </div>
  </div>
</template>

