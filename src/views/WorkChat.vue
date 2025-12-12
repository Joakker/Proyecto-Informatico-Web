<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import WorkChatMessages from '@/components/WorkChatMessages.vue'
import WorkChatInput from '@/components/WorkChatInput.vue'

const route = useRoute()
const conversationId = Number(route.params.id)

const loading = ref(true)
const conversation = ref<any>(null)
const userInfo = ref<any>(null)

// Saber si el usuario logeado es cliente
const isClient = computed(() => userInfo.value?.client !== null)
const work = computed(() => conversation.value?.work)

// ---------------------------
// Cargar usuario
// ---------------------------
async function loadCurrentUser() {
  const res = await fetch("http://127.0.0.1:8000/api/user", {
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
    }
  })

  if (res.ok) {
    userInfo.value = await res.json()
  }
}

// ---------------------------
// Cargar conversación
// ---------------------------
async function loadConversation() {
  const res = await fetch(`http://127.0.0.1:8000/api/work-conversations/${conversationId}`, {
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
    }
  })

  if (res.ok) {
    conversation.value = await res.json()
  }
}

// ---------------------------
// Seleccionar maestro
// ---------------------------
async function selectMaster() {
  if (!confirm("¿Deseas seleccionar a este maestro?")) return;

  const reqId = work.value.client_request_id;
  const workId = work.value.work_id;

  const res = await fetch(
    `http://127.0.0.1:8000/api/client-requests/${reqId}/select-master`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ work_id: workId })
    }
  )

  const data = await res.json()

  if (!res.ok) {
    alert(data.error || "No se pudo seleccionar al maestro.")
    return
  }

  alert("Maestro seleccionado con éxito.")

  await loadConversation()
}

onMounted(async () => {
  await loadCurrentUser()
  await loadConversation()
  loading.value = false
})
</script>


<template>
  <div class="container py-4">
    <h2>Chat del Trabajo</h2>
    <hr />

    <div v-if="loading" class="text-center">
      <div class="spinner-border text-primary"></div>
    </div>

    <div v-else class="chat-container">
      <h5 v-if="conversation">
        <!--Trabajo #{{ conversation.work?.work_id || 'N/A' }}
        
        <span v-if="conversation.client?.user">
            — Cliente: {{ conversation.client.user.first_name }} {{ conversation.client.user.last_name }}
        </span>

        <span v-if="conversation.worker?.user">
            — Maestro: {{ conversation.worker.user.first_name }} {{ conversation.worker.user.last_name }}
        </span> -->

        <!-- Mostrar solo al cliente si NO es el user logeado -->
        <span
            v-if="conversation.client?.user
            && conversation.client.user.user_id !== userInfo.user_id"
        >
             {{ conversation.client.user.first_name }} {{ conversation.client.user.last_name }}
        </span>

        <!-- Mostrar solo al maestro si NO es el user logeado -->
        <span
            v-if="conversation.worker?.user
            && conversation.worker.user.user_id !== userInfo.user_id"
        >
             {{ conversation.worker.user.first_name }} {{ conversation.worker.user.last_name }}
        </span>
       </h5>


      <WorkChatMessages
        :conversation-id="conversationId"
        :current-user-id="userInfo.user_id"
      />

      <WorkChatInput :conversation-id="conversationId" />
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 700px;
}
</style>

