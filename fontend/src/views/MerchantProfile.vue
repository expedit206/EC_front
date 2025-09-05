<template>
    <div class="space-y-6">
        <!-- Merchant Information -->
        <section class="bg-white rounded-lg shadow-md p-4 sm:p-6 space-y-4">
            <h2 class="text-lg sm:text-xl font-semibold text-[var(--espace-vert)]">
                Informations du Commerce
            </h2>
            <div v-if="commercant" class="space-y-2 text-[var(--espace-gris)]">
                <p><strong>Nom :</strong> {{ commercant.nom }}</p>
                <p><strong>Ville :</strong> {{ commercant.ville }}</p>
                <p>
                    <strong>Produits actifs :</strong>
                    {{ produits.length || 0 }}
                </p>
            </div>
            <div v-else>
                <p class="text-[var(--espace-gris)]">
                    Aucune information de commerce disponible.
                </p>
            </div>
        </section>

        <!-- Products -->
        <section class="bg-white rounded-lg shadow-md p-4 sm:p-6 space-y-4">
            <h2 class="text-lg sm:text-xl font-semibold text-[var(--espace-vert)]">
                Mes Produits
            </h2>

            <div v-if="produits.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div v-for="produit in produits" :key="produit.id"
                    class="border rounded-md p-3 text-[var(--espace-gris)] flex flex-col justify-between">
                    <div class="space-y-1">
                        <p><strong>Nom :</strong> {{ produit.nom }}</p>
                        <p><strong>Prix :</strong> {{ produit.prix }} FCFA</p>
                        <p><strong>Stock :</strong> {{ produit.quantite }}</p>
                    </div>

                    <div v-if="produit.image" class="my-2">
                        <img :src="produit.image" alt="Produit" class="w-full h-32 object-cover rounded-md" />
                    </div>

                    <router-link :to="{ name: 'produit', params: { id: produit.id } }"
                        class="mt-2 inline-block px-3 py-1 rounded-full bg-[var(--espace-vert)] text-white text-sm text-center hover:bg-[var(--espace-or)] hover:text-[var(--espace-vert)] transition">
                        Voir le produit
                    </router-link>
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
import { Commercant, Product } from "../components/types/index";

defineProps({
    user: Object,
});

const toast = useToast();
const commercant = ref<Commercant | null>(null);
const produits = ref<Product[]>([]);

onMounted(async () => {
    try {
        const response = await apiClient.get('/commercant/profil');
        commercant.value = response.data.commercant;
        produits.value = response.data.produits || [];
    } catch (error: any) {
        toast.error('Erreur lors du chargement des données du commerçant: ' + (error.message || error));
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
