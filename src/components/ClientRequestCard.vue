
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { defineProps } from 'vue'

const props = defineProps<{
  work: { client_request_id: number, title: string, description: string, budget: number }
}>()
const router = useRouter()

function goToDetails() {
  router.push(`/clientrequests/${props.work.client_request_id}`)
}
</script>

<template>
  <div class="card mb-3 shadow-sm work-card">
    <div class="card-body">
      <h5 class="card-title">{{ props.work.title }}</h5>
      <p class="card-text text-truncate">{{ props.work.description }}</p>
      <p class="card-text"><strong>Presupuesto:</strong> ${{ props.work.budget }}</p>
      <button @click="goToDetails" class="btn btn-primary btn-sm">Ver más</button>
    </div>
  </div>
</template>

<style scoped>
.work-card {
  transition: transform 0.2s;
}
.work-card:hover {
  transform: translateY(-3px);
}
.card-text.text-truncate {
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
