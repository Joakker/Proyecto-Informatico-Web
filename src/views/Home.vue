<script setup lang="ts">

</script>

<template>
    <div class="title">
        <h1>Bienvenido a maestro chasquilla!</h1>
    </div>
    <div class="register-ask">
        <h2>¿Aún no tienes cuenta?</h2>
        <div class="right-nav">
            <router-link to="/signup">¡Regístrate!</router-link>
        </div>
    </div>
    <div class="find-client">
        <h2>¿Buscas un trabajo?</h2>
        <div class="right-nav">
            <router-link to="/clientrequests">Encuentra un cliente</router-link>
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
