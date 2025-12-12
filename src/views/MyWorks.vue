<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()

//estados
const userType = ref<number | null>(null)
const works = ref<any[]>([])
const loading = ref(true)


async function loadUserType() {
  const res = await fetch("http://127.0.0.1:8000/api/user/type", {
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
      "Accept": "application/json"
    }
  })

  const data = await res.json()
  userType.value = data.type
}


// Cargar trabajos según tipo

async function loadWorks() {
  let endpoint = ""

  if (userType.value === 1) {
    endpoint = "http://127.0.0.1:8000/api/my-works" // cliente
  } else if (userType.value === 2) {
    endpoint = "http://127.0.0.1:8000/api/my-worked-jobs" // maestro
  } else {
    works.value = []
    return
  }

  const res = await fetch(endpoint, {
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
      "Accept": "application/json"
    }
  })

  works.value = await res.json()
}


onMounted(async () => {
  await loadUserType()
  await loadWorks()
  loading.value = false
})


function goToWorkDetail(id: number) {
  router.push(`/work/${id}`)
}
</script>

<template>
  <div class="container my-5">

    <h2 class="mb-4">
      {{ userType === 1 ? "Mis trabajos solicitados" : "Mis trabajos realizados" }}
    </h2>

    <hr>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary"></div>
    </div>

    <div v-else>
      
      <div v-if="works.length === 0" class="text-muted">
        No tienes trabajos aún.
      </div>

      <div
      
        v-for="work in works"
        :key="work.work_id"
        class="card mb-3 shadow-sm p-3"
      >
        <h5>
            {{ work.client_request?.title }}
        </h5>

        <!-- Mostrar título del ClientRequest -->
        <p><strong>Título:</strong> {{ work.client_request?.title }}</p>

        <!-- Mostrar nombres -->
        <p>
          <strong>Cliente:</strong>
          {{ work.client?.user?.first_name }} {{ work.client?.user?.last_name }}
        </p>

        <p>
          <strong>Maestro:</strong>
          {{ work.worker?.user?.first_name }} {{ work.worker?.user?.last_name }}
        </p>

        <p>
          <strong>Estado:</strong> 
          <span class="badge bg-info">{{ work.state }}</span>
        </p>

        <div class="d-flex justify-content-center">
            <button class="btn btn-primary btn-sm px-3 py-1" @click="goToWorkDetail(work.work_id)">
                Dejar reseña
            </button>
        </div>
      </div>

    </div>

  </div>
</template>

<style scoped>
.card {
  border-radius: 10px;
  max-width: 1000px;
  margin: 0 auto; 
}

</style>
