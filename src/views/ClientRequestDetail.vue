<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'

interface User {
  id: number
  first_name: string
  last_name?: string
  email: string
  phone_number: string
  score: number
}

interface Category {
  category_id: number
  name: string
  description?: string
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
  category?: Category
}

const route = useRoute()
const requestId = route.params.id as string

const isAdmin = computed(() => userType.value === 3)


const request = ref<ClientRequest | null>(null)

const accepting = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const userStore = useUserStore()
const isLoggedIn = computed(() => userStore.user !== null)
const userType = ref<number | null>(null)

async function getUserType() {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/user/type', {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    const data = await response.json()
    userType.value = data.type
  } catch {
    userType.value = null
  }
}

onMounted(async () => {
  await getUserType()

  const response = await fetch(
    `http://127.0.0.1:8000/api/clientrequests/${requestId}`,
  )
  request.value = await response.json()
})

async function acceptJob() {
  if (!request.value) return

  accepting.value = true
  successMessage.value = ''
  errorMessage.value = ''

  try {
    const response = await fetch('http://127.0.0.1:8000/api/create_work', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        client_id: request.value.client?.client_id,
        client_request_id: request.value.client_request_id,
        state: 'postulado',
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      errorMessage.value = data.error || 'No se pudo aceptar el trabajo.'
      return
    }

    successMessage.value = 'Trabajo tomado exitosamente.'
  } catch (err) {
    errorMessage.value = 'Error inesperado al tomar el trabajo.'
  } finally {
    accepting.value = false
  }
}
</script>

<template>
  <div class="details-wrapper" v-if="request">
    <!-- Mensajes -->
    <div v-if="successMessage" class="alert-success">
      {{ successMessage }}
    </div>
    <div v-if="errorMessage" class="alert-error">
      {{ errorMessage }}
    </div>

    <!-- HEADER -->
    <div class="header">
      <div class="icon-circle">
        📄
      </div>

      <div>
        <h1 class="title">{{ request.title }}</h1>
        <p class="subtitle">
          Solicitud creada por
          <strong>
            {{ request.client?.user?.first_name }}
            {{ request.client?.user?.last_name }}
          </strong>
        </p>
      </div>
    </div>

    <!-- DESCRIPCIÓN -->
    <div class="card-section">
      <h3>Descripción del trabajo</h3>
      <p class="description-text">
        {{ request.description }}
      </p>
    </div>

    <!-- INFORMACIÓN GENERAL -->
    <div class="info-section">
      <div class="info-item">
        <label>Presupuesto estimado</label>
        <p>${{ request.budget }}</p>
      </div>

      <div class="info-item">
        <label>Categoría</label>
        <p>{{ request.category?.name || 'Sin categoría' }}</p>
      </div>

      <div class="info-item">
        <label>Dirección</label>
        <p>{{ request.address }}</p>
      </div>

      <div class="info-item">
        <label>Calificación del cliente</label>
        <span class="score-badge">
          {{ request.client?.user?.score }}/5 ⭐
        </span>
      </div>
    </div>

    <!-- CONTACTO -->
    <div class="contact-section">
      <h3>Información de contacto</h3>

      <div class="contact-row">
        <i class="fas fa-phone-alt contact-icon"></i>
        <p>{{ request.client?.user?.phone_number }}</p>
      </div>

      <div class="contact-row">
        <i class="fas fa-envelope contact-icon"></i>
        <p>{{ request.client?.user?.email }}</p>
      </div>
    </div>

    <!-- BOTONES (SOLO AQUÍ) -->
    <div class="actions row-buttons">
      <button
        v-if="isLoggedIn && userType === 2"
        class="accept-btn"
        @click="acceptJob"
        :disabled="accepting"
      >
        Tomar trabajo
      </button>

<router-link
  :to="isAdmin ? '/admin/requests' : '/clientrequests'"
  class="back-btn"
>
  Volver a las solicitudes
</router-link>

    </div>
  </div>
</template>

<style scoped>
.alert-success {
  background: #d4f8d4;
  color: #225e22;
  padding: 10px 14px;
  border-radius: 10px;
  margin-bottom: 15px;
}

.alert-error {
  background: #ffe0e0;
  color: #8a1f1f;
  padding: 10px 14px;
  border-radius: 10px;
  margin-bottom: 15px;
}

/* Diseño base tuyo */
.details-wrapper {
  max-width: 800px;
  margin: auto;
  padding: 2rem;
  background: linear-gradient(180deg, #ffffff 0%, #f7f9ff 60%, #eef4ff 100%);
  border-radius: 18px;
  box-shadow: 0 3px 20px rgba(0, 0, 0, 0.07);
}

.header {
  display: flex;
  align-items: center;
  gap: 1.3rem;
  margin-bottom: 1.5rem;
}

.icon-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #009fe3, #45c6ff);
  display: flex;
  justify-content: center;
  align-items: center;

  color: white;
  font-size: 1.7rem;
  box-shadow: 0 4px 12px rgba(76, 147, 255, 0.4);
}

.title {
  font-weight: 700;
  font-size: 1.8rem;
  margin: 0;
  color: #1b1f24;
}

.subtitle {
  color: #6b7280;
  font-size: 0.95rem;
}

/* Secciones */
.card-section,
.info-section,
.contact-section {
  background: white;
  padding: 1.3rem 1.5rem;
  margin-top: 1.3rem;
  border-radius: 14px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.card-section h3,
.contact-section h3 {
  font-weight: 600;
  margin-bottom: 0.8rem;
}

.description-text {
  font-size: 1rem;
  color: #374151;
  line-height: 1.5;
}

/* Info grid */
.info-section {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
}

.info-item label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #6b7280;
}

.info-item p {
  font-size: 1rem;
  color: #1f2937;
  margin: 0.2rem 0 0 0;
}

.score-badge {
  background: #ffca28;
  padding: 4px 10px;
  border-radius: 12px;
  font-weight: 600;
  color: #2e2e2e;
}

/* Contacto */
.contact-row {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-top: 0.6rem;
  font-size: 1rem;
  color: #1f2937;
}

.contact-icon {
  font-size: 1.3rem;
  color: #4c93ff;
}

/* Botones */
.actions {
  margin-top: 2rem;
}

.row-buttons {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.accept-btn {
  background: #009fe3;
  padding: 0.65rem 1.4rem;
  border-radius: 10px;
  color: white;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}

.accept-btn:hover {
  background: #007bb1;
}

.back-btn {
  background: #d1d9e6;
  padding: 0.65rem 1.4rem;
  border-radius: 10px;
  font-weight: 600;
  color: #1f2937;
  text-decoration: none;
}
</style>
