<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{ conversationId: number }>()

const message = ref("")

async function sendMessage() {
  if (!message.value.trim()) return

  const res = await fetch(
    `http://127.0.0.1:8000/api/work-conversations/${props.conversationId}/messages`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ content: message.value })
    }
  )

  if (res.ok) {
    message.value = ""
    window.dispatchEvent(new Event("workchat:update"))
  }
}
</script>

<template>
  <div class="input-area">
    <input 
      v-model="message" 
      class="form-control"
      placeholder="Escribe un mensaje..."
      @keyup.enter="sendMessage"
    />
    <button class="btn btn-primary ms-2" @click="sendMessage">
      Enviar
    </button>
  </div>
</template>

<style scoped>
.input-area {
  margin-top: 12px;
  display: flex;
}
</style>
