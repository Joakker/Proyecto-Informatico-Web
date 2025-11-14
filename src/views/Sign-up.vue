<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router'

const router = useRouter()
const fname = ref('');
const lname = ref('');
const phone = ref('');
const address = ref('');
const email = ref('');
const password = ref('');
const pick = ref('');
const cliente = 1
const maestro = 2

async function CreateAccount() {
  const url = "http://127.0.0.1:8000/api/signup";
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        fname: fname.value,
        lname: lname.value,
        phone: phone.value,
        address: address.value,
        email: email.value,
        password: password.value,
        type: pick.value
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Validation errors:", errorData.error);
      console.error("tipo em browser es ", pick.value);
      console.error("tipo em sv es ", errorData.tipo);
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    
    router.push('/')
  } catch (error) {
    console.error(error);
  }
}
</script>

<template>
  <h1>Registro</h1>

  <div class="form">
    <form @submit.prevent="CreateAccount">
      <label for="fname">Nombre</label><br>
      <input v-model="fname" type="text" id="fname" name="fname"><br>

      <label for="lname">Apellido</label><br>
      <input v-model="lname" type="text" id="lname" name="lname"><br>

      <label for="pnumber">Teléfono</label><br>
      <input v-model="phone" type="text" id="pnumber" name="pnumber"><br>

      <label for="address">Dirección</label><br>
      <input v-model="address" type="text" id="address" name="address"><br>

      <label for="email">Correo electrónico</label><br>
      <input v-model="email" type="email" id="email" name="email"><br>

      <label for="password">Contraseña</label><br>
      <input v-model="password" type="password" id="password" name="password"><br>

      <div style="margin: 2rem;"></div>

      <input type="radio" v-model="pick" :value="cliente" id="cliente" />
      <label for="cliente">Necesito encontrar un trabajador</label><br>

      <input type="radio" v-model="pick" :value="maestro" id="maestro" />
      <label for="maestro">Necesito encontrar trabajo</label><br>
      <hr></hr>

      <button type="submit">Crear cuenta</button>
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
