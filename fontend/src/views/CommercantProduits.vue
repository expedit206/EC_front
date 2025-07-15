<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/Auth';
import apiClient from '../api';
import { useToast } from 'vue-toastification';

const authStore = useAuthStore();
const toast = useToast();
const produits = ref([]);

const fetchProduits = async () => {
    try {
        const response = await apiClient.get('/commercant/produits');
        produits.value = response.data.produits;
    } catch (error) {
        toast.error('Erreur lors du chargement des produits');
    }
};

onMounted(fetchProduits);
</script>

<template>
    <div class="min-h-screen bg-gray-100 pt-16 pb-20 px-4 sm:px-6">
        <div class="container mx-auto">
            <h1 class="text-2xl sm:text-3xl font-bold text-[var(--espace-vert)] mb-6">
                <i class="fas fa-box-open mr-2 text-[var(--espace-or)]"></i> Mes Produits
            </h1>
            <div v-if="produits.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div v-for="produit in produits" :key="produit.id"
                    class="bg-[var(--espace-blanc)] rounded-lg shadow-md p-4 hover:shadow-lg transition">
                    <img v-if="produit.photo_url" :src="produit.photo_url" :alt="produit.nom"
                        class="w-full h-40 object-cover rounded-lg mb-4" />
                    <h2 class="text-lg font-semibold text-[var(--espace-vert)]">{{ produit.nom }}</h2>
                    <p class="text-sm text-[var(--espace-gris)]">{{ produit.description || 'Aucune description' }}</p>
                    <p class="text-md font-bold text-[var(--espace-or)] mt-2">{{ produit.prix }} XAF</p>
                    <p class="text-sm text-[var(--espace-gris)]">Stock: {{ produit.stock }}</p>
                    <RouterLink :to="`/commercant/produits/${produit.id}/edit`"
                        class="mt-4 inline-block bg-[var(--espace-vert)] text-[var(--espace-blanc)] px-4 py-2 rounded-lg hover:bg-[var(--espace-or)] transition">
                        Modifier
                    </RouterLink>
                </div>
            </div>
            <p v-else class="text-center text-[var(--espace-gris)]">Aucun produit trouvé.</p>
            <RouterLink to="/commercant/produits/ajouter"
                class="fixed bottom-24 right-4 bg-[var(--espace-or)] text-[var(--espace-vert)] p-3 rounded-full shadow-lg hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] transition">
                <i class="fas fa-plus"></i>
            </RouterLink>
        </div>
    </div>
</template>

<style scoped>
:root {
    --espace-vert: #14532d;
    --espace-or: #facc15;
    --espace-blanc: #ffffff;
    --espace-gris: #6b7280;
}

.font-poppins {
    font-family: 'Poppins', sans-serif;
}
</style>