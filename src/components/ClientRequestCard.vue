<script setup lang="ts">
import { useRouter } from "vue-router";
import { defineProps, ref, onMounted, defineEmits } from "vue";

const props = defineProps<{
  work: {
    client_request_id: number;
    title: string;
    description: string;
    budget: number;
  };
}>();

const userType = ref<number | null>(null);
const showModal = ref(false);
const isDeleting = ref(false);

const router = useRouter();
const emit = defineEmits<{
  (e: 'child-action', payload: { id: number }): void
}>();

function goToDetails() {
  router.push(`/clientrequests/${props.work.client_request_id}`);
}

async function getUserType() {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/user/type", {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await response.json();
    userType.value = data.type;
  } catch (error) {
    console.error(error);
  }
}

async function deletePostConfirmed() {
  try {
    isDeleting.value = true;

    const response = await fetch(
      `http://127.0.0.1:8000/api/client_requests/${props.work.client_request_id}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!response.ok) {
      console.error(`Error ${response.status}`);
      // si quieres algo visual:
      // alert('No se pudo eliminar la solicitud');
      return;
    }

    // Avisar al padre cuál id se eliminó
    emit("child-action", { id: props.work.client_request_id });

  } catch (error) {
    console.error(error);
  } finally {
    isDeleting.value = false;
    showModal.value = false; // SIEMPRE se cierra el modal
  }
}

onMounted(() => {
  getUserType();
});
</script>

<template>
  <div class="work-card">
    <!-- HEADER -->
    <div class="header">
      <div class="icon-circle">🔧</div>
    </div>

    <!-- TITLE -->
    <h3 class="title">{{ props.work.title }}</h3>

    <!-- DESCRIPTION -->
    <p class="description">{{ props.work.description }}</p>

    <!-- BUDGET -->
    <p class="budget">
      Presupuesto: <span class="amount">${{ props.work.budget }}</span>
    </p>

    <!-- ACTIONS -->
    <div class="buttons">
      <button class="btn-primary" @click.stop="goToDetails">
        Ver más
      </button>

      <button
        v-if="userType === 1 || userType === 3"
        class="btn-delete"
        @click.stop="showModal = true"
      >
        Eliminar
      </button>
    </div>

    <!-- MODAL -->
    <Teleport to="body">
      <div v-if="showModal" class="modal-backdrop">
        <div class="modal-box">
          <h3>¿Eliminar solicitud?</h3>
          <p>Esta acción no se puede deshacer.</p>

          <div class="modal-buttons">
            <button class="cancel" @click="showModal = false">
              Cancelar
            </button>
            <button
              class="confirm"
              :disabled="isDeleting"
              @click="deletePostConfirmed"
            >
              {{ isDeleting ? 'Eliminando...' : 'Eliminar' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.work-card {
  width: 360px;
  background: rgba(255, 255, 255, 0.92);
  border-radius: 20px;
  padding: 26px;
  cursor: default;
  position: relative;
  overflow: visible !important;

  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);

  transition: 0.25s ease-in-out;
}

.work-card:hover {
  transform: translateY(-4px);
}

/* HEADER */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.icon-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #009fe3, #45c6ff);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
}


/* CONTENT */
.title {
  margin-top: 18px;
  font-size: 20px;
  font-weight: bold;
}

.description {
  margin: 10px 0;
  color: #4d4d4d;
}

.budget {
  margin-bottom: 20px;
}

.amount {
  font-weight: bold;
}

/* BUTTONS */
.buttons {
  display: flex;
  gap: 10px;
}

.btn-primary {
  flex: 1;
  padding: 12px 0;
  border-radius: 10px;
  background: #ffc24a;
  border: none;
  font-weight: 600;
  transition: 0.2s;
}

.btn-primary:hover {
  background: #e0a23a;
}

.btn-delete {
  flex: 1;
  padding: 12px 0;
  border-radius: 10px;
  background: #ff5555;
  border: none;
  color: white;
  font-weight: 600;
  transition: 0.2s;
}

.btn-delete:hover {
  background: #e04646;
}

/* MODAL */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999999;
}

.modal-box {
  background: white;
  padding: 25px 30px;
  width: 330px;
  border-radius: 14px;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.25);
  animation: zoomIn 0.18s ease-out;
}

.modal-buttons {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 12px;
}

.cancel {
  background: #d3d3d3;
  padding: 8px 16px;
  border-radius: 10px;
  border: none;
  font-weight: 600;
  cursor: pointer;
}

.confirm {
  background: #ff5555;
  color: white;
  padding: 8px 16px;
  border-radius: 10px;
  border: none;
  font-weight: 600;
  cursor: pointer;
}

.confirm:disabled {
  opacity: 0.7;
  cursor: default;
}

@keyframes zoomIn {
  from {
    transform: scale(0.85);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
