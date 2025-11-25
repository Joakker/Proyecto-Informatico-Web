
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { defineProps, ref, onMounted, defineEmits } from 'vue'

const props = defineProps<{
  work: { client_request_id: number, title: string, description: string, budget: number }
  isModerator?: boolean
}>()

const userType = ref<number|null>(null)
const router = useRouter()
const emit = defineEmits(['child-action'])

function goToDetails() {
  router.push(`/clientrequests/${props.work.client_request_id}`)
}

async function getUserType() {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/user/type', {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        if (!response.ok) throw new Error(`Error ${response.status}`)
        const data = await response.json()
        userType.value = data.type
    } catch (error) {
        console.error(error)
    }
}

async function deletePost() {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/client_requests/${props.work.client_request_id}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
    if (!response.ok) throw new Error(`Error ${response.status}`)
    emit('child-action', { msg: 'Se borró un post' })
  } catch (error) {
      console.error(error)
  }
}

onMounted(async () => {
    try {
        getUserType();
        const response = await fetch('http://127.0.0.1:8000/api/workerrequests')
        const data = await response.json()
    } catch (error) {
        console.error('Error fetching works:', error)
    } 
})

</script>


<template>
  <div class="card mb-3 shadow-sm work-card">
    <div class="card-body">
      <h5 class="card-title">{{ props.work.title }}</h5>
      <p class="card-text text-truncate">{{ props.work.description }}</p>
      <p class="card-text"><strong>Presupuesto:</strong> ${{ props.work.budget }}</p>
      <button @click="goToDetails" class="btn btn-primary btn-sm">Ver más</button>
      <template v-if="userType === 3">
        <button @click="deletePost" class="btn btn-primary btn-sm">Eliminar publicación</button>
      </template>
    </div>
  </div>
</template>

<style scoped>
.work-card {
  transition: transform 0.2s;
}
.work-card:hover {
  transform: translateY(-3px);
}
.card-text.text-truncate {
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
