<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const isLoggedIn = computed(() => userStore.user !== null)
const userType = ref<number | null>(null)

// -------------------------
// Obtener tipo de usuario
// -------------------------
async function getUserType() {
    const res = await fetch("http://127.0.0.1:8000/api/user/type", {
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Accept": "application/json"
        }
    })
    const data = await res.json()
    userType.value = data.type
}

// -------------------------
// Interfaces
// -------------------------
interface Work {
  work_id: number
  worker_id: number
  state: string

  worker?: {
    user?: {
      first_name: string
      last_name: string
      phone_number: string
      email: string
      score: number
    }
  }
}

interface ClientRequest {
  client_request_id: number
  client_id: number
  title: string
  description: string
  budget: number
  address: string
  client?: {
    user?: {
      first_name: string
      last_name: string
      phone_number: string
      email: string
      score: number
    }
  }
  category?: { name: string }
  works?: Work[]
  selected_work_id?: number
}

// -------------------------
// Load data
// -------------------------
const route = useRoute()
const requestId = route.params.id as string
const request = ref<ClientRequest | null>(null)

async function loadRequest() {
  const res = await fetch(`http://127.0.0.1:8000/api/client-requests/${requestId}`, {
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
      "Accept": "application/json"
    }
  })
  request.value = await res.json()
  console.log("REQUEST:", request.value)
}

onMounted(async () => {
  if (isLoggedIn.value) await getUserType()
  await loadRequest()
})


// -------------------------
// Maestro: tomar trabajo
// -------------------------
async function TakeJob() {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/create_work`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        client_id: request.value?.client_id,
        client_request_id: request.value?.client_request_id,
        state: "postulado"
      })
    })

    const data = await res.json()

    if (!res.ok) {
      if (res.status === 409) {
        alert("Ya postulaste a este trabajo.")
        return
      }

      alert(data.error || "No se pudo postular al trabajo.")
      return
    }

    alert("Has postulado al trabajo.")
    await loadRequest()

  } catch (error) {
    console.error(error)
    alert("Error de conexión.")
  }
}


// -------------------------
// Cliente: seleccionar maestro
// -------------------------
async function selectMaster(workId: number) {
  if (!confirm("¿Seleccionar a este maestro?")) return

  const res = await fetch(
    `http://127.0.0.1:8000/api/client-requests/${requestId}/select-master`,
    {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ work_id: workId })
    }
  )

  const data = await res.json()

  if (!res.ok) {
    alert(data.error || "No se pudo seleccionar maestro.")
    return
  }

  alert("Maestro seleccionado correctamente.")
  await loadRequest()
}
</script>

<template>
  <div class="container my-5" v-if="request">
    <div class="card shadow-sm">
      <div class="card-body">

        <!-- Título -->
        <h2 class="card-title mb-3">{{ request.title }}</h2>

        <!-- Datos del cliente -->
        <p class="text-muted">
          <strong>Solicitado por:</strong>
          {{ request.client?.user?.first_name }} {{ request.client?.user?.last_name }}
          <span class="badge bg-primary ms-2">
            Calificación: {{ request.client?.user?.score }}/5
          </span>
        </p>

        <p class="card-text">{{ request.description }}</p>

        <!-- Info básica -->
        <ul class="list-group list-group-flush mb-3">
          <li class="list-group-item"><strong>Presupuesto:</strong> ${{ request.budget }}</li>
          <li class="list-group-item"><strong>Categoría:</strong> {{ request.category?.name }}</li>
          <li class="list-group-item"><strong>Dirección:</strong> {{ request.address }}</li>
        </ul>

        <!-- Contacto -->
        <h5>Información de contacto</h5>
        <ul class="list-group list-group-flush">
          <li class="list-group-item"><strong>Teléfono:</strong> {{ request.client?.user?.phone_number }}</li>
          <li class="list-group-item"><strong>Correo:</strong> {{ request.client?.user?.email }}</li>
        </ul>

        <!-- Maestro: TOMAR TRABAJO -->
        <div v-if="userType === 2" class="mt-4 d-flex justify-content-center">
          <button class="btn btn-primary" @click="TakeJob">Tomar trabajo</button>
        </div>

        <!-- Cliente: ver postulantes -->
        <div v-if="userType === 1" class="mt-4">
          <h4>Maestros postulados</h4>

          <div v-if="!request.works?.length">
            <p class="text-muted">Aún no hay postulantes.</p>
          </div>

          <div
            v-for="work in request.works"
            :key="work.work_id"
            class="card p-3 mb-2">

            <!-- No mostramos nombre (simple y estable) -->
            <h5>
              Maestro: 
              {{ work.worker?.user?.first_name }} 
              {{ work.worker?.user?.last_name }}
            </h5>

            <p class="text-muted">Estado: {{ work.state }}</p>

            <button
              v-if="!request.selected_work_id && work.state === 'postulado'"
              class="btn btn-primary btn-sm"
              @click="selectMaster(work.work_id)">
              Seleccionar Maestro
            </button>

            <p v-if="request.selected_work_id === work.work_id"
               class="text-success fw-bold mt-2">
               Maestro seleccionado
            </p>
          </div>
        </div>

        <!-- Volver -->
        <div class="mt-4 d-flex justify-content-center">
          <router-link to="/clientrequests" class="btn btn-secondary">
            Volver a la lista
          </router-link>
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