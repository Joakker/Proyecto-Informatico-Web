<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('');
const password = ref('');
const userStore = useUserStore()
const loading = ref(false)

async function EnterAccount() {
  loading.value = true
  const url = "http://127.0.0.1:8000/api/login";
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Validation errors:", result.message || result.errors || "Unknown error");
      throw new Error(`Response status: ${response.status}`);
    }

    userStore.setUser(result.user, result.token);
    localStorage.setItem('user', JSON.stringify(result.user))
    localStorage.setItem('token', result.token)

    router.push('/')
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="container d-flex justify-content-center align-items-center vh-100">
    <div class="card shadow p-4" style="max-width: 400px; width: 100%;">
      <h2 class="text-center mb-4">Iniciar Sesión🛠️</h2>

      <form @submit.prevent="EnterAccount">
        <div class="form-floating mb-3">
          <input
            v-model="email"
            type="email"
            class="form-control"
            id="email"
            placeholder="Correo electrónico"
            required
          >
          <label for="email">Correo electrónico</label>
        </div>

        <div class="form-floating mb-3">
          <input
            v-model="password"
            type="password"
            class="form-control"
            id="password"
            placeholder="Contraseña"
            required
          >
          <label for="password">Contraseña</label>
        </div>

        <button type="submit" class="btn btn-primary w-100 mb-3" :disabled="loading">
          {{ loading ? 'Cargando...' : 'Iniciar sesión' }}
        </button>

        <p class="text-center text-muted mb-0">
          ¿No tienes cuenta?
          <router-link to="/signup" class="text-decoration-none">Regístrate</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<style scoped>
.card {
  border-radius: 1rem;
  transition: transform 0.2s;
}
.card:hover {
  transform: translateY(-3px);
}
</style>

