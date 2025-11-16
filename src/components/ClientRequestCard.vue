
<script setup lang="ts">
  import { useRouter } from 'vue-router'
  import { defineProps } from 'vue'
  

  const props = defineProps<{ work: { client_request_id: number, title: string, description: string, budget: number } }>()
  const router = useRouter()

  function goToDetails() {
    router.push(`/clientrequests/${props.work.client_request_id}`)
  }


</script>

<template>
  <div class="work-card">
    <h3>{{ work.title }}</h3>
    <p>{{ work.description }}</p>
    <p><strong>Presupuesto:</strong> ${{ work.budget }}</p>
    <button @click="goToDetails">Ver más</button>
  </div>
</template>

<style scoped>
.work-card {
  border: 1px solid #ccc;
  padding: 1rem;
  margin-bottom: 1rem;
}
</style>