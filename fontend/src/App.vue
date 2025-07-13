<!-- src/App.vue -->
<template>
  <div class="min-h-screen  ">
    <router-view />
  </div>
</template>

<script setup>
//  './store'
// import { onMounted } from 'vue'

// const authStore = useAuthStore()

// onMounted(async () => {
//   if (authStore.token) {
//     try {
//       await authStore.fetchUser()
//     } catch (error) {
//       console.error('Échec de fetchUser au montage:', error)
//       // Ne pas déconnecter automatiquement
//     }
//   }
// })
</script>