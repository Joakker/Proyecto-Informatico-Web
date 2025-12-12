<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"

//estados
const chats = ref<any[]>([])
const loading = ref(true)
const userInfo = ref<any>(null)
const router = useRouter()

async function loadCurrentUser() {
  const resp = await fetch("http://127.0.0.1:8000/api/user", {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })

  if (!resp.ok) throw new Error("No se pudo obtener usuario")

  userInfo.value = await resp.json()
}

// obtener lista de chats
async function loadChats() {
  const resp = await fetch("http://127.0.0.1:8000/api/work-chats", {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })

  if (!resp.ok) throw new Error("No se pudo obtener chats")

  chats.value = await resp.json()

  // ordenar por actualizado recientemente
  chats.value.sort((a: any, b: any) => {
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  })
}

// abrir chat
function openChat(id: number) {
  router.push(`/work-chat/${id}`)
}

function formatChileTime(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleString("es-CL", {
    timeZone: "America/Santiago",
    dateStyle: "medium",
    timeStyle: "short"
  })
}


onMounted(async () => {
  try {
    await loadCurrentUser()
    await loadChats()
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="container py-4">
    <h2 class="fw-bold">Mis Chats de Trabajo</h2>
    <hr />

    <div v-if="loading" class="text-center">
      <div class="spinner-border text-primary"></div>
    </div>

    <div v-else>
      <div
        v-for="chat in chats"
        :key="chat.conversation_id"
        class="chat-item"
        @click="openChat(chat.conversation_id)"
      >
        <!-- título del trabajo -->
        <h5 class="fw-bold">
          {{ chat.work.client_request?.title || "Trabajo sin título" }}
        </h5>

        <!-- nombre de usuarios -->
        <p class="m-0" v-if="chat.client?.user && chat.client.user.user_id !== userInfo.user_id">
            Cliente: {{ chat.client.user.first_name }} {{ chat.client.user.last_name }}
        </p>

        <p class="m-0" v-if="chat.worker?.user && chat.worker.user.user_id !== userInfo.user_id">
            Maestro: {{ chat.worker.user.first_name }} {{ chat.worker.user.last_name }}
        </p>

        <!-- estado -->
        <small class="text-muted d-block">Estado: {{ chat.work.state }}</small>

        <!-- fecha 
        <small class="text-muted">
            Última actualización: {{ formatChileTime(chat.updated_at) }}
        </small>-->
      </div>

      <p v-if="chats.length === 0" class="text-muted text-center mt-4">
        No tienes chats de trabajo aún.
      </p>
    </div>
  </div>
</template>

<style scoped>
.chat-item {
  border: 1px solid #dee2e6;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 15px;
  background: #fdfdfd;
  transition: background 0.2s ease;
  cursor: pointer;
}

.chat-item:hover {
  background: #eef6ff;
}
</style>
