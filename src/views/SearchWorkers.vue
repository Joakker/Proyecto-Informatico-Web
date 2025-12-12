<template>
  <div class="page-wrapper">

    <!-- HERO -->
    <section class="hero">
      <div class="hero-left">
        <div class="hero-icon">🔍</div>
        <div>
          <h1>Buscar maestros</h1>
          <p>Encuentra profesionales según categoría y ubicación.</p>
        </div>
      </div>
    </section>

    <!-- FILTROS -->
    <div class="filter-card">
      <h3 class="filter-title">Filtrar búsqueda</h3>

      <div class="filter-grid">

        <!-- Categoría -->
        <div class="input-group">
          <label>Categoría</label>
          <select v-model="category" class="input-control">
            <option value="">Seleccione una categoría</option>
            <option v-for="cat in categorias" :key="cat.category_id" :value="cat.name">
              {{ cat.name }}
            </option>
          </select>
        </div>

        <!-- Ciudad -->
        <div class="input-group">
          <label>Ciudad</label>
          <input v-model="city" type="text" class="input-control" placeholder="Ej: Concepción" />
        </div>

        <!-- Región -->
        <div class="input-group">
          <label>Región</label>
          <select v-model="region" class="input-control">
            <option value="">Seleccione una región</option>
            <option v-for="reg in regiones" :key="reg" :value="reg">
              {{ reg }}
            </option>
          </select>
        </div>

      </div>

      <button class="search-btn" @click="searchWorkers">
        Buscar maestros
      </button>
    </div>

    <!-- RESULTADOS -->
    <section class="results">
      <h3 v-if="results.length > 0" class="results-count">
        {{ results.length }} maestro(s) encontrado(s)
      </h3>

      <div v-if="results.length > 0" class="cards-grid">
        <div
          v-for="worker in results"
          :key="worker.user_id"
          class="worker-card"
        >
          <div class="worker-header">
            <div class="avatar">{{ worker.first_name[0] }}</div>
            <div>
              <h4>{{ worker.first_name }} {{ worker.last_name }}</h4>
              <p class="worker-location">{{ worker.address }}</p>
            </div>
          </div>

          <p class="worker-email">📧 {{ worker.email }}</p>
          <p class="worker-phone">📞 {{ worker.phone_number }}</p>
          <p class="worker-categories">
            <strong>Categorías:</strong><br>
            <span
              v-for="(cat, index) in worker.workers?.categories ?? []"
              :key="cat.category_id"
            >
              {{ cat.name }}<span v-if="index < worker.workers.categories.length - 1">, </span>
            </span>
          </p>
        </div>
      </div>

      <p v-else class="no-results">No se encontraron maestros con los filtros aplicados.</p>
    </section>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Category {
  category_id: number
  name: string
}

interface WorkerCategory {
  category_id: number
  name: string
}

interface WorkerInfo {
  user_id: number
  first_name: string
  last_name: string
  address: string
  email: string
  phone_number: string
  workers: { categories: WorkerCategory[] } | null
}

const results = ref<WorkerInfo[]>([])
const categorias = ref<Category[]>([])
const category = ref('')
const city = ref('')
const region = ref('')

const regiones = [
  "Arica y Parinacota", "Tarapacá", "Antofagasta", "Atacama",
  "Coquimbo", "Valparaíso", "Metropolitana de Santiago",
  "O’Higgins", "Maule", "Ñuble", "Biobío", "La Araucanía",
  "Los Ríos", "Los Lagos", "Aysén", "Magallanes"
]

onMounted(async () => {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/categories', {
      headers: { Accept: 'application/json' }
    })
    categorias.value = await res.json()
  } catch (err) {
    console.error('Error al cargar categorías', err)
  }
})

async function searchWorkers() {
  const params = new URLSearchParams()
  if (category.value) params.append('category', category.value)
  if (city.value) params.append('city', city.value)
  if (region.value) params.append('region', region.value)

  try {
    const res = await fetch(`http://127.0.0.1:8000/api/search/workers?${params.toString()}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    results.value = await res.json()
  } catch (err) {
    console.error(err)
    results.value = []
    alert('Ocurrió un error al buscar maestros.')
  }
}
</script>

<style scoped>

.page-wrapper {
  padding: 40px 0;
  min-height: 100vh;
  background: #eef3f8;
}

/* HERO */
.hero {
  max-width: 1200px;
  margin: 0 auto 30px auto;
  background: white;
  border-radius: 16px;
  padding: 22px 30px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.06);
  display: flex;
  align-items: center;
  gap: 18px;
}

.hero-icon {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  background: linear-gradient(135deg, #009fe3, #3bc3ff);
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 32px;
}

.hero h1 {
  margin: 0;
  font-weight: 800;
  font-size: 28px;
}

.hero p {
  margin: 3px 0 0 0;
  color: #666;
}

/* FILTROS */
.filter-card {
  max-width: 800px;
  margin: auto;
  padding: 25px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
}

.filter-title {
  margin-bottom: 18px;
  font-weight: 700;
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 18px;
}

.input-group {
  display: flex;
  flex-direction: column;
}

.input-group label {
  font-weight: 600;
  margin-bottom: 6px;
}

.input-control {
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #ccd6e3;
}

.search-btn {
  width: 100%;
  margin-top: 18px;
  padding: 14px;
  background: #009fe3;
  color: white;
  font-weight: 700;
  border: none;
  border-radius: 12px;
  transition: 0.2s;
  cursor: pointer;
}

.search-btn:hover {
  background: #007bb1;
}

/* RESULTADOS */
.results {
  max-width: 1000px;
  margin: 40px auto;
}

.results-count {
  font-weight: 700;
  margin-bottom: 20px;
}

.cards-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 25px;
}

.worker-card {
  flex: 1 1 300px;
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.07);
}

.worker-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 10px;
}

.avatar {
  width: 55px;
  height: 55px;
  border-radius: 50%;
  background: #009fe3;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 700;
}

.worker-location {
  color: #666;
  font-size: 14px;
}

.worker-email {
  margin: 10px 0;
}

.worker-phone {
  margin: 8px 0;
  font-weight: 500;
  color: #1f2937;
}


.worker-categories {
  font-size: 14px;
  line-height: 1.4;
}

.no-results {
  text-align: center;
  color: #666;
}
</style>
