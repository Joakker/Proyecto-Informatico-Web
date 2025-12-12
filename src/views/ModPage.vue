<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();
const isLoggedIn = computed(() => userStore.user !== null);

const userType = ref<number | null>(null);

// Obtiene el tipo de usuario: 1 cliente, 2 maestro, 3 moderador
async function getUserType() {
  const res = await fetch("http://127.0.0.1:8000/api/user/type", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  userType.value = (await res.json()).type;
}

onMounted(() => {
  if (isLoggedIn.value) getUserType();
});
</script>

<template>
  <!-- BLOQUEO A NO-MODERADORES -->
  <template v-if="userType !== 3">
    <div class="denied">
      <div class="denied-card">
        <h2>No tienes permiso para acceder 🛑</h2>
        <p>Solo los moderadores pueden entrar al panel administrativo.</p>
      </div>
    </div>
  </template>

  <!-- PANEL PRINCIPAL -->
  <template v-else>
    <div class="admin-wrapper">

      <!-- HERO -->
      <section class="hero">
        <div class="hero-left">
          <div class="hero-icon">🛠️</div>
          <div>
            <h1>Panel Administrativo</h1>
            <p>Selecciona la sección que deseas gestionar.</p>
          </div>
        </div>
      </section>

      <!-- OPCIONES -->
      <div class="admin-links">
        <router-link to="/admin/requests" class="admin-btn">📄 Solicitudes</router-link>
        <router-link to="/admin/users" class="admin-btn">👥 Usuarios</router-link>
        <router-link to="/admin/tickets" class="admin-btn">🎫 Tickets</router-link>
      </div>

    </div>
  </template>
</template>

<style scoped>
@import "./ModPageStyles.css";

/* ESTILOS SOLO PARA ESTA VISTA */

.admin-links {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 400px;
  margin: 0 auto;
}

.admin-btn {
  display: block;
  text-align: center;
  padding: 15px 20px;
  background: #009fe3;
  color: white;
  border-radius: 12px;
  font-weight: 600;
  text-decoration: none;
  font-size: 18px;
  box-shadow: 0 5px 16px rgba(0, 159, 227, 0.30);
  transition: 0.2s ease;
}

.admin-btn:hover {
  background: #007bb3;
  transform: translateY(-2px);
}

/* DENIED VIEW */
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

.denied-card h2 {
  margin-bottom: 10px;
}

</style>
