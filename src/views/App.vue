<template>
  <div class="app-root d-flex flex-column min-vh-100">

    <!-- NAVBAR -->
    <nav class="navbar navbar-expand-lg enhanced-navbar px-4">
      <div class="container-fluid d-flex align-items-center justify-content-between">

        <!-- LOGO SOLO -->
        <div class="d-flex align-items-center brand-area">
          <img src="/logo2.png" alt="Logo Maestro Chasquilla" class="brand-logo" />
        </div>

        <!-- LINKS -->
        <div class="d-flex align-items-center gap-3 nav-links">
          <router-link to="/" class="nav-link-custom">Inicio</router-link>
          <router-link to="/clientrequests" class="nav-link-custom">Trabajos</router-link>
          <router-link to="/workerrequests" class="nav-link-custom">Trabajadores</router-link>
          <router-link to="/search-workers" class="nav-link-custom">Buscar maestro</router-link>
          <router-link to="/work-chats" class="nav-link-custom">Chats de trabajo</router-link>
          <router-link to="/my-works" class="nav-link-custom">Dejar reseña</router-link>
          <template v-if="isLoggedIn && userType !== 3">
            <router-link to="/support" class="nav-link-custom">Soporte</router-link>
          </template>

          <template v-if="isLoggedIn && userType === 3">
            <router-link to="/modpage" class="nav-link-custom">Moderación</router-link>
          </template>
        </div>

        <!-- BOTONES -->
        <div class="d-flex align-items-center gap-2">

          <!-- LOGGED -->
          <template v-if="isLoggedIn">
            <router-link to="/profile" class="btn btn-outline-light modern-btn">Perfil</router-link>
            <button @click="logout" class="btn btn-light modern-btn">Cerrar sesión</button>
          </template>

          <!-- NOT LOGGED -->
          <template v-else>
            <router-link to="/login" class="btn btn-outline-light modern-btn">Iniciar sesión</router-link>
            <router-link to="/signup" class="btn btn-primary hero-btn-main">Registrarse</router-link>
          </template>

        </div>
      </div>
    </nav>

    <!-- MAIN -->
    <main class="flex-grow-1">
      <router-view />
    </main>

    <!-- FOOTER -->
    <footer class="enhanced-footer text-center py-4 mt-auto">
      <small>Maestro Chasquilla 2025 © Todos los derechos reservados</small>
    </footer>

  </div>
</template>


<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const isLoggedIn = computed(() => userStore.user !== null)
const router = useRouter()
const userType = ref<number | null>(null)

function logout() {
  userStore.logout()
  localStorage.removeItem('user')
  localStorage.removeItem('token')
  router.push('/')
}

async function getUserType() {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/user/type', {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    if (!response.ok) throw new Error(`Error ${response.status}`)
    const data = await response.json()
    userType.value = data.type
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  if (isLoggedIn.value) getUserType()
})
</script>

<style scoped>
/* ---------------- NAVBAR ---------------- */

.enhanced-navbar {
  background:
    linear-gradient(0deg, rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.65)),
    url('/wood.jpg');
  background-size: stretch;
  background-position: center;
  border-bottom: 1px solid rgba(255,255,255,0.2);
  padding-top: 0.6rem;
  padding-bottom: 0.6rem;
  top: 0;
  z-index: 1050;
}


.enhanced-navbar::before {
  display: none !important;
}

/* LOGO */
.brand-logo {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
}

/* LINKS */
.nav-link-custom {
  color: #dbeafe;
  text-decoration: none;
  font-weight: 500;
  padding: 0.35rem 0.6rem;
  transition: 0.2s ease;
}

.nav-link-custom:hover {
  color: #4cb0e8;
}

/* BOTONES */
.modern-btn {
  padding: 0.45rem 1rem;
  font-weight: 600;
  border-radius: 8px;
  font-size: 0.9rem;
}

.primary-btn {
  background: #4cb0e8 !important;
  color: #0a1f33 !important;
  border: none;
}

.primary-btn:hover {
  background: #6cc9ff !important;
}

/* FOOTER */
.enhanced-footer {
  background: #f5f7fa;
  border-top: 1px solid #e5e7eb;
  color: #475569;
  font-size: 0.9rem;
}

/* MAIN */
main {
  padding: 0;
}
</style>
