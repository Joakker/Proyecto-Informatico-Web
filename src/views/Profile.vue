<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { computed, onMounted, ref } from 'vue'


const userStore = useUserStore()
const isLoggedIn = computed(() => userStore.user !== null)

const userType = ref<number|null>(null)
const userInfo = ref();
//para editar perfil:
const editMode = ref(false)
const isEditingCategories = ref(false)

const editData = ref({
    fname: '',
    lname: '',
    phone: '',
    address: ''
})

interface Category {
  category_id: number;
  name: string;
  description?: string;
}

const categories = ref<Category[]>([]);               // lista de categorías
const selectedCategories = ref<number[]>([]) 

interface WorkerCategory {
    category_id: number;
    name: string;
}

function loadWorkerCategories() {
    const worker = userInfo.value?.workers; // ahora es un objeto
    if (worker && worker.categories) {
        selectedCategories.value = worker.categories.map((c: Category) => c.category_id);
        console.log("Categorías seleccionadas:", selectedCategories.value);
    }
}


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
        console.log("Datos recibidos de /api/user/type:", data)
        userType.value = data.type
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
        console.log("Respuesta de /api/user:", data) 
        userInfo.value = data
        loadWorkerCategories()

        editData.value = {
            fname: data.first_name,
            lname: data.last_name,
            phone: data.phone_number,
            address: data.address
        }
    } catch (error) {
        console.error(error)
    }
}

async function updateProfile() {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/profile/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(editData.value)
        })

        if (!response.ok) {
            throw new Error(`Error ${response.status}`)
        }

        const updated = await response.json()

        // actualizamos el frontend
        userInfo.value = updated.user  
        editMode.value = false  

        alert("Perfil actualizado con éxito")

    } catch (error) {
        console.error(error)
        alert("Error al actualizar el perfil")
    }
}

async function getCategories() {
    try {
        const response = await fetch("http://127.0.0.1:8000/api/categories");
        if (!response.ok) throw new Error("Error obteniendo categorías");

        categories.value = await response.json();
    } catch (err) {
        console.error(err);
    }
}

async function updateWorkerCategories() {
    try {
        const response = await fetch("http://127.0.0.1:8000/api/worker/categories", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                categories: selectedCategories.value
            })
        });

        if (!response.ok) throw new Error(`Error ${response.status}`);

        alert("Categorías actualizadas correctamente");
        
        await getUserInfo();

        isEditingCategories.value = false;

    } catch (error) {
        console.error(error);
        alert("Error al actualizar categorías");
    }
}

onMounted(() => {
    if (isLoggedIn.value) {
        getUserType();
        getUserInfo();
        getCategories();
    }
})

</script>


<template>
    <div class="profile-container">
        <div class="profile-card">
            <div class="pfp-column">
                <img alt="hola"></img>
            </div>
            <div class="info-column">
                <h3>{{ userInfo?.first_name + ' ' + userInfo?.last_name}}</h3>
            </div>
        </div>

        <hr></hr>

        <template v-if="userType === 1">

            <div class="user-type">
                <h3>Tu cuenta está configurada como CLIENTE</h3>
                <p>Si quieres cambiarla a MAESTRO, tendrás que registrarte de nuevo.</p>
            </div>

        </template>

        <template v-if="userType === 2">

            <div class="user-type">
                <h3>Tu cuenta está configurada como MAESTRO</h3>
                <p>Si quieres cambiarla a CLIENTE, tendrás que registrarte de nuevo.</p>
            </div>

        </template>
        <hr></hr>

        <div class="personal-info-container">
            <h2>Datos personales</h2>
            <p>Teléfono: {{ userInfo?.phone_number }}</p>
            <p>Dirección: {{ userInfo?.address }}</p>
            <p>E-mail: {{ userInfo?.email }}</p>

            <button @click="editMode = !editMode">
                {{ editMode ? 'Cancelar' : 'Editar perfil' }}
            </button>

            <div v-if="editMode" class="edit-form">

                <label>Nombre</label>
                <input v-model="editData.fname" type="text">

                <label>Apellido</label>
                <input v-model="editData.lname" type="text">

                <label>Teléfono</label>
                <input v-model="editData.phone" type="text">

                <label>Dirección</label>
                <input v-model="editData.address" type="text">

                <button @click="updateProfile()">Guardar cambios</button>

            </div>

        </div>

        <template v-if="userType === 2">
            <div class="categories-container">
                <h2>Tus categorías de trabajo</h2>

                <!-- ver categorías del maestro -->
                <div v-if="!isEditingCategories">
                    <ul>
                        <li 
                            v-for="cat in userInfo?.workers?.categories" 
                            :key="cat.category_id"
                        >
                            {{ cat.name }}
                        </li>
                    </ul>

                    <button @click="isEditingCategories = true">
                        Editar / Agregar Categorías
                    </button>
                </div>

                <!-- edición-->
                <div v-else>
                    <div class="category-list">
                        <label 
                            v-for="cat in categories" 
                            :key="cat.category_id"
                            style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px;"
                        >
                            <input 
                                type="checkbox"
                                v-model="selectedCategories"
                                :value="cat.category_id"
                            >
                            {{ cat.name }}
                        </label>
                    </div>

                    <button @click="updateWorkerCategories">
                        Guardar Categorías
                    </button>

                    <button @click="isEditingCategories = false" style="margin-left: 10px;">
                        Cancelar
                    </button>
                </div>
            </div>
        </template>

        <div class="account-preferences">
            <h2>Sobre tu cuenta</h2>
            <p>Creación de cuenta: {{ new Date(userInfo?.created_at).toLocaleDateString('es-CL') }}</p>
        </div>

    </div>
</template>

<style>

    html, body {
        margin: 0;
        padding: 0;

        background-color: yellow;
    }

    .profile-container {
        background-color: white;
        margin: 6rem;
        border-radius: 10px;
        display: block;
        border-width: 0.3rem;
        border-style: solid;
        border-color: gray;
    }

    .profile-card {
        display: flex;
        justify-content: space-around;
        flex-direction: row;
        margin: 4rem;
        border-width: 0.1rem;
        border-style: solid;
        border-color: gray;
        border-radius: 5px;
    }

    .pfp-column {
        display: flex;
        justify-content: center; /* horizontal */
        align-items: center;     /* vertical */
    }

    .user-type {
        display: flex;
        align-items: center;
        flex-direction: column;
        margin: 4rem;
        border-width: 0.1rem;
        border-style: solid;
        border-color: gray;
        border-radius: 5px;
    }

    .personal-info-container {
        margin: 4rem;
    }

    .account-preferences {
        margin: 4rem;
    }

</style>