<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '../api/index';
import { useToast } from 'vue-toastification';
import Loader from '../components/Loader.vue';
import { Collaboration } from "../components/types/index";

// Fonction utilitaire pour sauvegarder dans localStorage
const saveCollaborationsToLocalStorage = (collaborations: any[]) => {
    localStorage.setItem('pending_collaborations', JSON.stringify(collaborations));
};

const toast = useToast();
const router = useRouter();

// Définir comme un objet avec des tableaux
const collaborations = ref<{ sent_collaborations: Collaboration[]; received_collaborations: Collaboration[] }>({
    sent_collaborations: [],
    received_collaborations: [],
});
const isLoading = ref(true);
const activeTab = ref<'received' | 'sent'>('received'); // Onglet actif par défaut

const fetchCollaborations = async () => {
    try {
        const response = await apiClient.get('/collaborations');
        console.log(response.data);
        collaborations.value = response.data;

        // Nettoyer les collaborations en attente dans localStorage
        const pendingCollaborations = JSON.parse(localStorage.getItem('pending_collaborations') || '[]');
        if (pendingCollaborations.length > 0) {
            const sentProduitIds = new Set(collaborations.value.sent_collaborations.map(c => c.produit_id));
            const updatedPending = pendingCollaborations.filter((item: any) => !sentProduitIds.has(item.produit_id));
            if (updatedPending.length !== pendingCollaborations.length) {
                saveCollaborationsToLocalStorage(updatedPending);
                console.log('Collaborations en attente nettoyées dans localStorage');
            }
        }
    } catch (error) {
        toast.error('Erreur lors du chargement des collaborations');
    } finally {
        isLoading.value = false;
    }
};

const viewProduit = (produitId: string) => {
    router.push({ path: `/produits/${produitId}` });
};

const viewCommercantProfile = (collaboration: Collaboration) => {
    const commerçantId = collaboration.commercant?.id || collaboration.produit?.commercant?.id;
    if (commerçantId) {
        router.push({ path: `/commercants/${commerçantId}` });
    } else {
        toast.error('Profil du commerçant non disponible');
    }
};

const updateCollaborationStatus = async (collaborationId: number, statut: string) => {
    try {
        const response = await apiClient.post(`/collaborations/${collaborationId}`, { statut });
        toast.success(response.data.message);
        await fetchCollaborations(); // Rafraîchir la liste
    } catch (error: any) {
        console.log(error.response.data.message);
        
        toast.error(`Erreur lors de la mise à jour de la collaboration${error.response?.data.message}`);
    }
};

onMounted(() => {
    isLoading.value = true;
    fetchCollaborations();
});
</script>

<template>
    <Loader :isLoading="isLoading" />

    <div class="overflow-y-scroll bg-gray-100 pt-16 pb-20 px-4 sm:px-6">
        <div class="container mx-auto max-w-4xl">
            <h1 class="text-2xl sm:text-3xl font-bold text-[var(--espace-vert)] mb-6">
                <i class="fas fa-handshake mr-2 text-[var(--espace-or)]"></i> Mes Collaborations
            </h1>

            <!-- Onglets -->
            <div class="flex border-b border-gray-300 mb-6">
                <button class="px-4 py-2 font-semibold"
                    :class="{ 'text-[var(--espace-vert)] border-b-2 border-[var(--espace-vert)]': activeTab === 'received', 'text-[var(--espace-gris)]': activeTab !== 'received' }"
                    @click="activeTab = 'received'">
                    Collaborations reçues
                </button>
                <button class="px-4 py-2 font-semibold"
                    :class="{ 'text-[var(--espace-vert)] border-b-2 border-[var(--espace-vert)]': activeTab === 'sent', 'text-[var(--espace-gris)]': activeTab !== 'sent' }"
                    @click="activeTab = 'sent'">
                    Collaborations envoyées
                </button>
            </div>

            <!-- Contenu des onglets -->
            <div v-if="activeTab === 'received'">
                <div v-if="collaborations.received_collaborations.length" class="grid grid-cols-1 gap-4">
                    <div v-for="collaboration in collaborations.received_collaborations" :key="collaboration.id"
                        class="bg-[var(--espace-blanc)] rounded-lg shadow-md p-4 hover:shadow-lg transition">
                        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h2 @click="viewProduit(collaboration.produit_id)"
                                    class="text-lg font-semibold text-[var(--espace-vert)] hover:text-[var(--espace-or)] hover:underline cursor-pointer">
                                    {{ collaboration.produit.nom }}
                                </h2>
                                <p class="text-sm text-[var(--espace-gris)]">
                                    Prix de revente proposé : {{ collaboration.prix_revente }} FCFA
                                </p>
                                <p class="text-sm text-[var(--espace-gris)]">
                                    Statut :
                                    <span :class="{
                                        'text-green-600': collaboration.statut === 'valider',
                                        'text-yellow-600': collaboration.statut === 'en_attente',
                                        'text-red-600': collaboration.statut === 'refuser',
                                    }">
                                        {{
                                            collaboration.statut === 'en_attente'
                                                ? 'En attente'
                                                : collaboration.statut === 'valider'
                                                    ? 'Valider'
                                        : 'Refusée'
                                        }}
                                    </span>
                                </p>
                                <button @click="viewCommercantProfile(collaboration)"
                                    class="mt-2 text-sm text-[var(--espace-or)] hover:underline">
                                    Voir le profil du commerçant
                                </button>
                            </div>
                            <div class="flex flex gap-2">
                                <button v-if="collaboration.statut === 'en_attente'"
                                    @click="updateCollaborationStatus(collaboration.id, 'valider')"
                                    class="bg-green-600 text-white font-semibold px-3 py-1.5 rounded hover:bg-green-700 transition text-xs sm:text-sm">
                                    Valider
                                </button>
                                <button v-if="collaboration.statut === 'en_attente'"
                                    @click="updateCollaborationStatus(collaboration.id, 'refuser')"
                                    class="bg-red-600 text-white font-semibold px-3 py-1.5 rounded hover:bg-red-700 transition text-xs sm:text-sm">
                                    Rejeter
                                </button>
                                <button @click="viewProduit(collaboration.produit_id)"
                                    class="bg-[var(--espace-or)] text-[var(--espace-vert)] font-semibold px-3 py-1.5 rounded hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] transition sm:text-sm text-xs">
                                    Voir le produit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <p v-else class="text-center text-[var(--espace-gris)]">
                    Aucune collaboration reçue pour le moment.
                </p>
            </div>

            <div v-if="activeTab === 'sent'">
                <div v-if="collaborations.sent_collaborations.length" class="grid grid-cols-1 gap-4">
                    <div v-for="collaboration in collaborations.sent_collaborations" :key="collaboration.id"
                        class="bg-[var(--espace-blanc)] rounded-lg shadow-md p-4 hover:shadow-lg transition">
                        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h2 @click="viewProduit(collaboration.produit_id)"
                                    class="text-lg font-semibold text-[var(--espace-vert)] hover:text-[var(--espace-or)] hover:underline cursor-pointer">
                                    {{ collaboration.produit.nom }}
                                </h2>
                                <p class="text-sm text-[var(--espace-gris)]">
                                    Prix de revente proposé : {{ collaboration.prix_revente }} FCFA
                                </p>
                                <p class="text-sm text-[var(--espace-gris)]">
                                    Statut :
                                    <span :class="{
                                        'text-green-600': collaboration.statut === 'valider',
                                        'text-yellow-600': collaboration.statut === 'en_attente',
                                        'text-red-600': collaboration.statut === 'refuser',
                                    }">
                                        {{
                                            collaboration.statut === 'en_attente'
                                                ? 'En attente'
                                                : collaboration.statut === 'valider'
                                                    ? 'Valider'
                                        : 'Refusée'
                                        }}
                                    </span>
                                </p>
                                <button @click="viewCommercantProfile(collaboration)"
                                    class="mt-2 text-sm text-[var(--espace-or)] hover:underline">
                                    Voir le profil du commerçant
                                </button>
                            </div>
                            <button @click="viewProduit(collaboration.produit_id)"
                                class="bg-[var(--espace-or)] text-[var(--espace-vert)] font-semibold px-3 py-1.5 rounded hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] transition sm:text-sm text-xs">
                                Voir le produit
                            </button>
                        </div>
                    </div>
                </div>
                <p v-else class="text-center text-[var(--espace-gris)]">
                    Aucune collaboration envoyée pour le moment.
                </p>
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

button {
    transition: all 0.3s ease;
}

button:hover {
    color: var(--espace-or);
}
</style>