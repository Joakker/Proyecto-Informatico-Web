<template>
  <div class="app-root d-flex flex-column min-vh-100">

    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-light custom-navbar px-4">
      <div class="container-fluid d-flex align-items-center justify-content-between">

        <!-- Logo + Links -->
        <div class="d-flex align-items-center gap-3">
          <router-link to="/">
            <img src="/logo.png" alt="Logo Maestro Chasquilla" width="50" height="50" class="me-2 rounded-circle">
          </router-link>

          <router-link to="/" class="nav-link">Home</router-link>
          <router-link to="/clientrequests" class="nav-link">Trabajos</router-link>
          <router-link to="/workerrequests" class="nav-link">Trabajadores</router-link>
          <router-link to="/search-workers" class="nav-link">Buscar maestro</router-link>
          <template v-if="isLoggedIn && userType === 3">
            <router-link to="/modpage" class="nav-link">Moderación</router-link>
          </template>
        </div>

        <!-- Botones login/perfil -->
        <div class="d-flex align-items-center gap-2">
          <template v-if="isLoggedIn">
            <router-link to="/profile" class="btn custom-btn btn-sm">Perfil</router-link>
            <button @click="logout" class="btn custom-btn btn-sm">Cerrar sesión</button>
          </template>
          <template v-else>
            <router-link to="/login" class="btn custom-btn btn-sm">Iniciar sesión</router-link>
            <router-link to="/signup" class="btn custom-btn btn-sm">Registrarse</router-link>
          </template>
        </div>

      </div>
    </nav>

    <!-- Main content -->
    <main class="flex-grow-1">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="custom-footer text-center py-3 mt-auto">
      <div class="d-flex flex-column align-items-center">
        <small>Maestro Chasquilla 2025 © Todos los derechos reservados</small>
      </div>
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
const userType = ref<number|null>(null)

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
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
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
  if (isLoggedIn.value) {
    getUserType()
  }
})
</script>

<style scoped>
/* Navbar links */
.nav-link {
  color: rgba(0, 0, 0, 0.763);
  text-decoration: none;
  font-weight: 500;
}
.nav-link:hover {
  text-decoration: underline;
}

/* Custom navbar color */
.custom-navbar {
  background-color: rgba(252, 252, 39, 0.689); /* amarillo cálido */
}

/* Custom footer color */
.custom-footer {
  background-color: rgba(252, 252, 39, 0.689);
}

/* Main content padding */
main {
  padding: 1rem;
}

/* Footer logo redondo */
footer img {
  border-radius: 50%;
}

.custom-btn {
  background-color: #234d60; 
  color: white;              
  border: none;              
}

.custom-btn:hover {
  background-color: #2a74c2; 
}
</style>

<style>
html, body {
  margin: 0;
  padding: 0;
  background-color: white;
}
</style>
