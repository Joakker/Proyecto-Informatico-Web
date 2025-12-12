<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import WorkRequestCard from '../components/WorkerRequestCard.vue'
import { useUserStore } from '@/stores/user'
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

    if (!response.ok) throw new Error(`Error ${response.status}`)

    const data = await response.json()
    userType.value = data.type
  } catch (error) {
    console.error(error)
  }
}

// Cargar anuncios de trabajadores
onMounted(async () => {
  try {
    getUserType()
    const response = await fetch('http://127.0.0.1:8000/api/workerrequests')
    const data = await response.json()
    works.value = data
  } catch (error) {
    console.error('Error fetching worker requests:', error)
  } finally {
    loading.value = false
  }
})

function toCreateWorkerPost() {
  router.push('/createworkerrequest')
}
</script>

<template>
  <div class="page-wrapper">
    <div class="bg-gradient"></div>

    <!-- HERO -->
    <section class="hero">
      <div class="hero-left">
        <div class="hero-icon">💼</div>
        <div>
          <h1>Anuncios de trabajadores</h1>
          <p>Explora a los maestros disponibles para contratar.</p>
        </div>
      </div>

      <!-- Solo trabajador o administrador puede crear anuncio -->
      <template v-if="isLoggedIn && (userType === 2 || userType === 3)">
        <button class="create-btn" @click="toCreateWorkerPost">
          Crear anuncio
        </button>
      </template>
    </section>

    <!-- CONTENIDO -->
    <section class="content">

      <div v-if="loading" class="loading">
        <div class="loader"></div>
        <p>Cargando anuncios...</p>
      </div>

      <template v-else>
        <p v-if="works.length === 0" class="empty">No hay anuncios disponibles.</p>

        <div v-else class="cards-grid">
          <WorkRequestCard
            v-for="work in works"
            :key="work.id"
            :work="work"
          />
        </div>
      </template>

    </section>
  </div>
</template>

<style scoped>

/* Contenedor general */
.page-wrapper {
  min-height: 100vh;
  position: relative;
  background: #eef3f8;
  overflow: visible;
}

/* Fondo degradado decorativo */
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

/* Sección superior (Hero) */
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

/* Área izquierda del hero */
.hero-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

/* Icono del hero */
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

/* Título y subtítulo */
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

/* Botón crear anuncio */
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

/* Contenedor principal del contenido */
.content {
  max-width: 1200px;
  margin: 0 auto;
  z-index: 2;
  position: relative;

  animation: fadeUp 0.45s ease-out;
}

/* Indicador de carga */
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

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Texto cuando no hay datos */
.empty {
  text-align: center;
  margin-top: 40px;
  font-size: 17px;
  color: #666;
}

/* Grid de tarjetas */
.cards-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 35px;
  margin-top: 30px;

  animation: fadeIn 0.4s ease-out;
}

/* Animaciones */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

</style>
