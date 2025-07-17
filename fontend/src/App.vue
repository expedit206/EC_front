<!-- src/App.vue -->
<template>

  <div class="min-h-screen mt-16 mb-8 ">
    <AppHeader />
    <router-view />
  </div>
</template>


<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from './stores/Auth';
import AppHeader from './components/AppHeader.vue';
const authStore = useAuthStore();

onMounted(async () => {
  await authStore.checkAuth();
});
</script>