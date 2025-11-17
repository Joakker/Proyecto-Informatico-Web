<template>
  <div class="app-root">
    <div class="nav-root">
      <nav>
        <div class="left-nav">
          <router-link to="/">Home</router-link>
          <router-link to="/clientrequests">Trabajos</router-link>
          <router-link to="/workerrequests">Trabajadores</router-link>
          <router-link to="/search-workers">Buscar Maestro</router-link>

          <template v-if="isLoggedIn">
            <router-link to="/modpage">Moderación</router-link>
          </template>

        </div>

        <div class="right-nav">
          <template v-if="isLoggedIn">
            <router-link to="/profile">Profile</router-link>
            <button @click="logout">Log out</button>
          </template>
          <template v-else>
            <router-link to="/login">Log in</router-link>
            <router-link to="/signup">Sign up</router-link>
          </template>
        </div>
      </nav>
    </div>
    
    <main class="main-content">
      <router-view />
    </main>

    <div class="footer-root">
      <footer>
        <div class="logo-div">
          <img alt="acá debería haber un logo"></img>
          <p>Maestro chasquilla 2025 @ Todos los derechos reservados</p>
        </div>
      </footer>
    </div>
  </div>
</template>



<script setup lang="ts">
    import { useUserStore } from '@/stores/user'
    import { ref, computed } from 'vue'
    import { useRouter } from 'vue-router'

    const userStore = useUserStore()
    const isLoggedIn = computed(() => userStore.user !== null)
    const router = useRouter()

    function logout() {
        userStore.logout()
        localStorage.removeItem('user') 
        localStorage.removeItem('token')
        router.push('/')           
    }

    const userType = ref<number|null>(null)

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

</script>

<style scoped>
    
    nav {
      background-color: yellow;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      min-height: 3rem;
    }

    footer {
      background-color: yellow;
      padding: 1rem;
      text-align: center;
    }

    .logo-div{
      display: flex;
      flex-direction: column;
      justify-items: center;
      align-items: center;
    }

    .left-nav {
      display: flex;
      align-items: end;
      justify-content: space-between;
      gap: 1rem;
    }

    .right-nav {
        display: flex;
        align-items: end;
        justify-content: space-between;
        gap: 1rem;
    }

    .app-root {
      display: flex;
      flex-direction: column;
      min-height: 100vh; /* ocupa toda la altura */
    }

    .main-content {
      flex: 1; /* empuja el footer hacia abajo */
    }

</style>

<style>
  html, body {
    margin: 0;
    padding: 0;

    background-color: white;
  }
</style>