<template>
    <div class="space-y-6">
        <!-- Merchant Information -->
        <section class="bg-white rounded-lg shadow-md p-4 sm:p-6 space-y-4">
            <h2 class="text-lg sm:text-xl font-semibold text-[var(--espace-vert)]">Informations du Commerce</h2>
            <div v-if="commercant" class="space-y-2 text-[var(--espace-gris)]">
                <p><strong>Nom :</strong> {{ commercant.nom }}</p>
                <p><strong>Ville :</strong> {{ commercant.ville }}</p>
                <p><strong>Produits actifs :</strong> 
                    <!-- {{ commercant.active_products || 0 }} -->
                </p>
            </div>
            <div v-else>
                <p class="text-[var(--espace-gris)]">Aucune information de commerce disponible.</p>
            </div>
        </section>

        <!-- Products -->
        <section class="bg-white rounded-lg shadow-md p-4 sm:p-6 space-y-4">
            <h2 class="text-lg sm:text-xl font-semibold text-[var(--espace-vert)]">Mes Produits</h2>
            <div v-if="produits.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div v-for="produit in produits" :key="produit.id"
                    class="border rounded-md p-3 text-[var(--espace-gris)]">
                    <p><strong>Nom :</strong> {{ produit.nom }}</p>
                    <p><strong>Prix :</strong> {{ produit.prix }} FCFA</p>
                    <p><strong>Stock :</strong> {{ produit.quantite }}</p>
                </div>
            </div>
            <p v-else class="text-[var(--espace-gris)]">Aucun produit enregistré.</p>
        </section>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import apiClient from '../api/index';
import { Commercant } from "../components/types/index"; // Import de l'interface Parrainage

import { Product } from "../components/types/index"; // Import de l'interface Parrainage
defineProps({
    user: Object,
});

const toast = useToast();
const commercant = ref<Commercant | null>(null);

const produits = ref<Product[]>([]);

onMounted(async () => {
    try {
        console.log('Données du commerçant');
        const response = await apiClient.get('/commercant/profil');
        console.log('Données du commerçant:', response.data);
        commercant.value = response.data.commercant;
        produits.value = response.data.produits || [];
    } catch (error) {
        toast.error('Erreur lors du chargement des données du commerçant.' + error);
    }
});
</script>

<style scoped>
:root {
    --espace-vert: #14532d;
    --espace-or: #facc15;
    --espace-blanc: #ffffff;
    --espace-gris: #6b7280;
}
</style>