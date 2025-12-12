<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import SupportTicket from "./SupportTicket.vue";

interface Conversation {
  conversation_id: number;
  user_id: number;
  created_at: string;
}

interface User {
  user_id: number;
  first_name: string;
  last_name: string;
}

const tickets = ref<Conversation[]>([]);
const users = ref<User[]>([]);
const open = ref<number[]>([]);
const search = ref("");

const router = useRouter();

function toggle(id: number) {
  open.value.includes(id)
    ? open.value = open.value.filter(x => x !== id)
    : open.value.push(id);
}

async function getTickets() {
  const res = await fetch("http://127.0.0.1:8000/api/mod_conversations", {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  tickets.value = (await res.json()).data;
}

async function getUsers() {
  const res = await fetch("http://127.0.0.1:8000/api/get_users", {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  users.value = await res.json();
}

function getName(id: number) {
  const u = users.value.find(x => x.user_id === id);
  return u ? `${u.first_name} ${u.last_name}` : "Usuario";
}

const filteredTickets = computed(() =>
  tickets.value.filter(t =>
    getName(t.user_id).toLowerCase().includes(search.value.toLowerCase())
  )
);

function goBack() {
  router.back();
}

onMounted(() => Promise.all([getTickets(), getUsers()]));
</script>

<template>
  <div class="page-wrapper">

    <!-- HERO -->
    <section class="hero">
      <div class="hero-left">
        <div class="hero-icon">💬</div>
        <div>
          <h1>Tickets de soporte</h1>
          <p>Administra conversaciones abiertas con usuarios.</p>
        </div>
      </div>

      <!-- ACCIONES (BUSCADOR + VOLVER) -->
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
      <div v-if="filteredTickets.length === 0" class="empty">
        No hay tickets disponibles.
      </div>

      <div class="ticket-list">
        <div class="ticket" v-for="t in filteredTickets" :key="t.conversation_id">
          
          <header class="ticket-header" @click="toggle(t.conversation_id)">
            <strong>{{ getName(t.user_id) }}</strong>
            <span>{{ t.created_at }}</span>
          </header>

          <div
            v-if="open.includes(t.conversation_id)"
            class="ticket-body"
          >
            <SupportTicket :conversation_id="t.conversation_id" />
          </div>

        </div>
      </div>
    </section>

  </div>
</template>

<style scoped>
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
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 28px;
  box-shadow: 0px 6px 14px rgba(0,159,227,0.3);
}

/* ---------------- HERO ACTIONS ---------------- */

.hero-actions {
  display: flex;
  align-items: center;
  gap: 18px;
}

/* Botón volver */
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

/* Buscador */
.search-input {
  padding: 10px 14px;
  width: 250px;
  border-radius: 12px;
  border: 1px solid #cfd9e3;
  background: #f7f9fc;

  font-size: 15px;
  transition: 0.25s ease;
}
.search-input:focus {
  outline: none;
  border-color: #009fe3;
  box-shadow: 0 0 8px rgba(0, 159, 227, 0.3);
}

/* ---------------- CONTENT ---------------- */

.content {
  max-width: 900px;
  margin: auto;
}

.ticket-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.ticket {
  background: white;
  padding: 18px 22px;
  border-radius: 18px;
  box-shadow: 0px 8px 26px rgba(0,0,0,0.06);
  transition: 0.2s ease;
}

.ticket:hover {
  transform: translateY(-3px);
  box-shadow: 0px 12px 34px rgba(0,0,0,0.10);
}

.ticket-header {
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  font-size: 16px;
}

.ticket-body {
  margin-top: 15px;
  background: #f8f9fc;
  padding: 18px;
  border-radius: 14px;
  box-shadow: inset 0 0 14px rgba(0,0,0,0.05);
}

/* Empty state */
.empty {
  margin-top: 40px;
  text-align: center;
  opacity: 0.7;
}

/* Animaciones */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
</style>
