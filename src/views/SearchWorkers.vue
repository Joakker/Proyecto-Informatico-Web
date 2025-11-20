<template>
  <div class="container mt-5">
    <h1 class="text-center mb-4">Buscar maestros</h1>

    <div class="card p-4 shadow mx-auto mb-4" style="max-width: 600px;">
      <!-- Select de categorías -->
      <div class="mb-3">
        <select v-model="category" class="form-control">
          <option value="">Seleccione una categoría</option>
          <option
            v-for="cat in categorias"
            :key="cat.category_id"
            :value="cat.name" 
          >
            {{ cat.name }}
          </option>
        </select>
      </div>

      <div class="mb-3">
        <input v-model="city" type="text" class="form-control" placeholder="Ciudad">
      </div>

      <div class="mb-3">
        <select v-model="region" class="form-control">
          <option value="">Selecciona una región</option>
          <option v-for="reg in regiones" :key="reg" :value="reg">
            {{ reg }}
          </option>
        </select>
      </div>

      <button class="btn btn-primary w-100" @click="searchWorkers">Buscar</button>
    </div>

    <!-- Resultados -->
    <div v-if="results.length > 0" class="results-list">
      <div v-for="worker in results" :key="worker.user_id" class="card mb-3 p-3 shadow">
        <h5>{{ worker.first_name }} {{ worker.last_name }}</h5>
        <p><strong>Dirección:</strong> {{ worker.address }}</p>
        <p><strong>Correo:</strong> {{ worker.email }}</p>
        <p>
          <strong>Categorías:</strong>
          <span v-for="(cat, index) in worker.workers?.categories ?? []" :key="cat.category_id">
            {{ cat.name }}<span v-if="index < (worker.workers?.categories?.length ?? 0) - 1">, </span>
          </span>
        </p>
      </div>
    </div>
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

// Cargar categorías al montar
onMounted(async () => {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/categories', { headers: { Accept: 'application/json' } })
    categorias.value = await res.json()
  } catch (err) {
    console.error('Error al cargar categorías', err)
  }
})

async function searchWorkers() {
  const params = new URLSearchParams()
  if (category.value) params.append('category', category.value) // enviamos el nombre
  if (city.value) params.append('city', city.value)
  if (region.value) params.append('region', region.value)

  try {
    const res = await fetch(`http://127.0.0.1:8000/api/search/workers?${params.toString()}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
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

