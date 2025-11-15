
<script setup lang="ts">
  import { computed, ref, onMounted } from 'vue'
  import WorkRequestCard from '../components/ClientRequestCard.vue'
  import { useRouter } from 'vue-router'
  import { useUserStore } from '@/stores/user'

  interface WorkRequest {
      id: number
      title: string
      description: string
      budget: number
  }

  const router = useRouter()
  const works = ref<WorkRequest[]>([])
  const loading = ref(true)

  const userStore = useUserStore()
  const isLoggedIn = computed(() => userStore.user !== null)

  const userType = ref<number|null>(null)

  async function getUserType() {
      try {
          const response = await fetch('http://127.0.0.1:8000/api/user/type', {
          method: 'GET',
          headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}` // token from login
          }
          })

          if (!response.ok) {
          throw new Error(`Error ${response.status}`)
          }

          const data = await response.json()
          userType.value = data.type
      } catch (error) {
          console.error(error)
      }
  }

  onMounted(async () => {
      try {
          getUserType();
          const response = await fetch('http://127.0.0.1:8000/api/clientrequests')
          const data = await response.json()
          works.value = data
      } catch (error) {
          console.error('Error fetching works:', error)
      } finally {
          loading.value = false
      }
  })

  function toCreateClientPost() {
    router.push('/createclientrequest')
  }
</script>

<template>
  <div>
    <h2>Solicitudes de trabajo</h2>

    <template v-if="isLoggedIn">
      <template v-if="userType === 1">
        <button @click="toCreateClientPost">Pedir un maestro</button>
      </template>
    </template>

    <hr></hr>

    <div v-if="loading">Cargando pedidos...</div>
    <div v-else>
      <div class="request-container">
        <WorkRequestCard v-for="work in works" :key="work.id" :work="work" />
      </div>
    </div>
  </div>
</template>

<style scoped>

.request-container {
  margin: 3rem;
}

</style>