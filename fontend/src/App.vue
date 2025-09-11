<template>
  <div class=" relative overflow-hidden grid  lg:grid-rows-[9%_90%]  grid-rows-[10%_83%_7%] h-full   
  ">
    <HeaderBar />
    <router-view />

    <FooterBar />

  </div>


 
</template>

<script setup>
import { onMounted } from 'vue';
import HeaderBar from './components/HeaderBar.vue';
import FooterBar from './components/FooterBar.vue';

</script>