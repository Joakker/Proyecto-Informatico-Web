<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import WorkRequestCard from '../components/ClientRequestCard.vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

interface WorkRequest {
  client_request_id: number
  title: string
  description: string
  budget: number
}

const router = useRouter()
const works = ref<WorkRequest[]>([])
const loading = ref(true)

const userStore = useUserStore()
const isLoggedIn = computed(() => userStore.user !== null)
const userType = ref<number|null>(null)

async function getUserType() {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/user/type', {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    if (!response.ok) throw new Error(`Error ${response.status}`)
    const data = await response.json()
    userType.value = data.type
  } catch (error) {
    console.error(error)
  }
}

onMounted(async () => {
  try {
    if (isLoggedIn.value) getUserType()

    const response = await fetch('http://127.0.0.1:8000/api/clientrequests')
    const data = await response.json()
    works.value = data
  } catch (error) {
    console.error('Error fetching works:', error)
  } finally {
    loading.value = false
  }
})

function toCreateClientPost() {
  router.push('/createclientrequest')
}

//  manejar evento del hijo
function handleChildAction(payload: { id: number }) {
  works.value = works.value.filter(
    w => w.client_request_id !== payload.id
  )
}
</script>

<template>
  <div class="page-wrapper">

    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-left">
        <div class="hero-icon">🛠️</div>
        <div>
          <h1>Solicitudes de trabajo</h1>
          <p>Encuentra maestros confiables o publica una nueva solicitud.</p>
        </div>
      </div>

      <template v-if="isLoggedIn && userType === 1">
        <button @click="toCreateClientPost" class="create-btn">
          <span>＋</span> Publicar solicitud
        </button>
      </template>
    </section>

    <!-- Contenido principal -->
    <section class="content">

      <div v-if="loading" class="loading">
        <div class="loader"></div>
        <p>Cargando solicitudes...</p>
      </div>

      <div v-else-if="works.length === 0" class="empty">
        <p>No hay solicitudes registradas aún.</p>
      </div>

      <div v-else class="cards-grid">
        <WorkRequestCard
          v-for="work in works"
          :key="work.client_request_id"
          :work="work"
          @child-action="handleChildAction" 
        />
      </div>
    </section>

  </div>
</template>

<style scoped>

/* FONDO GENERAL */
.page-wrapper {
  min-height: 100vh;
  position: relative;
  background: #eef3f8;
  overflow: visible;
}

.bg-gradient {
  position: absolute;
  top: -200px;
  left: -150px;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: radial-gradient(circle, #51c3ff45, #009fe320);
  filter: blur(90px);
  z-index: 0;
}

/* 🌟 HERO */
.hero {
  max-width: 1200px;
  margin: 0 auto;
  margin-top: 40px;
  margin-bottom: 40px;

  padding: 28px 40px;
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(10px);
  border-radius: 18px;
  box-shadow: 0px 8px 26px rgba(0,0,0,0.08);

  display: flex;
  align-items: center;
  justify-content: space-between;

  position: relative;
  z-index: 2;

  animation: fadeUp 0.35s ease-out;
}

.hero-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.hero-icon {
  background: linear-gradient(135deg, #009FE3, #3BC3FF);
  color: white;
  width: 58px;
  height: 58px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 30px;
  box-shadow: 0px 6px 14px rgba(0,159,227,0.3);
}

.hero h1 {
  font-size: 32px;
  font-weight: 800;
  margin: 0;
  color: #1b1b1b;
}

.hero p {
  margin: 4px 0 0 0;
  font-size: 16px;
  color: #5a5a5a;
}

/* BOTÓN PUBLICAR */
.create-btn {
  background: #009FE3;
  color: white;
  border: none;
  padding: 14px 24px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;

  display: flex;
  align-items: center;
  gap: 10px;

  cursor: pointer;
  transition: 0.2s ease;
  box-shadow: 0px 6px 18px rgba(0,159,227,0.3);
}

.create-btn:hover {
  background: #007bb1;
  transform: translateY(-2px);
}

/* 📦 CONTENT */
.content {
  max-width: 1200px;
  margin: 0 auto;
  z-index: 2;
  position: relative;

  animation: fadeUp 0.45s ease-out;
}

/* LOADING */
.loading {
  text-align: center;
  margin-top: 80px;
}

.loader {
  width: 45px;
  height: 45px;
  border: 4px solid #d3d3d3;
  border-top-color: #009FE3;
  border-radius: 50%;
  margin: auto;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* EMPTY */
.empty {
  text-align: center;
  margin-top: 40px;
  font-size: 17px;
  color: #666;
}

/* GRID */
.cards-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 35px;
  margin-top: 30px;

  animation: fadeIn 0.4s ease-out;
}

/* ANIMACIONES */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
</style>
