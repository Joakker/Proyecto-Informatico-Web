<template>
  <div>
    <nav>
      <div class="left-nav">
        <router-link to="/">Home</router-link>
        <router-link to="/clientrequests">Trabajos</router-link>
        <router-link to="/workerrequests">Trabajadores</router-link>
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

    <router-view />
  </div>
</template>



<script setup lang="ts">
    import { useUserStore } from '@/stores/user'
    import { computed } from 'vue'
    import { useRouter } from 'vue-router'

    const userStore = useUserStore()
    const isLoggedIn = computed(() => userStore.user !== null)
    const router = useRouter()

    function logout() {
        userStore.logout()
        localStorage.removeItem('user') // optional: clear persisted user
        router.push('/')           // redirect to login page
    }
</script>

<style scoped>
    nav {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
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

</style>
