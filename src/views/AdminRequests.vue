<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import WorkRequestCard from "@/components/ClientRequestCard.vue";

interface WorkRequest {
  client_request_id: number;
  title: string;
  description: string;
  budget: number;
}

const router = useRouter();
const works = ref<WorkRequest[]>([]);
const search = ref("");

async function getWorks() {
  const res = await fetch("http://127.0.0.1:8000/api/clientrequests", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  });
  works.value = await res.json();
}

const filteredWorks = computed(() =>
  works.value.filter(w =>
    w.title.toLowerCase().includes(search.value.toLowerCase())
  )
);

function goBack() {
  router.push('/Modpage');
}


onMounted(getWorks);
</script>

<template>
  <div class="page-wrapper">

    <!-- HERO + ACCIONES -->
    <section class="hero">
      <div class="hero-left">
        <div class="hero-icon">📝</div>
        <div>
          <h1>Solicitudes registradas</h1>
          <p>Revisa y elimina solicitudes problemáticas o sospechosas.</p>
        </div>
      </div>

      <!-- ACCIONES: volver + buscador -->
      <div class="hero-actions">
        <button class="back-btn" @click="goBack">Volver</button>

        <input
          v-model="search"
          type="text"
          placeholder="Buscar solicitud..."
          class="search-input"
        />
      </div>
    </section>

    <!-- CONTENT -->
    <section class="content">

      <div v-if="filteredWorks.length === 0" class="empty">
        <p>No hay solicitudes disponibles.</p>
      </div>

      <div v-else class="cards-grid">
        <WorkRequestCard
          v-for="w in filteredWorks"
          :key="w.client_request_id"
          :work="w"
          @child-action="getWorks()"
        />
      </div>

    </section>

  </div>
</template>

<style scoped>
.page-wrapper {
  min-height: 100vh;
  background: #eef3f8;
  padding: 45px 25px;
}

/* ----------------------- HERO ----------------------- */
.hero {
  max-width: 1200px;
  margin: 0 auto 40px auto;
  padding: 28px 40px;

  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  border-radius: 18px;
  box-shadow: 0px 8px 26px rgba(0, 0, 0, 0.08);

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 25px;

  animation: fadeUp 0.35s ease-out;
}

.hero-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.hero-icon {
  background: linear-gradient(135deg, #009FE3, #3BC3FF);
  width: 58px;
  height: 58px;
  border-radius: 16px;

  display: flex;
  justify-content: center;
  align-items: center;
  color: white;

  font-size: 28px;
  box-shadow: 0px 6px 14px rgba(0, 159, 227, 0.3);
}

.hero h1 {
  margin: 0;
  font-size: 32px;
  font-weight: 800;
}

.hero p {
  margin: 4px 0 0;
  color: #5a5a5a;
}

/* ----------------------- ACCIONES ----------------------- */

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

  transition: 0.25s ease;
  font-size: 15px;
}
.search-input:focus {
  outline: none;
  border-color: #009fe3;
  box-shadow: 0 0 8px rgba(0, 159, 227, 0.3);
}

/* ----------------------- CONTENIDO ----------------------- */
.content {
  max-width: 1200px;
  margin: auto;
  animation: fadeUp 0.45s ease-out;
}

.cards-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 35px;
  justify-content: center;
}

.empty {
  text-align: center;
  opacity: 0.7;
  margin-top: 40px;
}

/* Animación */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
