<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const fname = ref('')
const lname = ref('')
const phone = ref('')
const street = ref('')
const city = ref('')
const region = ref('')

// lista de regiones válidas
const regiones = [
  'Arica y Parinacota',
  'Tarapacá',
  'Antofagasta',
  'Atacama',
  'Coquimbo',
  'Valparaíso',
  'Metropolitana',
  'O’Higgins',
  'Maule',
  'Ñuble',
  'Biobío',
  'Araucanía',
  'Los Ríos',
  'Los Lagos',
  'Aysén',
  'Magallanes'
]
//const address = ref('')
const email = ref('')
const password = ref('')
const pick = ref<number | null>(null)
const cliente = 1
const maestro = 2

async function CreateAccount() {
  if (!fname.value || !lname.value || !phone.value || !street.value || !city.value || !region.value || !email.value || !password.value || !pick.value) {
    alert('Por favor completa todos los campos.')
    return
  }

  const address = `${street.value}, ${city.value}, ${region.value}`

  const url = "http://127.0.0.1:8000/api/signup"
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        fname: fname.value,
        lname: lname.value,
        phone: phone.value,
        address: address,
        email: email.value,
        password: password.value,
        type: pick.value
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Validation errors:", errorData.error)
      throw new Error(`Response status: ${response.status}`)
    }

    await response.json()
    router.push('/')
  } catch (error) {
    console.error(error)
    alert('Error al crear la cuenta. Revisa la consola.')
  }
}
</script>

<template>
  <div class="container mt-5">
    <h1 class="text-center mb-4">Registro Maestro Chasquilla</h1>

    <div class="card p-4 shadow mx-auto" style="max-width: 500px;">
      <form @submit.prevent="CreateAccount">

        <!-- Inputs Bootstrap -->
        <input v-model="fname" type="text" class="form-control mb-3" placeholder="Nombre">
        <input v-model="lname" type="text" class="form-control mb-3" placeholder="Apellido">
        <input v-model="phone" type="text" class="form-control mb-3" placeholder="Teléfono">
        <input v-model="street" type="text" class="form-control mb-3" placeholder="Calle">
        <input v-model="city" type="text" class="form-control mb-3" placeholder="Ciudad">
        <select v-model="region" class="form-control mb-3">
          <option value="">Seleccione una región</option>
          <option v-for="r in regiones" :key="r" :value="r">{{ r }}</option>
        </select>
        <input v-model="email" type="email" class="form-control mb-3" placeholder="Correo electrónico">
        <input v-model="password" type="password" class="form-control mb-3" placeholder="Contraseña">

        <!-- Selección Cliente/Trabajador como tarjetas -->
        <div class="d-flex justify-content-between mb-3">
          <div 
            class="card p-3 text-center w-50 me-2 cursor-pointer"
            :class="pick === cliente ? 'border-primary shadow' : 'border-light'"
            @click="pick = cliente"
          >
            <i class="bi bi-person-circle fs-1 text-primary"></i>
            <div class="fw-bold mt-2">Cliente</div>
            <div class="text-muted small">Necesito encontrar un trabajador</div>
          </div>

          <div 
            class="card p-3 text-center w-50 ms-2 cursor-pointer"
            :class="pick === maestro ? 'border-primary shadow' : 'border-light'"
            @click="pick = maestro"
          >
            <i class="bi bi-hammer fs-1 text-primary"></i>
            <div class="fw-bold mt-2">Trabajador</div>
            <div class="text-muted small">Necesito encontrar trabajo</div>
          </div>
        </div>

        <button type="submit" class="btn btn-primary w-100 mt-3">Crear cuenta</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.cursor-pointer {
  cursor: pointer;
  transition: transform 0.15s ease-in-out;
}
.cursor-pointer:hover {
  transform: scale(1.03);
}
</style>

