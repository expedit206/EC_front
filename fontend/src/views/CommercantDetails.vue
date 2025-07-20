<!-- src/views/CommercantDetails.vue -->
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from 'vue-toastification';
import apiClient from '../api';
import AppHeader from '../components/AppHeader.vue';
import Loader from '../components/Loader.vue';
import ProductCard from '../components/ProductCard.vue';
import { useProductStore } from '../stores/product';

const route = useRoute();
const toast = useToast();
const isLoading = ref(false);
const commerçant = ref<any>(null);

// Utilisation du store pour les produits
const productStore = useProductStore();

const fetchCommercantDetails = async () => {
    isLoading.value = true;
    try {
        const response = await apiClient.get(`/commercant/${route.params.commercantId}`);
        commerçant.value = response.data.commercant;
        // Charger tous les produits dans le store si ce n'est pas déjà fait
        if (productStore.products.length === 0) {
            await productStore.fetchProducts({'per_page':'all'}); // Assurez-vous que cette méthode existe
        }
    } catch (error) {
        toast.error('Erreur lors du chargement des détails du commerçant.');
    } finally {
        isLoading.value = false;
    }
};

// Filtrer les produits du commerçant depuis le store

const commerçantProduits = computed( () => {
    return productStore.products.filter((p: any) => p.commercant_id === route.params.commercantId);
});
onMounted(async () => {
    fetchCommercantDetails();
    //  commerçantProduits()
});
</script>

<template>
    <Loader :isLoading="isLoading" />
    <div class="min-h-screen bg-gray-100" :style="{ background: 'url(/src/assets/images/bginsc.jpg) center/cover' }">
        <AppHeader />
        <div class="container mx-auto px-4 sm:px-6 py-8">
            <!-- Bannière du commerçant -->
            <div v-if="commerçant"
                class="bg-[rgba(255,255,255,0.9)] rounded-xl shadow-lg p-6 mb-8 border border-gray-100 overflow-hidden">
                <div class="flex flex-col sm:flex-row items-center gap-6">
                    <div
                        class="w-24 h-24 bg-[var(--espace-or)] rounded-full flex items-center justify-center overflow-hidden">
                        <img v-if="commerçant.photo_url" :src="commerçant.photo_url" alt="Photo du commerçant"
                            class="w-full h-full object-cover">
                        <i v-else class="fas fa-user text-3xl text-[var(--espace-vert)]"></i>
                    </div>
                    <div class="flex-1">
                        <h1 class="text-3xl font-bold text-[var(--espace-vert)] mb-2">{{ commerçant.nom }}</h1>
                        <p class="text-sm text-[var(--espace-gris)] mb-1"><strong>Ville :</strong> {{ commerçant.ville
                        }}</p>
                        <p class="text-sm text-[var(--espace-gris)] mb-1"><strong>Inscrit depuis :</strong> {{ new
                            Date(commerçant.created_at).toLocaleDateString() }}</p>
                        <p class="text-sm text-[var(--espace-gris)]"><strong>Contact :</strong> {{ commerçant.email ||
                            'Non disponible' }}</p>
                        <p v-if="commerçant.telephone" class="text-sm text-[var(--espace-gris)]"><strong>Téléphone
                                :</strong> {{ commerçant.telephone }}</p>
                    </div>
                </div>
                <div class="mt-4 flex flex-wrap gap-4">
                    <span
                        class="px-3 py-1 bg-[var(--espace-or)] text-[var(--espace-vert)] rounded-full text-sm font-medium">Produits
                        : {{ commerçantProduits.length }}</span>
                    <span v-if="commerçant.revenus"
                        class="px-3 py-1 bg-[var(--espace-or)] text-[var(--espace-vert)] rounded-full text-sm font-medium">Revenus
                        : {{ commerçant.revenus }} FCFA</span>
                </div>
            </div>
            <div v-else-if="!isLoading" class="text-base text-[var(--espace-gris)] italic">Commerçant non trouvé.</div>

            <!-- Liste des produits -->
             <div v-if="isLoading"> </div>
            <div v-else-if="commerçantProduits.length > 0"
                class="bg-[rgba(255,255,255,0.9)] rounded-xl shadow-lg p-6 border border-gray-100">
                <h2 class="text-2xl font-semibold text-[var(--espace-vert)] mb-6">Produits du Commerçant</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <ProductCard v-for="produit in commerçantProduits" :key="produit.id" :produit="produit" />
                </div>
            </div>
            <div v-else-if="commerçant && commerçantProduits.length === 0"
                class="text-base text-[var(--espace-gris)] italic">Aucun produit disponible pour ce commerçant.</div>

            <!-- Statistiques supplémentaires (facultatif) -->
            <div v-if="commerçant && commerçant.statistiques"
                class="bg-[rgba(255,255,255,0.9)] rounded-xl shadow-lg p-6 mt-8 border border-gray-100">
                <h2 class="text-2xl font-semibold text-[var(--espace-vert)] mb-4">Statistiques</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <p class="text-sm text-[var(--espace-gris)]"><strong>Vues totales :</strong> {{
                        commerçant.statistiques.total_views }}</p>
                    <p class="text-sm text-[var(--espace-gris)]"><strong>Produits populaires :</strong> {{
                        commerçant.statistiques.popular_products }}</p>
                </div>
            </div>
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

.animate-spin {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

button:hover {
    transform: scale(1.05);
}

button:active {
    transform: scale(0.95);
}
</style>