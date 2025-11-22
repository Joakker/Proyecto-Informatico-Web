<script setup lang="ts">
import { ref, onMounted } from 'vue'

const conversation = ref<any>(null)
const messages = ref<any[]>([])
const newMessage = ref('')

async function getMessages(conversationId: number) {
  const response = await fetch(`http://127.0.0.1:8000/api/conversations/${conversationId}/messages`, {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  })
  messages.value = await response.json()
}

async function sendMessage() {
  if (!newMessage.value.trim()) return

  const response = await fetch(
    `http://127.0.0.1:8000/api/conversations/${conversation.value.conversation_id}/messages`,
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ content: newMessage.value })
    }
  )

  const data = await response.json()
  messages.value.push(data.data)
  newMessage.value = '' // limpiar input
}


async function getChat() {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/support_chat', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}` // token from login
        }
        })

        if (!response.ok) {
            throw new Error(`Error ${response.status}`)
        }

        const data = await response.json()
        conversation.value = data.conversation
        console.log('Conversación:', conversation.value)
    } catch (error) {
        console.error(error)
    }
}

onMounted(async () => {
  try {
    await getChat()
    if (conversation.value) {
      await getMessages(conversation.value.conversation_id)
    }
  } catch (error) {
    console.error('Error fetching works:', error)
  }
})



</script>

<template>
    <h1>Soporte</h1>

    <div v-if="conversation" class="conversation">
        <div v-for="msg in messages" :key="msg.message_id" class="message">
        <p><strong>{{ msg.sender?.first_name || 'Usuario' }}:</strong> {{ msg.content }}</p>
        </div>

        <div class="chat-input">
            <input
                v-model="newMessage"
                type="text"
                placeholder="Escribe tu mensaje..."
                @keyup.enter="sendMessage"
            />
            <button @click="sendMessage">Enviar</button>
        </div>

    </div>
</template>

<style>

.conversation {
  display: flex;
  flex-direction: column;
  border-width: 2px;
  border-color: gray;
  border-style: solid;
}

</style>