<template>
  <div>
    <nav>
        <div>
            <router-link to="/">Home</router-link>
        </div>
        <div class="right-nav">
            <router-link to="/signup">Sign up</router-link>
        </div>
    </nav>

    <router-view />
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
    nav {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    }

    .right-nav {
        align-items: end;
    }

</style>
