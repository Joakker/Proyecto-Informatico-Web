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

    userStore.setUser(result.user);
    localStorage.setItem('user', JSON.stringify(result.user))
    console.log(result);
    router.push('/')
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <h1>Registro</h1>

  <div class="form">
    <form @submit.prevent="EnterAccount">

      <label for="email">Correo electrónico</label><br>
      <input v-model="email" type="email" id="email" name="email"><br>

      <label for="password">Contraseña</label><br>
      <input v-model="password" type="password" id="password" name="password"><br>

      <hr></hr>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Cargando...' : 'Iniciar sesión' }}
      </button>
    </form>
  </div>
</template>

<style scoped>
  .form {
    display: flex;
    justify-content: center;
  }

  h1 {
    display: flex;
    justify-content: center;
  }
</style>
