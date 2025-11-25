<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const title = ref('')
const description = ref('')
const budget = ref<number|null>(null)
const street = ref('')
const city = ref('')
const region = ref('')
const country = ref('Chile')
const postalCode = ref('')

//nuevo para seleccionar y guardar categoría
const categories = ref<{ category_id: number; name: string }[]>([]);
const selectedCategory = ref<number | null>(null);

const router = useRouter()

const fullAddress = computed(() => {
  return `${street.value}, ${city.value}, ${region.value}, ${country.value}, ${postalCode.value}`
})

const mapsEmbedUrl = computed(() => {
  const apiKey = import.meta.env.VITE_SECRET_KEY;
  console.log(apiKey);
  return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(fullAddress.value)}`
})

//para categorías
async function getCategories() {
  const res = await fetch('http://127.0.0.1:8000/api/categories', {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    }
  })
  categories.value = await res.json()
}

onMounted(() => {
  getCategories()
})

async function submitJob() {
    if (!selectedCategory.value) {
        selectedCategory.value = null;
    }
    const response = await fetch('http://127.0.0.1:8000/api/create-client-request', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
            title: title.value,
            description: description.value,
            budget: budget.value,
            street: street.value,
            city: city.value,
            region: region.value,
            category_id: selectedCategory.value,
        }),
    })
    router.push('/clientrequests')
}
</script>

<template>
  <div class="container my-5">
    <div class="card shadow-sm p-4">
      <h2 class="mb-4 text-center">Publicar trabajo</h2>
      <form @submit.prevent="submitJob" class="row g-3">

        <!-- Título y Descripción -->
        <div class="col-12">
          <label class="form-label">Título del trabajo</label>
          <input v-model="title" type="text" class="form-control" required />
        </div>

        <div class="col-12">
          <label class="form-label">Descripción</label>
          <textarea v-model="description" rows="4" class="form-control" required></textarea>
        </div>

        <div class="col-md-6">
          <label class="form-label">Presupuesto (CLP)</label>
          <input v-model.number="budget" type="number" min="0" class="form-control" required />
        </div>

        <div class="col-md-6">
          <label class="form-label">Categoría</label>
          <select v-model="selectedCategory" class="form-select">
            <option value="" disabled>Seleccione una categoría</option>
            <option v-for="cat in categories" :key="cat.category_id" :value="cat.category_id">
              {{ cat.name }}
            </option>
          </select>
        </div>

        <!-- Dirección -->
        <h4 class="mt-3">Dirección</h4>

        <div class="col-md-6">
          <label class="form-label">Calle</label>
          <input v-model="street" type="text" class="form-control" required />
        </div>

        <div class="col-md-6">
          <label class="form-label">Ciudad</label>
          <input v-model="city" type="text" class="form-control" required />
        </div>

        <div class="col-md-6">
          <label class="form-label">Región</label>
          <input v-model="region" type="text" class="form-control" required />
        </div>

        <div class="col-md-6">
          <label class="form-label">País</label>
          <input v-model="country" type="text" class="form-control" required />
        </div>

        <div class="col-md-6">
          <label class="form-label">Código postal</label>
          <input v-model="postalCode" type="text" class="form-control" />
        </div>

        <!-- Google Maps -->
        <div v-if="street || city || region" class="col-12 text-center mt-3">
          <iframe
            :src="mapsEmbedUrl"
            width="100%"
            height="300"
            style="border:0;"
            allowfullscreen
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade">
          </iframe>
        </div>

        <!-- Botón enviar -->
        <div class="col-12 text-center mt-4">
          <button type="submit" class="btn btn-primary btn-lg">Publicar trabajo</button>
        </div>

      </form>
    </div>
  </div>
</template>

<style scoped>
.card {
  border-radius: 12px;
}

h2, h4 {
  font-weight: 600;
}
</style>

