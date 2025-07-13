<!-- src/views/Home.vue -->
<template>
    <div class="container mx-auto p-4 sm:p-6">
        <AppHeader />
        <h1 class="text-2xl sm:text-3xl font-bold text-[var(--espace-vert)] mb-4 flex items-center">
            <i class="fas fa-home mr-2"></i> Bienvenue sur Espace Cameroun
        </h1>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <ProductCard v-for="produit in produits" :key="produit.id" :produit="produit" />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useToast } from 'vue-toastification'
import ProductCard from '../components/ProductCard.vue'
import AppHeader from '../components/AppHeader.vue'
import apiClient from "../api";

const produits = ref([])
const toast = useToast()

onMounted(async () => {
    try {
        const response = await apiClient.get('produits')
        console.log(response.data);
        
        produits.value = response.data.produits
    } catch (error) {
        toast.error('Erreur lors du chargement des produits')
    }
})
</script>