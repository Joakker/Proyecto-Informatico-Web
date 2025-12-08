<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

const title = ref("");
const description = ref("");
const budget = ref<number | null>(null);
const street = ref("");
const city = ref("");
const region = ref("");
const country = ref("Chile");
const postalCode = ref("");

// categorías
const categories = ref<{ category_id: number; name: string }[]>([]);
const selectedCategory = ref<number | null>(null);

const router = useRouter();

const fullAddress = computed(() => {
  return `${street.value}, ${city.value}, ${region.value}, ${country.value}, ${postalCode.value}`;
});

const mapsEmbedUrl = computed(() => {
  const apiKey = import.meta.env.VITE_SECRET_KEY;
  return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(
    fullAddress.value
  )}`;
});

async function getCategories() {
  const res = await fetch("http://127.0.0.1:8000/api/categories", {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  categories.value = await res.json();
}

onMounted(() => {
  getCategories();
});

async function submitJob() {
  if (!selectedCategory.value) selectedCategory.value = null;

  await fetch("http://127.0.0.1:8000/api/create-client-request", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      title: title.value,
      description: description.value,
      budget: budget.value,
      street: street.value,
      city: city.value,
      region: region.value,
      category_id: selectedCategory.value,
    }),
  });

  router.push("/clientrequests");
}
</script>

<template>
  <div class="page">

    <!-- Hero -->
    <section class="hero">
      <div class="hero-icon">📝</div>
      <div>
        <h1>Publicar nuevo trabajo</h1>
        <p>Completa el formulario y conecta con maestros confiables.</p>
      </div>
    </section>

    <!-- Form -->
    <div class="form-card">

      <form @submit.prevent="submitJob">

        <!-- Título -->
        <div class="input-group">
          <label>Título del trabajo</label>
          <input v-model="title" type="text" required placeholder="Ej: Reparación de filtración en baño" />
        </div>

        <!-- Descripción -->
        <div class="input-group">
          <label>Descripción</label>
          <textarea
            v-model="description"
            rows="4"
            required
            placeholder="Describe el trabajo en detalle..."
          ></textarea>
        </div>

        <!-- Presupuesto + Categoría -->
        <div class="two-col">
          <div class="input-group">
            <label>Presupuesto (CLP)</label>
            <input v-model.number="budget" type="number" min="0" required placeholder="Ej: 50.000" />
          </div>

          <div class="input-group">
            <label>Categoría</label>
            <select v-model="selectedCategory">
              <option value="" disabled>Seleccione una categoría</option>
              <option
                v-for="cat in categories"
                :key="cat.category_id"
                :value="cat.category_id"
              >
                {{ cat.name }}
              </option>
            </select>
          </div>
        </div>

        <!-- Dirección -->
        <h3 class="section-title">Dirección</h3>

        <div class="two-col">
          <div class="input-group">
            <label>Calle</label>
            <input v-model="street" type="text" required />
          </div>

          <div class="input-group">
            <label>Ciudad</label>
            <input v-model="city" type="text" required />
          </div>
        </div>

        <div class="two-col">
          <div class="input-group">
            <label>Región</label>
            <input v-model="region" type="text" required />
          </div>

          <div class="input-group">
            <label>País</label>
            <input v-model="country" type="text" required />
          </div>
        </div>

        <div class="input-group">
          <label>Código postal</label>
          <input v-model="postalCode" type="text" />
        </div>

        <!-- MAPA -->
        <div v-if="street || city || region" class="map-box">
          <iframe
            :src="mapsEmbedUrl"
            allowfullscreen
            loading="lazy"
          ></iframe>
        </div>

        <!-- Botón -->
        <button class="submit-btn" type="submit">
          Publicar trabajo
        </button>
      </form>

    </div>
  </div>
</template>

<style scoped>

/* ----------------- */
/* LAYOUT GENERAL    */
/* ----------------- */
.page {
  padding: 40px 0 80px 0;
  background: #eef3f8;
  min-height: 100vh;
}

/* ----------------- */
/* HERO              */
/* ----------------- */
.hero {
  max-width: 900px;
  margin: 0 auto 30px auto;

  padding: 25px 30px;
  background: rgba(255,255,255,0.85);
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
  backdrop-filter: blur(10px);

  display: flex;
  align-items: center;
  gap: 16px;
}

.hero-icon {
  background: linear-gradient(135deg, #009fe3, #3bc3ff);
  width: 58px;
  height: 58px;
  border-radius: 14px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 30px;
  color: white;

  box-shadow: 0 6px 14px rgba(0,159,227,0.35);
}

.hero h1 {
  font-size: 28px;
  margin: 0;
  font-weight: 800;
}

.hero p {
  margin: 2px 0 0 0;
  color: #555;
}

/* ----------------- */
/* FORM CARD         */
/* ----------------- */
.form-card {
  max-width: 900px;
  margin: auto;

  background: white;
  padding: 30px;
  border-radius: 18px;

  box-shadow: 0 10px 28px rgba(0,0,0,0.10);
  backdrop-filter: blur(6px);
}

/* Inputs modernos */
.input-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 18px;
}

.input-group label {
  font-weight: 600;
  margin-bottom: 6px;
}

.input-group input,
.input-group textarea,
.input-group select {
  padding: 12px 14px;
  border: 1px solid #ccd6e3;
  border-radius: 10px;
  font-size: 15px;

  transition: 0.2s;
  background: #fdfdfd;
}

.input-group input:focus,
.input-group textarea:focus,
.input-group select:focus {
  border-color: #009fe3;
  box-shadow: 0 0 0 3px rgba(0,159,227,0.17);
  outline: none;
}

/* 2 columnas */
.two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

.section-title {
  margin: 25px 0 10px 0;
  font-size: 20px;
  font-weight: 700;
  color: #333;
}

/* MAPA */
.map-box {
  margin-top: 20px;
}

.map-box iframe {
  width: 100%;
  height: 300px;
  border-radius: 14px;
  border: none;
  box-shadow: 0 6px 20px rgba(0,0,0,0.12);
}

/* BOTÓN SUBMIT */
.submit-btn {
  width: 100%;
  margin-top: 25px;

  padding: 14px 0;
  background: #009fe3;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 17px;
  font-weight: 700;

  cursor: pointer;
  transition: 0.2s;

  box-shadow: 0px 8px 20px rgba(0,159,227,0.25);
}

.submit-btn:hover {
  background: #007bb1;
  transform: translateY(-2px);
}

</style>
