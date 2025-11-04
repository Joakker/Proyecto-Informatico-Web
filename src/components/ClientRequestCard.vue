
<script setup lang="ts">
    interface Work {
        title: string
        description: string
        price: number
    }

    const props = defineProps<{
        work: Work
    }>()
</script>

<template>
  <div class="work-card">
    <h3>{{ work.title }}</h3>
    <p>{{ work.description }}</p>
    <p><strong>Price:</strong> ${{ work.price }}</p>
    <!-- Add image, tags, buttons, etc. -->
  </div>
</template>

<style scoped>
.work-card {
  border: 1px solid #ccc;
  padding: 1rem;
  margin-bottom: 1rem;
}
</style>