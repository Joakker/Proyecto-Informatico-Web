<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";

const router = useRouter();
const userStore = useUserStore();
const isLoggedIn = computed(() => userStore.user !== null);
const userType = ref<number | null>(null);

// Campos del formulario
const fname = ref("");
const lname = ref("");
const phone = ref("");
const street = ref("");
const city = ref("");
const region = ref("");
const email = ref("");
const password = ref("");

const regiones = [
  "Arica y Parinacota","Tarapacá","Antofagasta","Atacama",
  "Coquimbo","Valparaíso","Metropolitana","O’Higgins",
  "Maule","Ñuble","Biobío","Araucanía",
  "Los Ríos","Los Lagos","Aysén","Magallanes"
];

// Obtener tipo de usuario
async function getUserType() {
  const res = await fetch("http://127.0.0.1:8000/api/user/type", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  userType.value = (await res.json()).type;
}

onMounted(() => {
  if (isLoggedIn.value) getUserType();
});

function goBack() {
  router.push("/modpage");
}

async function createModerator() {
  if (!fname.value || !lname.value || !phone.value || !street.value || !city.value || !region.value || !email.value || !password.value) {
    alert("Completa todos los campos.");
    return;
  }

  const body = {
    fname: fname.value,
    lname: lname.value,
    phone: phone.value,
    address: `${street.value}, ${city.value}, ${region.value}`,
    email: email.value,
    password: password.value,
    type: 3 // moderador fijo
  };

  try {
    const res = await fetch("http://127.0.0.1:8000/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      alert("Error al crear moderador.");
      return;
    }

    alert("Moderador creado con éxito ✔");
    router.push("/modpage");

  } catch (error) {
    alert("Error inesperado.");
    console.error(error);
  }
}
</script>

<template>
  <div class="page-wrapper">

    <!-- BLOQUEO A NO ADMIN -->
    <div v-if="userType !== 3" class="denied">
      <div class="denied-card">
        <h2>No tienes permiso 🛑</h2>
        <p>Solo los moderadores pueden crear otros moderadores.</p>
      </div>
    </div>

    <!-- FORMULARIO -->
    <div v-else>

      <!-- HERO -->
      <section class="hero">
        <div class="hero-left">
          <div class="hero-icon">🤖</div>
          <div>
            <h1>Crear nuevo moderador</h1>
            <p>Agrega usuarios con permisos administrativos.</p>
          </div>
        </div>

        <div class="hero-actions">
          <button class="back-btn" @click="goBack">Volver</button>
        </div>
      </section>

      <!-- FORM CONTENT -->
      <section class="content">

        <div class="form-card">
          <form @submit.prevent="createModerator">

            <div class="row">
              <input v-model="fname" placeholder="Nombre" />
              <input v-model="lname" placeholder="Apellido" />
            </div>

            <div class="row">
              <input v-model="phone" placeholder="Teléfono" />
            </div>

            <div class="row">
              <input v-model="street" placeholder="Calle" />
              <input v-model="city" placeholder="Ciudad" />
            </div>

            <select v-model="region">
              <option value="">Selecciona región</option>
              <option v-for="r in regiones" :key="r">{{ r }}</option>
            </select>

            <input v-model="email" type="email" placeholder="Correo electrónico" />
            <input v-model="password" type="password" placeholder="Contraseña" />

            <button class="submit-btn">Crear moderador</button>

          </form>
        </div>

      </section>

    </div>

  </div>
</template>

<style scoped>
.page-wrapper {
  min-height: 100vh;
  background: #eef3f8;
  padding: 45px 25px;
}

/* ----------------------------- HERO ----------------------------- */

.hero {
  max-width: 1200px;
  margin: 0 auto 40px auto;
  padding: 28px 40px;

  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  border-radius: 18px;
  box-shadow: 0px 8px 26px rgba(0, 0, 0, 0.08);

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 25px;

  animation: fadeUp 0.35s ease-out;
}

.hero-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.hero-icon {
  background: linear-gradient(135deg, #009FE3, #3BC3FF);
  width: 58px;
  height: 58px;
  border-radius: 16px;

  display: flex;
  justify-content: center;
  align-items: center;
  color: white;

  font-size: 28px;
  box-shadow: 0px 6px 14px rgba(0, 159, 227, 0.3);
}

.hero h1 {
  margin: 0;
  font-size: 32px;
  font-weight: 800;
}

.hero p {
  margin: 4px 0 0;
  color: #5a5a5a;
}

.hero-actions {
  display: flex;
  align-items: center;
  gap: 18px;
}

.back-btn {
  padding: 10px 16px;
  background: transparent;
  border: 2px solid #009fe3;
  color: #009fe3;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.25s ease;
}
.back-btn:hover {
  background: #009fe3;
  color: white;
  box-shadow: 0 4px 12px rgba(0,159,227,0.35);
}

/* ----------------------------- FORM ----------------------------- */

.content {
  max-width: 900px;
  margin: auto;
  animation: fadeUp 0.45s ease-out;
}

.form-card {
  padding: 35px;
  background: white;
  border-radius: 18px;
  box-shadow: 0 8px 26px rgba(0,0,0,0.08);
}

form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.row {
  display: flex;
  gap: 16px;
}

input, select {
  flex: 1;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid #cfd9e3;
  background: #f7f9fc;
  transition: 0.25s ease;
  font-size: 15px;
}
input:focus, select:focus {
  outline: none;
  border-color: #009fe3;
  box-shadow: 0 0 8px rgba(0,159,227,0.3);
}

.submit-btn {
  background: #009fe3;
  color: white;
  padding: 12px;
  border-radius: 12px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: 0.25s ease;
}
.submit-btn:hover {
  background: #007bb3;
  box-shadow: 0 5px 16px rgba(0,159,227,0.4);
}

/* ----------------------------- ACCESS DENIED ----------------------------- */

.denied {
  display: flex;
  justify-content: center;
  margin-top: 80px;
}

.denied-card {
  background: white;
  padding: 40px;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 8px 30px rgba(0,0,0,0.08);
  max-width: 500px;
}

/* ----------------------------- ANIM ----------------------------- */

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
