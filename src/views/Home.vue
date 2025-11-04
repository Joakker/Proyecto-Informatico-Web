<script setup lang="ts">
    import { useUserStore } from '@/stores/user'
    import { computed } from 'vue'

    const userStore = useUserStore()
    const isLoggedIn = computed(() => userStore.user !== null)
</script>

<template>
    <template v-if="isLoggedIn">
        <div class="title">
            <h1>Bienvenido a maestro chasquilla!</h1>
        </div>
    </template>
    <template v-else>
        <div class="title">
            <h1>Bienvenido a maestro chasquilla!</h1>
        </div>
        <div class="register-ask">
            <h2>¿Aún no tienes cuenta?</h2>
            <div class="right-nav">
                <router-link to="/signup">¡Regístrate!</router-link>
            </div>
        </div>
    </template>
    <div class="find-client">
        <h2>¿Buscas un trabajo?</h2>
        <div class="right-nav">
            <router-link to="/clientrequests">Encuentra un cliente</router-link>
        </div>
    </div>
    <div class="find-client">
        <h2>¿Buscas un especialista?</h2>
        <div class="right-nav">
            <router-link to="/workerrequests">Encuentra uno aquí</router-link>
        </div>
    </div>

</template>

<style scoped>
    .title {
        display: flex;
        justify-content: center;
    }
    
    .register-ask {
        display:flex;
        align-items: center;
        flex-direction: column;
        
    }

    .find-client {
        display:flex;
        align-items: center;
        flex-direction: column;
        
    }

</style>
