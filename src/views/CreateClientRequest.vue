<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const title = ref('')
const description = ref('')
const budget = ref<number|null>(null)
const street = ref('')
const city = ref('')
const region = ref('')
const country = ref('Chile')
const postalCode = ref('')

const router = useRouter()
// Construir la dirección completa
const fullAddress = computed(() => {
  return `${street.value}, ${city.value}, ${region.value}, ${country.value}, ${postalCode.value}`
})

// URL para Google Maps Embed API
const mapsEmbedUrl = computed(() => {
  const apiKey = ' '
  return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(fullAddress.value)}`
})

async function submitJob() {
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
        }),
        }
    )
    router.push('/clientrequests')
}

</script>

<template>
  <form @submit.prevent="submitJob">
    <h2>Publicar trabajo</h2>

    <label>Título del trabajo</label>
    <input v-model="title" type="text" required />

    <label>Descripción</label>
    <textarea v-model="description" rows="4" required></textarea>

    <label>Presupuesto (CLP)</label>
    <input v-model.number="budget" type="number" min="0" required />

    <h3>Dirección</h3>
    <label>Calle</label>
    <input v-model="street" type="text" required />

    <label>Ciudad</label>
    <input v-model="city" type="text" required />

    <label>Región</label>
    <input v-model="region" type="text" required />

    <label>País</label>
    <input v-model="country" type="text" required />

    <label>Código postal</label>
    <input v-model="postalCode" type="text" />

    <div v-if="street || city || region" class="form-google-maps">
        <iframe
        :src="mapsEmbedUrl"
        width="600"
        height="450"
        style="border:0;"
        allowfullscreen="false"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade">
        </iframe>
    </div>

    <button type="submit">Publicar trabajo</button>
  </form>

</template>

<style scoped>

h2 {
    margin-top: 2rem;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 600px;
  margin: auto;
}
input, textarea {
  padding: 0.5rem;
  font-size: 1rem;
}
button {
    margin-bottom: 2rem;
    padding: 0.75rem;
    font-weight: bold;
    background-color: #2c3e50;
    color: white;
    border: none;
    cursor: pointer;
}
iframe {
  margin-top: 1rem;
}
.form-google-maps {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
