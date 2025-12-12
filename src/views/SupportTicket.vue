<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";

const props = defineProps<{
  conversation_id: number;
}>();

const messages = ref<any[]>([]);
const newMessage = ref("");
const userInfo = ref<any>(null);

const chatBox = ref<HTMLDivElement | null>(null);

function scrollToBottom() {
  nextTick(() => {
    if (chatBox.value) {
      chatBox.value.scrollTop = chatBox.value.scrollHeight;
    }
  });
}

async function getUserInfo() {
  const res = await fetch("http://127.0.0.1:8000/api/user", {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  userInfo.value = await res.json();
}

async function getMessages() {
  const response = await fetch(
    `http://127.0.0.1:8000/api/conversations/${props.conversation_id}/messages`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  messages.value = await response.json();
  scrollToBottom();
}

async function sendMessage() {
  if (!newMessage.value.trim()) return;

  const response = await fetch(
    `http://127.0.0.1:8000/api/conversations/${props.conversation_id}/messages`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ content: newMessage.value }),
    }
  );

  const data = await response.json();

  // Añadir sin esperar recarga completa
  messages.value.push({
    ...data.data,
    sender: {
      first_name: userInfo.value.first_name,
      last_name: userInfo.value.last_name,
    },
  });

  newMessage.value = "";
  scrollToBottom();

  // Recargar correctamente el historial
  await getMessages();
}

onMounted(async () => {
  await getUserInfo();
  await getMessages();
});
</script>

<template>
  <div class="ticket-box">

    <!-- Mensajes -->
    <div class="messages-container" ref="chatBox">
      <div
        v-for="msg in messages"
        :key="msg.message_id"
        class="msg-wrapper"
        :class="{
          me: msg.sender_id === userInfo?.user_id,
          other: msg.sender_id !== userInfo?.user_id,
        }"
      >
        <div class="msg-bubble">
          <p>{{ msg.content }}</p>
        </div>
        <span class="msg-name">
          {{ msg.sender?.first_name || 'Usuario' }}
        </span>
      </div>
    </div>

    <!-- Input -->
    <div class="input-row">
      <input
        v-model="newMessage"
        type="text"
        placeholder="Responder ticket..."
        @keyup.enter="sendMessage"
      />
      <button @click="sendMessage">Enviar</button>
    </div>

  </div>
</template>

<style scoped>
.ticket-box {
  background: #ffffff;
  border-radius: 14px;
  padding: 15px;
  border: 1px solid #e2e8f0;
}

.messages-container {
  max-height: 250px;
  overflow-y: auto;
  padding: 10px 5px;
  background: #f7f9fc;
  border-radius: 10px;
}

.msg-wrapper {
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
}

.msg-wrapper.me {
  align-items: flex-end;
}

.msg-wrapper.other {
  align-items: flex-start;
}

.msg-bubble {
  max-width: 70%;
  padding: 10px 14px;
  border-radius: 14px;
  font-size: 14px;
  line-height: 1.4;
}

.msg-wrapper.me .msg-bubble {
  background: #009fe3;
  color: white;
  border-bottom-right-radius: 4px;
}

.msg-wrapper.other .msg-bubble {
  background: white;
  border: 1px solid #dce3eb;
  color: #333;
  border-bottom-left-radius: 4px;
}

.msg-name {
  margin-top: 3px;
  font-size: 11px;
  opacity: 0.7;
}

.input-row {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.input-row input {
  flex: 1;
  padding: 10px;
  border: 1px solid #cfd8e3;
  border-radius: 10px;
}

.input-row input:focus {
  border-color: #009fe3;
  box-shadow: 0 0 0 2px rgba(0, 159, 227, 0.2);
  outline: none;
}

.input-row button {
  padding: 10px 15px;
  border: none;
  background: #009fe3;
  color: white;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
}

.input-row button:hover {
  background: #007bb1;
}
</style>
