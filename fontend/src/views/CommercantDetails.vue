<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from 'vue-toastification';
import apiClient from '../api/index';
import AppHeader from '../components/AppHeader.vue';
import Loader from '../components/Loader.vue';
import ProductCard from '../components/ProductCard.vue';

const route = useRoute();
const toast = useToast();
const isLoading = ref(false);
const commerçant = ref<any>(null);
const userRating = ref<number | null>(null); // Note de l'utilisateur
const averageRating = ref<number>(0); // Note moyenne
const voteCount = ref<number>(0); // Nombre de votes
const showModal = ref(false); // Contrôle l'affichage du modal

const fetchCommerçantDetails = async () => {
    isLoading.value = true;
    try {
        const response = await apiClient.get(`/commercant/${route.params.commercantId}`);
        console.log(response.data); // Pour déboguer la structure de la réponse
        commerçant.value = response.data.commercant;
        averageRating.value = response.data.average_rating || 0;
        voteCount.value = response.data.vote_count || 0; // Ajout du nombre de votes
        // Vérifier si les produits sont inclus dans la réponse (par exemple, commerçant.produits)
        if (!commerçant.value.produits) {
            console.warn('Aucun produit trouvé dans la réponse de l\'API pour ce commerçant.');
        }
    } catch (error) {
        toast.error('Erreur lors du chargement des détails du commerçant.');
    } finally {
        isLoading.value = false;
    }
};

const submitRating = async () => {
    if (userRating.value === null || userRating.value < 1 || userRating.value > 5) {
        toast.error('Veuillez sélectionner une note entre 1 et 5.');
        return;
    }

    try {
        const response = await apiClient.post(`/commercant/${route.params.commercantId}/rate`, {
            rating: userRating.value,
        });
        averageRating.value = response.data.average_rating || 0;
        toast.success('Merci pour votre note !');
        userRating.value = null; // Réinitialiser après soumission
        showModal.value = false; // Fermer le modal
        voteCount.value = response.data.vote_count || voteCount.value + 1; // Mettre à jour le nombre de votes
    } catch (error: any) {
        toast.error(error.response?.data?.message || 'Erreur lors de la notation.');
    }
};

const handleFavorite = async () => {
    try {
        // Note : Cette fonction dépendait du store, à ajuster si nécessaire
        console.warn('handleFavorite n\'est pas implémenté sans store. Ajustez selon votre backend.');
    } catch (error: any) {
        toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour des favoris.');
    }
};

// Filtrer les produits du commerçant depuis la réponse API
const commerçantProduits = computed(() => {
    return commerçant.value?.produits || [];
});

// Ouvre le modal au clic sur les étoiles
const openRatingModal = () => {
    showModal.value = true;
};

onMounted(async () => {
    fetchCommerçantDetails();
});
</script>

<template>
    <Loader :isLoading="isLoading" />
    <div class="overflow-y-scroll bg-gray-100">
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
                        <h1 class="text-3xl font-bold text-[var(--espace-vert)] mb-2 text-center">
                            Commerçant : {{ commerçant.nom }}</h1>
                        <p class="text-sm text-[var(--espace-gris)] mb-1"><strong>Ville :</strong> {{ commerçant.ville
                        }}</p>
                        <p class="text-sm text-[var(--espace-gris)] mb-1"><strong>Inscrit depuis :</strong> {{ new
                            Date(commerçant.created_at).toLocaleDateString() }}</p>
                        <p class="text-sm text-[var(--espace-gris)]"><strong>Contact :</strong> {{ commerçant.email ||
                            'Non disponible' }}</p>
                        <p v-if="commerçant.telephone" class="text-sm text-[var(--espace-gris)]"><strong>Téléphone
                                :</strong> {{ commerçant.telephone }}</p>
                        <!-- Note moyenne avec nombre de votes -->
                        <div class="mt-2 flex space-x-2 flex-col">
                            <div class="flex items-center space-x-1 cursor-pointer" @click="openRatingModal">
                                <span v-for="star in 5" :key="star" class="relative text-yellow-400 w-5 h-5">
                                    <!-- Étoile vide -->
                                    <i class="far fa-star absolute left-0 top-0"></i>

                                    <!-- Étoile pleine, masquée partiellement si demi -->
                                    <i class="fas fa-star absolute left-0 top-0 overflow-hidden" :style="{
                                        width:
                                            star <= Math.floor(averageRating)
                                                ? '100%'
                                                : star === Math.ceil(averageRating) && averageRating % 1 !== 0
                                                    ? `${(averageRating % 1) * 100}%`
                                                    : '0%',
                                    }"></i>
                                </span>

                                <p class="text-sm text-[var(--espace-gris)]">
                                    {{ Number(averageRating).toFixed(1) }}/5
                                </p>
                            </div>

                            <span class="text-xs text-[var(--espace-gris)]">({{ voteCount }} votes)</span>
                        </div>
                    </div>
                </div>
                <!-- Liens vers le chat et le profil public avec style plat -->
                <div class="mt-4 flex flex-col sm:flex-row gap-4">
                    <router-link :to="`/chat/${commerçant.id}`"
                        class="inline-flex items-center px-4 py-2 border-2 border-[var(--espace-or)] text-[var(--espace-vert)] rounded-lg hover:bg-[var(--espace-or)] hover:text-[var(--espace-blanc)] transition-colors duration-200">
                        <i class="fas fa-comment mr-2"></i> Envoyer un message
                    </router-link>
                    <router-link :to="`/public-profile/${commerçant.user_id || commerçant.id}`"
                        class="inline-flex items-center px-4 py-2 border-2 border-[var(--espace-or)] text-[var(--espace-vert)] rounded-lg hover:bg-[var(--espace-or)] hover:text-[var(--espace-blanc)] transition-colors duration-200">
                        <i class="fas fa-user mr-2"></i> Voir Profil Public
                    </router-link>
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

            <!-- Modal de notation -->
            <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                    <h2 class="text-2xl font-semibold text-[var(--espace-vert)] mb-4">Noter ce Commerçant</h2>
                    <div class="flex items-center space-x-2">
                        <input v-model.number="userRating" type="number" min="1" max="5" step="1"
                            class="w-16 p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--espace-vert)]"
                            placeholder="1-5" />
                        <button @click="submitRating"
                            class="bg-[var(--espace-or)] text-[var(--espace-vert)] font-medium px-4 py-2 rounded-md hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] transition-colors">
                            Soumettre
                        </button>
                        <button @click="showModal = false"
                            class="bg-gray-300 text-[var(--espace-vert)] font-medium px-4 py-2 rounded-md hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] transition-colors ml-2">
                            Annuler
                        </button>
                    </div>
                </div>
            </div>

            <!-- Liste des produits -->
            <div v-if="isLoading"> </div>
            <div v-else-if="commerçantProduits.length > 0"
                class="bg-[rgba(255,255,255,0.9)] rounded-xl shadow-lg p-6 mt-4 border border-gray-100">
                <h2 class="text-2xl font-semibold text-[var(--espace-vert)] mb-6">Produits du Commerçant</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <ProductCard v-for="produit in commerçantProduits" :key="produit.id" :produit="produit" />
                </div>
            </div>
            <div v-else-if="commerçant && commerçantProduits.length === 0"
                class="text-base text-[var(--espace-gris)] italic">Aucun produit disponible pour ce commerçant.</div>

            <!-- Statistiques supplémentaires -->
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

/* Style plat pour les liens */
router-link {
    text-decoration: none;
}

router-link:hover {
    text-decoration: none;
}
</style>