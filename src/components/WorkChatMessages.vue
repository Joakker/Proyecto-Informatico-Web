<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  conversationId: number,
  currentUserId: number
}>()

const messages = ref<any[]>([])
let interval: any = null

async function loadMessages() {
  const response = await fetch(
    `http://127.0.0.1:8000/api/work-conversations/${props.conversationId}/messages`,
    {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Accept": "application/json",
      }
    }
  )

  if (response.ok) {
    const json = await response.json()
    messages.value = json.data
  }
}

onMounted(() => {
  loadMessages()
  window.addEventListener("workchat:update", loadMessages)

  interval = setInterval(loadMessages, 2000)
})

onUnmounted(() => {
  clearInterval(interval)
  window.removeEventListener("workchat:update", loadMessages)
})
</script>

<template>
  <div class="messages-box">
    <div
      v-for="m in messages"
      :key="m.message_id"
      class="message"
      :class="{ mine: m.sender_id === currentUserId }"
    >
      <div class="bubble">{{ m.content }}</div>
      <small>{{ m.created_at }}</small>
    </div>
  </div>
</template>

<style scoped>
.messages-box {
  border: 1px solid #ddd;
  height: 350px;
  overflow-y: auto;
  padding: 10px;
  border-radius: 8px;
}
.message {
  margin-bottom: 12px;
}
.message.mine {
  text-align: right;
}
.bubble {
  display: inline-block;
  background: #eee;
  padding: 10px 14px;
  border-radius: 10px;
}
.message.mine .bubble {
  background: #cde5ff;
}
</style>

