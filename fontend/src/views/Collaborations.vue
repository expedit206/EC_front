<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '../api';
import { useToast } from 'vue-toastification';

const toast = useToast();
const router = useRouter();
const collaborations = ref([]);

const fetchCollaborations = async () => {
    try {
        const response = await apiClient.get('/collaborations');
        collaborations.value = response.data.collaborations;
    } catch (error) {
        toast.error('Erreur lors du chargement des collaborations');
    }
};

const viewProduit = (produitId: string) => {
    router.push({ path: `/produits/${produitId}` });
};

onMounted(fetchCollaborations);
</script>

<template>
    <div class="min-h-screen bg-gray-100 pt-16 pb-20 px-4 sm:px-6">
        <div class="container mx-auto max-w-4xl">
            <h1 class="text-2xl sm:text-3xl font-bold text-[var(--espace-vert)] mb-6">
                <i class="fas fa-handshake mr-2 text-[var(--espace-or)]"></i> Mes Collaborations
            </h1>
            <div v-if="collaborations.length" class="grid grid-cols-1 gap-4">
                <div v-for="collaboration in collaborations" :key="collaboration.id"
                    class="bg-[var(--espace-blanc)] rounded-lg shadow-md p-4 hover:shadow-lg transition">
                    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h2 @click="viewProduit(collaboration.produit_id)"
                                class="text-lg font-semibold text-[var(--espace-vert)] hover:text-[var(--espace-or)] hover:underline cursor-pointer">
                                {{ collaboration.produit.nom }}
                            </h2>
                            <p class="text-sm text-[var(--espace-gris)]">Prix de revente : {{ collaboration.prix_revente
                                }} FCFA</p>
                            <p class="text-sm text-[var(--espace-gris)]">
                                Statut :
                                <span :class="{
                                    'text-green-600': collaboration.status === 'accepted',
                                    'text-yellow-600': collaboration.status === 'pending',
                                    'text-red-600': collaboration.status === 'rejected',
                                }">
                                    {{ collaboration.status === 'pending' ? 'En attente' : collaboration.status ===
                                    'accepted' ? 'Acceptée' : 'Rejetée' }}
                                </span>
                            </p>
                        </div>
                        <button @click="viewProduit(collaboration.produit_id)"
                            class="bg-[var(--espace-or)] text-[var(--espace-vert)] font-semibold px-3 py-1.5 rounded hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] transition sm:text-sm text-xs"
                            aria-label="Voir le produit">
                            Voir le produit
                        </button>
                    </div>
                </div>
            </div>
            <p v-else class="text-center text-[var(--espace-gris)]">Aucune collaboration pour le moment.</p>
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