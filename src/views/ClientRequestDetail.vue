<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

interface User {
  id: number
  first_name: string   
  last_name?: string  
  email: string
  phone_number: string
  score: number
}

interface Category {
  category_id: number
  name: string
  description?: string
}

interface Client {
  client_id: number
  user_id: number
  user?: User     
}

interface ClientRequest {
  client_request_id: number
  client_id?: number
  title: string
  description: string
  budget: number
  address: string
  client?: Client 
  category?: Category
}

const route = useRoute()
const requestId = route.params.id as string

const request = ref<ClientRequest | null>(null)

onMounted(async () => {
  const response = await fetch(`http://127.0.0.1:8000/api/clientrequests/${requestId}`);
  request.value = await response.json();
  console.log(request);
})
</script>

<template>
  <div class="details-wrapper" v-if="request">

    <div class="header">
      <div class="icon-circle">
        📝
      </div>

      <div>
        <h1 class="title">{{ request.title }}</h1>
        <p class="subtitle">
          Solicitud creada por 
          <strong>{{ request.client?.user?.first_name }} {{ request.client?.user?.last_name }}</strong>
        </p>
      </div>
    </div>

    <div class="card-section">
      <h3>Descripción del trabajo</h3>
      <p class="description-text">{{ request.description }}</p>
    </div>

    <div class="info-section">
      <div class="info-item">
        <label>Presupuesto estimado</label>
        <p>${{ request.budget }}</p>
      </div>

      <div class="info-item">
        <label>Categoría</label>
        <p>{{ request.category?.name || 'Sin categoría' }}</p>
      </div>

      <div class="info-item">
        <label>Dirección</label>
        <p>{{ request.address }}</p>
      </div>

      <div class="info-item">
        <label>Calificación del cliente</label>
        <span class="score-badge">{{ request.client?.user?.score }}/5 ⭐</span>
      </div>
    </div>

    <div class="contact-section">
      <h3>Información de contacto</h3>

      <div class="contact-row">
        <i class="fas fa-phone-alt contact-icon"></i>
        <p>{{ request.client?.user?.phone_number }}</p>
      </div>

      <div class="contact-row">
        <i class="fas fa-envelope contact-icon"></i>
        <p>{{ request.client?.user?.email }}</p>
      </div>
    </div>

    <div class="actions">
      <router-link to="/clientrequests" class="back-btn">
        Volver a las solicitudes
      </router-link>
    </div>

  </div>
</template>

<style scoped>
.details-wrapper {
  max-width: 800px;
  margin: auto;
  padding: 2rem;
  background: linear-gradient(180deg, #ffffff 0%, #f7f9ff 60%, #eef4ff 100%);
  border-radius: 18px;
  box-shadow: 0 3px 20px rgba(0,0,0,0.07);
}

.header {
  display: flex;
  align-items: center;
  gap: 1.3rem;
  margin-bottom: 1.5rem;
}

.icon-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #009fe3, #45c6ff);
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 1.5rem;
  box-shadow: 0 4px 12px rgba(76, 147, 255, 0.4);
}

.title {
  font-weight: 700;
  font-size: 1.8rem;
  margin: 0;
  color: #1b1f24;
}

.subtitle {
  color: #6b7280;
  font-size: 0.95rem;
}

.card-section,
.info-section,
.contact-section {
  background: white;
  padding: 1.3rem 1.5rem;
  margin-top: 1.3rem;
  border-radius: 14px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.card-section h3,
.contact-section h3 {
  font-weight: 600;
  margin-bottom: 0.8rem;
}

.description-text {
  font-size: 1rem;
  color: #374151;
  line-height: 1.5;
}

.info-section {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
}

.info-item label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #6b7280;
}

.info-item p {
  font-size: 1rem;
  color: #1f2937;
  margin: 0.2rem 0 0 0;
}

.score-badge {
  background: #ffca28;
  padding: 4px 10px;
  border-radius: 12px;
  font-weight: 600;
  color: #2e2e2e;
}

.contact-row {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-top: 0.6rem;
  font-size: 1rem;
  color: #1f2937;
}

.contact-icon {
  font-size: 1.3rem;
  color: #4c93ff;
}

.actions {
  text-align: center;
  margin-top: 2rem;
}

.back-btn {
  background: #d1d9e6;
  padding: 0.7rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  color: #1f2937;
  text-decoration: none;
  transition: 0.25s;
}

.back-btn:hover {
  background: #c4ccd8;
}
</style>
