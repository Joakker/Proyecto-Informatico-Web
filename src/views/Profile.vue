<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { computed, onMounted, ref } from 'vue'

const userStore = useUserStore()
const isLoggedIn = computed(() => userStore.user !== null)

const userType = ref<number|null>(null)
const userInfo = ref();
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

const categories = ref<Category[]>([])
const selectedCategories = ref<number[]>([])

function loadWorkerCategories() {
    const worker = userInfo.value?.workers;
    if (worker && worker.categories) {
        selectedCategories.value = worker.categories.map((c: Category) => c.category_id);
    }
}

async function getUserType() {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/user/type', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        if (!response.ok) throw new Error(`Error ${response.status}`)
        const data = await response.json()
        userType.value = data.type
    } catch (error) { console.error(error) }
}

async function getUserInfo() {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/user', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        if (!response.ok) throw new Error(`Error ${response.status}`)
        const data = await response.json()
        userInfo.value = data
        loadWorkerCategories()
        editData.value = {
            fname: data.first_name,
            lname: data.last_name,
            phone: data.phone_number,
            address: data.address
        }
    } catch (error) { console.error(error) }
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
        if (!response.ok) throw new Error(`Error ${response.status}`)
        const updated = await response.json()
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
        if (!response.ok) throw new Error("Error obteniendo categorías")
        categories.value = await response.json();
    } catch (err) { console.error(err); }
}

async function updateWorkerCategories() {
    try {
        const response = await fetch("http://127.0.0.1:8000/api/worker/categories", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ categories: selectedCategories.value })
        })
        if (!response.ok) throw new Error(`Error ${response.status}`)
        alert("Categorías actualizadas correctamente")
        await getUserInfo()
        isEditingCategories.value = false
    } catch (error) {
        console.error(error)
        alert("Error al actualizar categorías")
    }
}

onMounted(() => {
    if (isLoggedIn.value) {
        getUserType()
        getUserInfo()
        getCategories()
    }
})
</script>

<template>
<div class="container py-5">

    <!-- Perfil principal -->
    <div class="row g-4 mb-4">

        <!-- Perfil principal -->
        <div class="col-md-6">
            <div class="card shadow-sm p-3 h-100">
                <div class="row g-0 align-items-center">
                <div class="col-4 text-center">
                    <img src="https://via.placeholder.com/120" class="rounded-circle img-fluid" alt="Perfil">
                </div>
                <div class="col-8">
                    <h3>{{ userInfo?.first_name + ' ' + userInfo?.last_name }}</h3>
                    <p class="text-muted">{{ userInfo?.email }}</p>
                </div>
                </div>
            </div>
        </div>

        <!-- Tipo de usuario -->
        <div class="col-md-6" v-if="userType">
            <div class="card shadow-sm p-3 text-center h-100">
                <h5 v-if="userType === 1">Tu cuenta está configurada como CLIENTE</h5>
                <h5 v-else-if="userType === 2">Tu cuenta está configurada como MAESTRO</h5>
                <h5 v-else-if="userType === 3">Tu cuenta está configurada como MODERADOR</h5>
                <p>Si quieres cambiarla tendrás que registrarte de nuevo.</p>
            </div>
        </div>

  </div>

    <!-- Datos personales -->
    <div class="card mb-4 shadow-sm p-3">
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h4>Datos personales</h4>
            <button class="btn btn-outline-primary btn-sm" @click="editMode = !editMode">
                {{ editMode ? 'Cancelar' : 'Editar perfil' }}
            </button>
        </div>
        <div v-if="!editMode">
            <p><strong>Teléfono:</strong> {{ userInfo?.phone_number }}</p>
            <p><strong>Dirección:</strong> {{ userInfo?.address }}</p>
            <p><strong>Email:</strong> {{ userInfo?.email }}</p>
        </div>
        <div v-else class="row g-3">
            <div class="col-md-6">
                <label class="form-label">Nombre</label>
                <input v-model="editData.fname" type="text" class="form-control">
            </div>
            <div class="col-md-6">
                <label class="form-label">Apellido</label>
                <input v-model="editData.lname" type="text" class="form-control">
            </div>
            <div class="col-md-6">
                <label class="form-label">Teléfono</label>
                <input v-model="editData.phone" type="text" class="form-control">
            </div>
            <div class="col-md-6">
                <label class="form-label">Dirección</label>
                <input v-model="editData.address" type="text" class="form-control">
            </div>
            <div class="col-12 mt-3">
                <button class="btn btn-success" @click="updateProfile">Guardar cambios</button>
            </div>
        </div>
    </div>

    <!-- Categorías (solo maestro) -->
    <div v-if="userType === 2" class="card mb-4 shadow-sm p-3">
        <h4>Tus categorías de trabajo</h4>
        <div v-if="!isEditingCategories">
            <ul class="list-group mb-3">
                <li class="list-group-item" v-for="cat in userInfo?.workers?.categories" :key="cat.category_id">
                    {{ cat.name }}
                </li>
            </ul>
            <button class="btn btn-outline-primary btn-sm" @click="isEditingCategories = true">
                Editar / Agregar Categorías
            </button>
        </div>
        <div v-else class="mb-3">
            <div class="form-check" v-for="cat in categories" :key="cat.category_id">
                <input class="form-check-input" type="checkbox" :value="cat.category_id" v-model="selectedCategories">
                <label class="form-check-label">{{ cat.name }}</label>
            </div>
            <div class="mt-3">
                <button class="btn btn-success btn-sm" @click="updateWorkerCategories">Guardar Categorías</button>
                <button class="btn btn-secondary btn-sm ms-2" @click="isEditingCategories = false">Cancelar</button>
            </div>
        </div>
    </div>

    <!-- Información adicional -->
    <div class="card shadow-sm p-3">
        <h4>Sobre tu cuenta</h4>
        <p>Creación de cuenta: {{ new Date(userInfo?.created_at).toLocaleDateString('es-CL') }}</p>
    </div>

</div>
</template>

<style scoped>
body {
    background-color: #f8f9fa;
}

.card {
    border-radius: 10px;
}

img {
    max-width: 120px;
    max-height: 120px;
}
</style>
