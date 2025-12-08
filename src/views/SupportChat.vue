<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'

const conversation = ref<any>(null)
const messages = ref<any[]>([])
const newMessage = ref('')

// referencia al contenedor del chat
const chatBox = ref<HTMLDivElement | null>(null)

// baja el scroll al fondo
function scrollToBottom() {
  nextTick(() => {
    if (chatBox.value) {
      chatBox.value.scrollTop = chatBox.value.scrollHeight
    }
  })
}

// si el usuario está abajo, seguir bajando mientras escribe
function handleTypingScroll() {
  if (!chatBox.value) return

  const nearBottom =
    chatBox.value.scrollHeight - chatBox.value.scrollTop - chatBox.value.clientHeight < 120

  if (nearBottom) scrollToBottom()
}

/* obtener mensajes */
async function getMessages(conversationId: number) {
  const response = await fetch(
    `http://127.0.0.1:8000/api/conversations/${conversationId}/messages`,
    {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  )

  messages.value = await response.json()
  scrollToBottom()
}

/* enviar mensaje */
async function sendMessage() {
  if (!newMessage.value.trim()) return

  const res = await fetch(
    `http://127.0.0.1:8000/api/conversations/${conversation.value.conversation_id}/messages`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ content: newMessage.value }),
    }
  )

  const data = await res.json()

  // obtener usuario actual
  const storedUser = localStorage.getItem('user')
  let currentUser = null

  if (storedUser) {
    try {
      currentUser = JSON.parse(storedUser)
    } catch (e) {
      console.error('No se pudo parsear el usuario almacenado', e)
    }
  }

  // agregar mensaje con sender correcto
  messages.value.push({
    ...data.data,
    sender: currentUser
      ? {
          first_name: currentUser.first_name,
          last_name: currentUser.last_name,
        }
      : null,
  })

  newMessage.value = ''
  scrollToBottom()
}

/* iniciar chat */
async function getChat() {
  const response = await fetch('http://127.0.0.1:8000/api/support_chat', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })

  const data = await response.json()
  conversation.value = data.conversation
}

onMounted(async () => {
  await getChat()

  if (conversation.value) {
    await getMessages(conversation.value.conversation_id)
  }
})
</script>

<template>
  <div class="chat-wrapper">

    <div class="chat-header">
      <h2>Soporte en línea</h2>
      <p>Estás conversando con un moderador de Maestro Chasquilla.</p>
    </div>

    <div class="chat-box" ref="chatBox">
      <div
        v-for="msg in messages"
        :key="msg.message_id"
        class="message-container"
        :class="{
          me: msg.sender_id === conversation.user_id,
          mod: msg.sender_id !== conversation.user_id,
        }"
      >
        <div class="msg-bubble">
          <p>{{ msg.content }}</p>
        </div>

        <span class="msg-meta">{{ msg.sender?.first_name }}</span>
      </div>
    </div>

    <div class="chat-input">
      <input
        v-model="newMessage"
        type="text"
        placeholder="Escribe un mensaje..."
        @keyup.enter="sendMessage"
        @input="handleTypingScroll"
      />
      <button @click="sendMessage">Enviar</button>
    </div>

  </div>
</template>

<style scoped>
.chat-wrapper {
  max-width: 800px;
  margin: 0 auto;
  margin-top: 40px;
  background: #ffffff;
  padding: 0;
  border-radius: 20px;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  height: 75vh;
}

/* HEADER */
.chat-header {
  padding: 20px;
  background: linear-gradient(135deg, #009fe3, #3bc3ff);
  color: white;
  border-radius: 20px 20px 0 0;
}

.chat-header h2 {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
}

.chat-header p {
  margin: 4px 0 0 0;
  font-size: 14px;
}

/* CHAT BOX */
.chat-box {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background: #f3f7fb;
}

/* MENSAJES */
.message-container {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
}

.message-container.me {
  align-items: flex-end;
}

.message-container.mod {
  align-items: flex-start;
}

.msg-bubble {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 15px;
  font-size: 15px;
  line-height: 1.4;
}

.message-container.me .msg-bubble {
  background: #009fe3;
  color: white;
  border-bottom-right-radius: 0;
}

.message-container.mod .msg-bubble {
  background: white;
  color: #333;
  border: 1px solid #dce3eb;
  border-bottom-left-radius: 0;
}

.msg-meta {
  margin-top: 3px;
  font-size: 12px;
  color: gray;
}

/* INPUT */
.chat-input {
  display: flex;
  padding: 15px;
  border-top: 1px solid #e1e5eb;
  background: #ffffff;
}

.chat-input input {
  flex: 1;
  padding: 12px;
  border: 1px solid #cfd8e3;
  border-radius: 10px;
  outline: none;
}

.chat-input input:focus {
  border-color: #009fe3;
  box-shadow: 0 0 0 2px rgba(0, 159, 227, 0.25);
}

.chat-input button {
  margin-left: 10px;
  padding: 12px 18px;
  background: #009fe3;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}

.chat-input button:hover {
  background: #007bb1;
}
</style>
