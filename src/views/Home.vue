<script setup lang="ts">
    import { useUserStore } from '@/stores/user'
    import { computed, onMounted, ref } from 'vue'


    const userStore = useUserStore()
    const isLoggedIn = computed(() => userStore.user !== null)

    const userType = ref<number|null>(null)
    const userInfo = ref();

    async function getUserType() {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/user/type', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}` // token from login
            }
            })

            if (!response.ok) {
            throw new Error(`Error ${response.status}`)
            }

            const data = await response.json()
            userType.value = data.type
            console.log('User type:', data.type)
        } catch (error) {
            console.error(error)
        }
    }

    async function getUserInfo() {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/user', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}` // token from login
            }
            })

            if (!response.ok) {
            throw new Error(`Error ${response.status}`)
            }

            const data = await response.json()
            userInfo.value = data
        } catch (error) {
            console.error(error)
        }
    }

    onMounted(() => {
        if (isLoggedIn.value) {
            getUserType()
            getUserInfo();
        }
    })
</script>

<template>
  <div class="container py-5 d-flex justify-content-center">
    <!-- Card principal -->
    <div class="card shadow-lg p-5" style="max-width: 1000px; width: 100%;">

      <!-- Bienvenida -->
      <div class="text-center mb-4">
        <h1 v-if="isLoggedIn">
          Bienvenido, {{ userInfo?.first_name || 'Usuario' }} ✨
        </h1>
        <h1 v-else>✨Bienvenido a Maestro Chasquilla✨</h1>
      </div>

      <!-- Secciones según tipo de usuario -->
      <div class="d-flex flex-column gap-3">
        <template v-if="isLoggedIn">
          <div v-if="userType === 1" class="text-center p-3 border rounded">
            <h3>🔍¿Buscas un especialista?</h3>
            <router-link to="/search-workers" class="btn btn-primary mt-2">
              Encuentra uno aquí
            </router-link>
          </div>

          <div v-else-if="userType === 2" class="text-center p-3 border rounded">
            <h3>💼¿Buscas un trabajo?</h3>
            <router-link to="/clientrequests" class="btn btn-primary mt-2">
              Encuentra un cliente
            </router-link>
          </div>

          <div v-else-if="userType === 3" class="text-center p-3 border rounded">
            <h3>Eres un moderador🛠️</h3>
            <router-link to="/modpage" class="btn btn-warning mt-2">
              Revisa la tabla del moderador
            </router-link>
          </div>
        </template>

        <template v-else>
          <div class="text-center p-3 border rounded">
            <h3>🚀¿Aún no tienes cuenta?</h3>
            <router-link to="/signup" class="btn btn-primary mt-2">
              ¡Regístrate!
            </router-link>
          </div>

          <div class="text-center p-3 border rounded">
            <h3>💼¿Buscas un trabajo?</h3>
            <router-link to="/clientrequests" class="btn btn-primary mt-2">
              Encuentra un cliente
            </router-link>
          </div>

          <div class="text-center p-3 border rounded">
            <h3>🔍¿Buscas un especialista?</h3>
            <router-link to="/search-workers" class="btn btn-primary mt-2">
              Encuentra uno aquí
            </router-link>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
body {
  background-color: #f0f2f5;
}

/* Opcional: bordes y sombras más suaves para la card */
.card {
  border-radius: 15px;
}

.border {
  border-color: #dee2e6 !important;
}
</style>
