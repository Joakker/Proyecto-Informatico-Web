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
}

const categories = ref<Category[]>([])
const selectedCategories = ref<number[]>([])

function loadWorkerCategories() {
    const worker = userInfo.value?.workers;
    if (worker?.categories) {
        selectedCategories.value = worker.categories.map((c: Category) => c.category_id);
    }
}

async function getUserType() {
    try {
        const res = await fetch('http://127.0.0.1:8000/api/user/type', {
            headers: { 
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        userType.value = (await res.json()).type
    } catch (e) { console.error(e) }
}

async function getUserInfo() {
    try {
        const res = await fetch('http://127.0.0.1:8000/api/user', {
            headers: { 
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        const data = await res.json()
        userInfo.value = data
        editData.value = {
            fname: data.first_name,
            lname: data.last_name,
            phone: data.phone_number,
            address: data.address
        }
        loadWorkerCategories()
    } catch (e) { console.error(e) }
}

async function updateProfile() {
    try {
        const res = await fetch('http://127.0.0.1:8000/api/profile/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(editData.value)
        })

        const updated = await res.json()
        userInfo.value = updated.user
        editMode.value = false
        alert("Perfil actualizado con éxito")
    } catch (e) {
        console.error(e)
        alert("Error al actualizar el perfil")
    }
}

async function getCategories() {
    const res = await fetch("http://127.0.0.1:8000/api/categories")
    categories.value = await res.json()
}

async function updateWorkerCategories() {
    try {
        await fetch("http://127.0.0.1:8000/api/worker/categories", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ categories: selectedCategories.value })
        })

        alert("Categorías actualizadas correctamente")
        isEditingCategories.value = false
        getUserInfo()

    } catch (e) {
        console.error(e)
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
  <div class="profile-page">

    <!-- CARD PRINCIPAL -->
    <div class="profile-card">

      <!-- CABECERA -->
      <div class="profile-header">
        <img
        :src="userInfo?.profile_picture || '/iconoperfil.png'"
        class="avatar"
        />

        <div>
          <h2>{{ userInfo?.first_name }} {{ userInfo?.last_name }}</h2>
          <p class="email">{{ userInfo?.email }}</p>
          <span class="tag" v-if="userType === 1"> Cliente </span>
          <span class="tag tag-blue" v-if="userType === 2"> Maestro </span>
          <span class="tag tag-orange" v-if="userType === 3"> Moderador </span>
        </div>
      </div>

      <!-- DATOS PERSONALES -->
      <div class="section-block">
        <div class="section-header">
          <h3>Datos personales</h3>
          <button class="btn-outline" @click="editMode = !editMode">
            {{ editMode ? 'Cancelar' : 'Editar' }}
          </button>
        </div>

        <!-- MODO LECTURA -->
        <div v-if="!editMode">
          <p><strong>Teléfono:</strong> {{ userInfo?.phone_number }}</p>
          <p><strong>Dirección:</strong> {{ userInfo?.address }}</p>
        </div>

        <!-- MODO EDICIÓN -->
        <div v-else class="form-grid">
          <div>
            <label>Nombre</label>
            <input v-model="editData.fname" type="text">
          </div>
          <div>
            <label>Apellido</label>
            <input v-model="editData.lname" type="text">
          </div>
          <div>
            <label>Teléfono</label>
            <input v-model="editData.phone" type="text">
          </div>
          <div>
            <label>Dirección</label>
            <input v-model="editData.address" type="text">
          </div>

          <button class="btn-save" @click="updateProfile">Guardar cambios</button>
        </div>
      </div>

      <!-- CATEGORÍAS (SOLO MAESTRO) -->
      <div class="section-block" v-if="userType === 2">
        <div class="section-header">
          <h3>Categorías de trabajo</h3>
          <button class="btn-outline" v-if="!isEditingCategories" @click="isEditingCategories = true">
            Editar categorías
          </button>
        </div>

        <!-- Vista normal -->
        <ul v-if="!isEditingCategories" class="cat-list">
          <li v-for="cat in userInfo?.workers?.categories" :key="cat.category_id">
            {{ cat.name }}
          </li>
        </ul>

        <!-- Edición -->
        <div v-else>
          <div class="checkbox-list">
            <div v-for="c in categories" :key="c.category_id">
              <input type="checkbox" :value="c.category_id" v-model="selectedCategories">
              <label>{{ c.name }}</label>
            </div>
          </div>

          <button class="btn-save" @click="updateWorkerCategories">Guardar</button>
          <button class="btn-cancel" @click="isEditingCategories = false">Cancelar</button>
        </div>
      </div>

      <!-- INFORMACIÓN EXTRA -->
      <div class="section-block">
        <h3>Información adicional</h3>
        <p>Miembro desde: <strong>{{ new Date(userInfo?.created_at).toLocaleDateString('es-CL') }}</strong></p>
      </div>

    </div>
  </div>
</template>
<style scoped>
.profile-page {
  background: #eef3f8;
  min-height: 100vh;
  padding-bottom: 50px;
  padding-top: 50px;
}

/* CARD PRINCIPAL */
.profile-card {
  max-width: 900px;
  margin: auto;
  background:white;
  padding:35px;
  border-radius:18px;
  box-shadow:0 6px 22px rgba(0,0,0,0.08);
}

/* HEADER PERFIL */
.profile-header {
  display:flex;
  align-items:center;
  gap:25px;
  margin-bottom:25px;
}

.avatar {
  width:120px;
  height:120px;
  border-radius:50%;
  object-fit:cover;
}

.email {
  color:#666;
  font-size:14px;
}

.tag {
  display:inline-block;
  padding:6px 12px;
  margin-top:8px;
  border-radius:12px;
  background:#e5e7eb;
  font-weight:600;
}

.tag-blue { background:#d6f0ff; color:#0077b6; }
.tag-orange { background:#ffe5c2; color:#c46a00; }

/* SECCIONES */
.section-block {
  margin-top:30px;
  padding-top:10px;
}

.section-header {
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:15px;
}

/* BOTONES */
.btn-outline {
  border:1px solid #009fe3;
  padding:8px 14px;
  border-radius:8px;
  color:#009fe3;
  background:white;
  cursor:pointer;
  font-weight:600;
}

.btn-outline:hover {
  background:#009fe3;
  color:white;
}

.btn-save {
  margin-top:15px;
  background:#009fe3;
  color:white;
  border:none;
  padding:12px 18px;
  border-radius:10px;
  font-weight:700;
}

.btn-cancel {
  margin-left:10px;
  background:#ccc;
  color:white;
  border:none;
  padding:12px 18px;
  border-radius:10px;
  font-weight:700;
}

/* FORMULARIO */
.form-grid {
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:20px;
}

input {
  width:100%;
  padding:10px;
  border-radius:10px;
  border:1px solid #cfd8e3;
}

/* CATEGORÍAS */
.cat-list li {
  padding:6px 0;
  border-bottom:1px solid #eee;
}

.checkbox-list div {
  margin-bottom:6px;
}
</style>
