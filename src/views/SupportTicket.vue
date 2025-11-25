<script setup lang="ts">
import { ref, onMounted } from 'vue'

const messages = ref<any[]>([])
const newMessage = ref('')
const userInfo = ref();

const props = defineProps<{
  conversation_id: number
}>()

async function getMessages() {
  const response = await fetch(`http://127.0.0.1:8000/api/conversations/${props.conversation_id}/messages`, {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  })
  messages.value = await response.json()
  console.log(messages.value)
}

async function sendMessage() {
  if (!newMessage.value.trim()) return

  const response = await fetch(
    `http://127.0.0.1:8000/api/conversations/${props.conversation_id}/messages`,
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
  getMessages();
}

async function getUserInfo() {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/user', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        if (!response.ok) throw new Error(`Error ${response.status}`)
        const data = await response.json()
        userInfo.value = data
    } catch (error) { console.error(error) }
}

onMounted(async () => {
  try {
    await getUserInfo();
    await getMessages();
  } catch (error) {
    console.error('Error fetching works:', error)
  }
})


</script>

<template>
    <div class="conversation">
        <div v-for="msg in messages" :key="msg.message_id" class="message">
        <p><strong>{{ msg.sender?.first_name || 'Usuario' }} {{ userInfo.user_id === msg.sender_id ? '(You)' : '(User)' }}: </strong> {{ msg.content }}</p>
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