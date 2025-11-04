
<script setup lang="ts">
    import { ref, onMounted } from 'vue'
    import WorkCard from '../components/ClientRequestCard.vue'

    interface Work {
        id: number
        title: string
        description: string
        price: number
    }

    const works = ref<Work[]>([])
    const loading = ref(true)

    
    onMounted(async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/works')
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
    <h2>Available Works</h2>
    <div v-if="loading">Loading...</div>
    <div v-else>
      <WorkCard v-for="work in works" :key="work.id" :work="work" />
    </div>
  </div>
</template>

