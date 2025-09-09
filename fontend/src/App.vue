<template>
  <div class=" relative overflow-hidden grid  lg:grid-rows-[8%_90%]  grid-rows-[10%_83%_7%] h-full   
  ">
    <HeaderBar />
    <router-view />
    <FooterBar />

  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from './stores/Auth';
import HeaderBar from './components/HeaderBar.vue';
import FooterBar from './components/FooterBar.vue';
import JetonMarket from './views/JetonMarket.vue';
const authStore = useAuthStore();
onMounted(async () => {
  // await authStore.checkAuth();
});
</script>