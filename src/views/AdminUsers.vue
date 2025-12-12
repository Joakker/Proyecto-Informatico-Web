<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

interface User {
  user_id: number
  first_name: string
  last_name: string
  email: string
}

const users = ref<User[]>([])
const search = ref("")
const router = useRouter()

async function loadUsers() {
  const res = await fetch("http://127.0.0.1:8000/api/get_users", {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  users.value = await res.json();
}

async function deleteUser(id: number) {
  await fetch(`http://127.0.0.1:8000/api/users/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  users.value = users.value.filter(u => u.user_id !== id);
}

const filteredUsers = computed(() =>
  users.value.filter(u =>
    `${u.first_name} ${u.last_name}`.toLowerCase().includes(search.value.toLowerCase()) ||
    u.email.toLowerCase().includes(search.value.toLowerCase())
  )
)

function goBack() {
  router.back()
}

onMounted(loadUsers)
</script>

<template>
  <div class="page-wrapper">

    <!-- HERO -->
    <section class="hero">
      <div class="hero-left">
        <div class="hero-icon">👤</div>
        <div>
          <h1>Usuarios registrados</h1>
          <p>Administra perfiles y elimina usuarios conflictivos.</p>
        </div>
      </div>

      <!-- ACCIONES: VOLVER + BUSCADOR -->
      <div class="hero-actions">
        <button class="back-btn" @click="goBack">Volver</button>

        <input
          v-model="search"
          type="text"
          placeholder="Buscar usuario..."
          class="search-input"
        />
      </div>
    </section>

    <!-- CONTENT -->
    <section class="content">
      <div v-if="filteredUsers.length === 0" class="empty">
        No hay usuarios registrados.
      </div>

      <div class="user-list">
        <div class="user-card" v-for="u in filteredUsers" :key="u.user_id">
          <div>
            <h3>{{ u.first_name }} {{ u.last_name }}</h3>
            <span>{{ u.email }}</span>
          </div>

          <button @click="deleteUser(u.user_id)" class="delete-btn">
            Eliminar
          </button>
        </div>
      </div>
    </section>

  </div>
</template>

<style scoped>
/* BASE VISUAL */
.page-wrapper {
  min-height: 100vh;
  background: #eef3f8;
  padding: 45px 25px;
  animation: fadeIn 0.4s ease-out;
}

/* ---------------- HERO ---------------- */
.hero {
  max-width: 1200px;
  margin: 40px auto;
  padding: 28px 40px;

  background: rgba(255,255,255,0.85);
  border-radius: 18px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 26px rgba(0,0,0,0.08);

  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 25px;

  animation: fadeUp 0.35s ease-out;
}

.hero-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.hero-icon {
  width: 58px;
  height: 58px;
  border-radius: 16px;
  background: linear-gradient(135deg, #009FE3, #3BC3FF);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 28px;
  box-shadow: 0 6px 14px rgba(0,159,227,0.3);
}

/* HERO ACTIONS */
.hero-actions {
  display: flex;
  align-items: center;
  gap: 18px;
}

/* BOTÓN VOLVER */
.back-btn {
  padding: 10px 16px;
  background: transparent;
  border: 2px solid #009fe3;
  color: #009fe3;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.25s ease;
}
.back-btn:hover {
  background: #009fe3;
  color: white;
  box-shadow: 0 4px 12px rgba(0,159,227,0.35);
}

/* BUSCADOR */
.search-input {
  padding: 10px 14px;
  width: 240px;

  border-radius: 12px;
  border: 1px solid #cfd9e3;
  background: #f7f9fc;

  transition: 0.25s ease;
  font-size: 15px;
}
.search-input:focus {
  outline: none;
  border-color: #009fe3;
  box-shadow: 0 0 8px rgba(0,159,227,0.3);
}

/* ---------------- CONTENT ---------------- */
.content {
  max-width: 900px;
  margin: auto;
}

.user-list {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

/* USER CARD */
.user-card {
  background: white;
  padding: 20px 22px;
  border-radius: 18px;
  box-shadow: 0 8px 26px rgba(0,0,0,0.06);

  display: flex;
  justify-content: space-between;
  align-items: center;

  transition: 0.2s ease;
}

.user-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 34px rgba(0,0,0,0.10);
}

.user-card h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
}

.user-card span {
  font-size: 15px;
  opacity: 0.7;
}

/* DELETE BUTTON */
.delete-btn {
  background: #ff4d4d;
  border: none;
  color: white;
  padding: 10px 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: 0.2s ease;
}
.delete-btn:hover {
  background: #d63c3c;
}

/* EMPTY */
.empty {
  text-align: center;
  margin-top: 40px;
  opacity: 0.7;
}

/* ANIMATIONS */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
</style>
