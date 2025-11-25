<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { computed, onMounted, ref } from 'vue'

const userStore = useUserStore()
const isLoggedIn = computed(() => userStore.user !== null)

const userType = ref<number | null>(null)
const userInfo = ref<any>()

async function getUserType() {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/user/type', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    if (!response.ok) throw new Error(`Error ${response.status}`)
    userType.value = (await response.json()).type
  } catch (error) {
    console.error(error)
  }
}

async function getUserInfo() {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/user', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    if (!response.ok) throw new Error(`Error ${response.status}`)
    userInfo.value = await response.json()
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  if (isLoggedIn.value) {
    getUserType()
    getUserInfo()
  }
})
</script>

<template>
  <div class="home-page">

    <!-- HERO -->
    <section class="hero">
      <div class="hero-overlay"></div>
      <div class="container-lg hero-inner">
        <div class="row align-items-center">

          <!-- TEXTO -->
          <div class="col-lg-7 hero-text">
            <p class="hero-pill">🔧 Plataforma para conectar clientes con maestros confiables</p>

            <h1 class="hero-title">
              <span v-if="isLoggedIn">
                Hola, {{ userInfo?.first_name || 'usuario' }} 👋
              </span>
              <span v-else>
                Encuentra al maestro ideal para tu próximo proyecto
              </span>
            </h1>

            <p class="hero-subtitle">
              Publica trabajos, recibe postulaciones y coordina tus proyectos sin complicaciones.
            </p>

            <!-- CTA SEGÚN TIPO DE USUARIO -->
            <div class="hero-cta d-flex flex-wrap gap-3 mt-3">

              <!-- Cliente -->
              <template v-if="isLoggedIn && userType === 1">
                <router-link to="/search-workers" class="btn btn-primary hero-btn-main">Buscar maestro</router-link>
                <router-link to="/clientrequests" class="btn btn-outline-light hero-btn-secondary">Ver mis trabajos</router-link>
              </template>

              <!-- Maestro -->
              <template v-else-if="isLoggedIn && userType === 2">
                <router-link to="/clientrequests" class="btn btn-primary hero-btn-main">Ver trabajos disponibles</router-link>
                <router-link to="/profile" class="btn btn-outline-light hero-btn-secondary">Mejorar mi perfil</router-link>
              </template>

              <!-- Moderador -->
              <template v-else-if="isLoggedIn && userType === 3">
                <router-link to="/modpage" class="btn btn-primary hero-btn-main">Panel de moderación</router-link>
                <router-link to="/support" class="btn btn-outline-light hero-btn-secondary">Tickets de soporte</router-link>
              </template>

              <!-- Invitado -->
              <template v-else>
                <router-link to="/signup" class="btn btn-primary hero-btn-main">Crear cuenta gratis</router-link>
                <router-link to="/login" class="btn btn-outline-light hero-btn-secondary">Ya tengo cuenta</router-link>
              </template>

            </div>

            <p class="hero-footnote">
              Regístrate como cliente o maestro y comienza a usar Maestro Chasquilla en minutos.
            </p>
          </div>

        </div>
      </div>
    </section>

    <!-- FEATURES -->
    <section class="section features">
      <div class="container-lg text-center">
        <h2 class="section-title">Todo lo que necesitas para coordinar trabajos</h2>
        <p class="section-subtitle">
          Herramientas pensadas tanto para clientes como para maestros independientes.
        </p>

        <div class="row g-4 mt-4">

          <div class="col-md-3 col-6">
            <div class="feature-card">
              <div class="feature-icon">🛠️</div>
              <h5>Maestros por especialidad</h5>
              <p>Gasfitería, electricidad, construcción y más.</p>
            </div>
          </div>

          <div class="col-md-3 col-6">
            <div class="feature-card">
              <div class="feature-icon">📍</div>
              <h5>Búsqueda por ubicación</h5>
              <p>Encuentra especialistas cercanos a tu comuna.</p>
            </div>
          </div>

          <div class="col-md-3 col-6">
            <div class="feature-card">
              <div class="feature-icon">💬</div>
              <h5>Chat integrado</h5>
              <p>Coordina detalles del trabajo fácilmente.</p>
            </div>
          </div>

          <div class="col-md-3 col-6">
            <div class="feature-card">
              <div class="feature-icon">⭐</div>
              <h5>Reseñas reales</h5>
              <p>Calificaciones verificadas de otros usuarios.</p>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- ROLES -->
    <section class="section roles">
      <div class="container-lg">
        <div class="row g-4">

          <div class="col-md-6">
            <div class="role-card">
              <h3>¿Eres cliente? 🤝🏼</h3>
              <p>Encuentra maestros confiables según tus necesidades.</p>
              <router-link to="/search-workers" class="btn btn-primary mt-2">Buscar maestro</router-link>
            </div>
          </div>

          <div class="col-md-6">
            <div class="role-card">
              <h3>¿Eres maestro? 🔨</h3>
              <p>Accede a solicitudes reales de clientes.</p>
              <router-link to="/clientrequests" class="btn btn-primary mt-2">Ver trabajos</router-link>
            </div>
          </div>

        </div>
      </div>
    </section>

  </div>
</template>

<style scoped>
.home-page {
  padding-bottom: 3rem;
}

/* ---------------- HERO ---------------- */

.hero {
  position: relative;
  overflow: hidden;
  padding: 3.5rem 1rem 3rem;
  color: #fff;

  /* Fondo: textura + overlay */
  background:
    linear-gradient(135deg, rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.35)),
    url('/maestrochasquilla.png');
  background-size: cover;
  background-position: center;
}

.hero-inner {
  position: relative;
  z-index: 2;
}

.hero-pill {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.16);
  font-size: 0.85rem;
}

.hero-title {
  font-size: 2.4rem;
  font-weight: 800;
  margin-top: 1rem;
}

.hero-subtitle {
  font-size: 1rem;
  max-width: 32rem;
  color: #e5e7eb;
  margin-top: 0.5rem;
}

.hero-btn-main {
  padding-inline: 1.4rem;
  font-weight: 600;
}

.hero-btn-secondary {
  border-width: 1px;
  font-weight: 500;
}

.hero-footnote {
  font-size: 0.85rem;
  margin-top: 0.7rem;
  color: #dbeafe;
}

/* ---------------- FEATURES ---------------- */

.features {
  background: #f5f7fa;
  padding: 3rem 0;
}

.feature-card {
  background: #fff;
  border-radius: 14px;
  padding: 1.4rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.feature-icon {
  font-size: 1.8rem;
  margin-bottom: .4rem;
}

/* ---------------- ROLES ---------------- */

.roles {
  padding-bottom: 3rem;
}

.role-card {
  background: #fff;
  border-radius: 14px;
  padding: 2rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 6px 16px rgba(0,0,0,0.06);
}
</style>
