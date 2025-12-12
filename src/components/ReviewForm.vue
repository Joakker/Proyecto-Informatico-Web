<script setup lang="ts">
import { ref } from "vue"

// Props recibidos desde WorkDetail.vue
const props = defineProps<{
  workId: number,
  reviewedId: number,
  reviewerId: number
}>()

// Campos del formulario
const title = ref("")
const description = ref("")
const score = ref(0)

const loading = ref(false)

// Mostrar estrellas marcadas
function setScore(val: number) {
  score.value = val
}

// Enviar reseña al backend
async function submitReview() {
  if (!title.value.trim() || !description.value.trim() || score.value === 0) {
    alert("Completa todos los campos y selecciona una puntuación.")
    return
  }

  loading.value = true

  const res = await fetch("http://127.0.0.1:8000/api/reviews", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      reviewer_id: props.reviewerId,
      reviewed_id: props.reviewedId,
      work_id: props.workId,
      title: title.value,
      description: description.value,
      score: score.value
    })
  })

  const data = await res.json()
  loading.value = false

  if (!res.ok) {
    alert(data.error || "No se pudo enviar la reseña.")
    return
  }

  alert("¡Reseña enviada con éxito!")
  window.location.reload() // refresca la vista
}
</script>

<template>
  <div class="card p-3 mt-4 shadow-sm">
    <h4 class="mb-3">Dejar Reseña</h4>

    <!-- Estrellas -->
    <div class="mb-3">
      <span
        v-for="n in 5"
        :key="n"
        class="star"
        :class="{ active: n <= score }"
        @click="setScore(n)"
      >
        ★
      </span>
    </div>

    <!-- Título -->
    <input
      v-model="title"
      type="text"
      placeholder="Título de la reseña"
      class="form-control mb-2"
    />

    <!-- Comentario -->
    <textarea
      v-model="description"
      rows="3"
      placeholder="Escribe tu experiencia..."
      class="form-control mb-3"
    ></textarea>

    <!-- Botón -->
    <div class="text-center">
        <button
                class="btn btn-primary btn-sm px-4"
                :disabled="loading"
                @click="submitReview"
            >
                {{ loading ? "Enviando..." : "Enviar Reseña" }}
        </button>
    </div>
  </div>
</template>

<style scoped>
.star {
  font-size: 28px;
  cursor: pointer;
  color: #ccc;
  margin-right: 5px;
  transition: 0.2s;
}
.star.active {
  color: #ffc107;
}
.star:hover {
  transform: scale(1.15);
}
</style>

