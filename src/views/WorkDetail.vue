<script setup lang="ts">
import { ref, onMounted, computed } from "vue"
import { useRoute } from "vue-router"
import ReviewForm from "@/components/ReviewForm.vue"

const route = useRoute()
const workId = Number(route.params.id)

const work = ref<any>(null)
const userInfo = ref<any>(null)
const userType = ref<number | null>(null)


async function loadUserInfo() {
  const res = await fetch("http://127.0.0.1:8000/api/user", {
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
      "Accept": "application/json"
    }
  })
  userInfo.value = await res.json()
}

async function loadUserType() {
  const res = await fetch("http://127.0.0.1:8000/api/user/type", {
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
      "Accept": "application/json"
    }
  })
  userType.value = (await res.json()).type
}

//datos del work
async function loadWork() {
  const res = await fetch(`http://127.0.0.1:8000/api/works/${workId}`, {
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
      "Accept": "application/json"
    }
  })
  work.value = await res.json()
}


const canReview = computed(() => {
  if (!work.value || !userInfo.value) return false
  if (work.value.state !== "aceptado") return false

  const id = userInfo.value.user_id

  return (
    id === work.value.client?.user?.user_id ||
    id === work.value.worker?.user?.user_id
  )
})

//a quien reseñar
const reviewedUserId = computed(() => {
  if (!work.value || !userInfo.value) return null

  const loggedId = userInfo.value.user_id
  const clientId = work.value.client?.user?.user_id
  const workerId = work.value.worker?.user?.user_id

  if (!clientId || !workerId) return null

  return loggedId === clientId ? workerId : clientId
})

onMounted(async () => {
  await Promise.all([loadUserInfo(), loadUserType(), loadWork()])
})
</script>

<template>
  <div class="container my-4" v-if="work">
    <h2>
        {{ work.client_request?.title }}
    </h2>
   <!--
    <p><strong>Estado:</strong> {{ work.state }}</p>

    <p><strong>Cliente:</strong>
      {{ work.client?.user?.first_name }} {{ work.client?.user?.last_name }}
    </p>

    <p><strong>Maestro:</strong>
      {{ work.worker?.user?.first_name }} {{ work.worker?.user?.last_name }}
    </p> -->

    <!-- Formulario de reseña -->
    <ReviewForm
      v-if="canReview"
      :workId="workId"
      :reviewedId="reviewedUserId"
      :reviewerId="userInfo?.user_id"
    />
  </div>
</template>
