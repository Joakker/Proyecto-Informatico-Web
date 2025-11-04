<script setup lang="ts">
import { ref } from 'vue';

const fname = ref('');
const lname = ref('');
const phone = ref('');
const address = ref('');
const email = ref('');
const password = ref('');

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
  <form @submit.prevent="CreateAccount">
    <label for="fname">First name:</label><br>
    <input v-model="fname" type="text" id="fname" name="fname"><br>

    <label for="lname">Last name:</label><br>
    <input v-model="lname" type="text" id="lname" name="lname"><br>

    <label for="pnumber">Phone number:</label><br>
    <input v-model="phone" type="text" id="pnumber" name="pnumber"><br>

    <label for="address">Address:</label><br>
    <input v-model="address" type="text" id="address" name="address"><br>

    <label for="email">Email:</label><br>
    <input v-model="email" type="email" id="email" name="email"><br>

    <label for="password">Password:</label><br>
    <input v-model="password" type="password" id="password" name="password"><br>

    <button type="submit">Crear cuenta</button>
  </form>
</template>

<style scoped></style>
