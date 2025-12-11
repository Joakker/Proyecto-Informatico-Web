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

      <small class="sender-name">
        {{ m.sender_id === currentUserId ? "Tú" : m.sender?.first_name }}
      </small>
      <div class="bubble">{{ m.content }}</div>
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

.sender-name {
  font-size: 12px;
  color: #777;
  margin-bottom: 3px;
  display: block;
}

.message.mine .sender-name {
  text-align: right;
}
</style>

