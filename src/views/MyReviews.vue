<script setup lang="ts">
import { ref, onMounted } from "vue"

const reviews = ref<any[]>([])
const loading = ref(true)

async function loadMyReviews() {
  const res = await fetch("http://127.0.0.1:8000/api/my-reviews", {
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
      "Accept": "application/json"
    }
  })

  reviews.value = await res.json()
  loading.value = false
}

onMounted(loadMyReviews)
</script>
<template>
  <div class="container my-5">
    <h2 class="mb-4 text-center">Mis reseñas</h2>

    <div v-if="loading" class="text-center">
      <div class="spinner-border text-primary"></div>
    </div>

    <div v-else>
      <p v-if="reviews.length === 0" class="text-muted">
        Aún no tienes reseñas.
      </p>

      <div
        v-for="review in reviews"
        :key="review.review_id"
        class="card mb-3 p-3 shadow-sm mx-auto"
        style="max-width: 600px"
      >
        <h5>{{ review.title }}</h5>

        <p class="mb-1">
          <strong>Trabajo:</strong>
          {{ review.work?.client_request?.title }}
        </p>

        <p class="mb-1">
          <strong>De:</strong>
          {{ review.reviewer?.first_name }} {{ review.reviewer?.last_name }}
        </p>

        <p class="mb-2">{{ review.description }}</p>

        <span class="badge bg-warning text-dark">
          ⭐ {{ review.score }}/5
        </span>
      </div>
    </div>
  </div>
</template>
