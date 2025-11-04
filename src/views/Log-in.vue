<script setup lang="ts">
import { ref } from 'vue';

const email = ref('');
const password = ref('');

async function EnterAccount() {
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

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Validation errors:", errorData.error);
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    console.log(result);
    window.location.href = "http://localhost:5173/";
  } catch (error) {
    console.error(error);
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

      <button type="submit">Iniciar sesión</button>
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
