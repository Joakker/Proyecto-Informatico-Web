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
    <template v-if="isLoggedIn">
        <div class="title">
        <h1 v-if="userType === 1">Bienvenido, {{userInfo?.first_name}}</h1>
        <h1 v-else-if="userType === 2">Bienvenido, {{ userInfo?.last_name }}</h1>
        <h1 v-else>Bienvenido a maestro chasquilla!</h1>
        </div>

        <div v-if="userType === 1" class="find-client">
            <h2>¿Buscas un especialista?</h2>
            <div class="right-nav">
                <router-link to="/workerrequests">Encuentra uno aquí</router-link>
            </div>
        </div>

        <div v-else-if="userType === 2" class="find-client">
            <h2>¿Buscas un trabajo?</h2>
            <div class="right-nav">
                <router-link to="/clientrequests">Encuentra un cliente</router-link>
            </div>
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
