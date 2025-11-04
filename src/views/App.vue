<template>
  <div>
    <nav>
        <div>
            <router-link to="/">Home</router-link>
        </div>
        
        <div class="right-nav">
            <router-link to="/login">Log in</router-link>
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
        display: flex;
        align-items: end;
        justify-content: space-between;
        gap: 1rem;
    }

</style>
