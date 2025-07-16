<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/Auth';
import { useUserStateStore } from '../stores/userState';
import { useToast } from 'vue-toastification';
import apiClient from '../api';
import ProductCard from '../components/ProductCard.vue';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const userStateStore = useUserStateStore();
const toast = useToast();
const produit = ref<any>(null);
const relatedProducts = ref<any[]>([]);
const isLoading = ref(true);
const showCollaborationModal = ref(false);
const prixRevente = ref<number | null>(null);

const fetchProduit = async () => {
    try {
        isLoading.value = true;
        const response = await apiClient.get(`/produits/${route.params.id}`);
        produit.value = response.data.produit;
        await fetchRelatedProducts();
    } catch (error) {
        toast.error('Erreur lors du chargement du produit');
        router.push({ name: 'dashboard' });
    } finally {
        isLoading.value = false;
    }
};

const fetchRelatedProducts = async () => {
    try {
        const response = await apiClient.get(`/produits/related/${route.params.id}`, {
            params: { category_id: produit.value.category_id, limit: 4 },
        });
        relatedProducts.value = response.data.produits;
    } catch (error) {
        toast.error('Erreur lors du chargement des produits similaires');
    }
};

const addToCart = async () => {
    if (!authStore.user) {
        toast.error('Veuillez vous connecter pour ajouter au panier');
        router.push({ name: 'login' });
        return;
    }
    if (authStore.user.commercant?.id === produit.value.commercant_id) {
        toast.error('Vous ne pouvez pas ajouter votre propre produit au panier');
        return;
    }
    const success = await userStateStore.addToCart({
        id: produit.value.id,
        nom: produit.value.nom,
        prix: produit.value.prix,
    });
    if (success) {
        toast.success('Produit ajouté au panier');
    }
};

const openCollaborationModal = () => {
    if (!authStore.user) {
        toast.error('Veuillez vous connecter pour collaborer');
        router.push({ name: 'login' });
        return;
    }
    if (authStore.user.commercant?.id === produit.value.commercant_id) {
        toast.error('Vous ne pouvez pas collaborer sur votre propre produit');
        return;
    }
    if (!produit.value.collaboratif) {
        toast.error('Ce produit n’est pas ouvert à la collaboration');
        return;
    }
    prixRevente.value = produit.value.prix + (produit.value.marge_min || 500);
    showCollaborationModal.value = true;
};

const submitCollaboration = async () => {
    if (!prixRevente.value || prixRevente.value < produit.value.prix + (produit.value.marge_min || 0)) {
        toast.error(`Le prix de revente doit être supérieur ou égal à ${produit.value.prix + (produit.value.marge_min || 0)} XAF`);
        return;
    }
    const success = await userStateStore.addCollaboration({
        produit_id: produit.value.id,
        prix_revente: prixRevente.value,
    });
    if (success) {
        showCollaborationModal.value = false;
        prixRevente.value = null;
    }
};

const closeCollaborationModal = () => {
    showCollaborationModal.value = false;
    prixRevente.value = null;
};

const goToCommercant = () => {
    router.push({ path: `/commercant/${produit.value.commercant_id}` });
};

const editProduit = () => {
    router.push({ path: `/commercant/produits/${produit.value.id}/edit` });
};

onMounted(() => {
    fetchProduit();
    userStateStore.initializeState();
});
</script>

<template>
    <div class="min-h-screen bg-gray-100 pt-16 pb-20 px-4 sm:px-6">
        <div class="container mx-auto max-w-5xl">
            <div v-if="isLoading" class="text-center text-[var(--espace-gris)]">
                <i class="fas fa-spinner fa-spin text-2xl"></i> Chargement...
            </div>
            <div v-else-if="produit" class="bg-[var(--espace-blanc)] rounded-lg shadow-md p-6 sm:p-8">
                <div class="flex flex-col lg:flex-row gap-6 sm:gap-8">
                    <!-- Image du produit -->
                    <div class="w-full lg:w-1/2">
                        <div class="relative">
                            <img :src="produit.photo_url || 'https://via.placeholder.com/300'"
                                :alt="`Image de ${produit.nom}`"
                                class="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-lg shadow-sm hover:scale-105 transition-transform duration-300" />
                            <span v-if="produit.collaboratif"
                                class="absolute top-4 left-4 bg-[var(--espace-or)] text-[var(--espace-vert)] text-xs font-semibold px-2 py-1 rounded-full font-poppins"
                                aria-label="Produit collaboratif">
                                Collaboratif
                            </span>
                        </div>
                    </div>
                    <!-- Détails du produit -->
                    <div class="w-full lg:w-1/2">
                        <h1
                            class="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--espace-vert)] mb-4 font-poppins">
                            {{ produit.nom }}
                        </h1>
                        <p class="text-md text-[var(--espace-gris)] mb-4">{{ produit.description || 'Aucune description' }}</p>
                        <p class="text-xl sm:text-2xl font-semibold text-[var(--espace-or)] mb-4">{{ produit.prix }} XAF
                        </p>
                        <div class="grid grid-cols-2 gap-4 mb-4">
                            <p class="text-sm text-[var(--espace-gris)]">
                                <strong>Catégorie :</strong> {{ produit.category?.nom || 'Non spécifiée' }}
                            </p>
                            <p class="text-sm text-[var(--espace-gris)]">
                                <strong>Stock :</strong> {{ produit.stock }}
                            </p>
                            <p class="text-sm text-[var(--espace-gris)]">
                                <strong>Ville :</strong> {{ produit.commercant?.ville || 'Non spécifiée' }}
                            </p>
                            <p class="text-sm text-[var(--espace-gris)]">
                                <strong>Ajouté le :</strong> {{ new Date(produit.created_at).toLocaleDateString('fr-FR')
                                }}
                            </p>
                        </div>
                        <!-- Détails du commerçant -->
                        <div class="border-t pt-4 mt-4">
                            <h2 class="text-lg font-semibold text-[var(--espace-vert)] mb-2 font-poppins">
                                À propos du commerçant
                            </h2>
                            <p class="text-sm text-[var(--espace-gris)] mb-2">
                                <strong>{{ produit.commercant.nom }}</strong>
                                <span v-if="produit.commercant.verified" class="ml-2 text-[var(--espace-or)]"
                                    aria-label="Commerçant vérifié" title="Commerçant vérifié">
                                    <i class="fas fa-check-circle"></i>
                                </span>
                            </p>
                            <p class="text-sm text-[var(--espace-gris)] mb-2">
                                {{ produit.commercant.bio || 'Aucune description disponible' }}
                            </p>
                            <p class="text-sm text-[var(--espace-gris)] mb-2">
                                <strong>Ville :</strong> {{ produit.commercant.ville || 'Non spécifiée' }}
                            </p>
                            <p class="text-sm text-[var(--espace-gris)] mb-4">
                                <strong>Note :</strong> {{ produit.commercant.rating || 'Non évalué' }} / 5
                            </p>
                            <RouterLink :to="`/commercant/${produit.commercant_id}`"
                                class="text-[var(--espace-vert)] hover:text-[var(--espace-or)] hover:underline text-sm font-poppins"
                                aria-label="Voir le profil du commerçant">
                                Voir le profil du commerçant
                            </RouterLink>
                        </div>
                        <!-- Actions -->
                        <div class="flex flex-col sm:flex-row gap-4 mt-6">
                            <button v-if="authStore.user?.commercant?.id !== produit.commercant_id" @click="addToCart"
                                class="bg-[var(--espace-or)] text-[var(--espace-vert)] font-semibold px-4 py-2 rounded-lg hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] transition-transform hover:scale-105"
                                aria-label="Ajouter au panier">
                                <i class="fas fa-shopping-cart mr-2"></i> Ajouter au panier
                            </button>
                            <button
                                v-if="produit.collaboratif && authStore.user?.commercant?.id !== produit.commercant_id"
                                @click="openCollaborationModal"
                                class="bg-[var(--espace-vert)] text-[var(--espace-blanc)] font-semibold px-4 py-2 rounded-lg hover:bg-[var(--espace-or)] hover:text-[var(--espace-vert)] transition-transform hover:scale-105"
                                aria-label="Collaborer sur ce produit">
                                <i class="fas fa-handshake mr-2"></i> Collaborer
                            </button>
                            <button v-if="authStore.user?.commercant?.id === produit.commercant_id" @click="editProduit"
                                class="bg-[var(--espace-vert)] text-[var(--espace-blanc)] font-semibold px-4 py-2 rounded-lg hover:bg-[var(--espace-or)] hover:text-[var(--espace-vert)] transition-transform hover:scale-105"
                                aria-label="Modifier le produit">
                                <i class="fas fa-edit mr-2"></i> Modifier le produit
                            </button>
                        </div>
                    </div>
                </div>
                <!-- Produits similaires -->
                <div v-if="relatedProducts.length" class="mt-8">
                    <h2 class="text-xl sm:text-2xl font-bold text-[var(--espace-vert)] mb-4 font-poppins">
                        Produits similaires
                    </h2>
                    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        <ProductCard v-for="related in relatedProducts" :key="related.id" :produit="related" />
                    </div>
                </div>
            </div>
            <div v-else class="text-center text-[var(--espace-gris)]">
                Produit non trouvé.
            </div>

            <!-- Modale de collaboration -->
            <Transition name="fade">
                <div v-if="showCollaborationModal"
                    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    @click.self="closeCollaborationModal" role="dialog" aria-modal="true"
                    aria-label="Proposer un prix de revente">
                    <div class="bg-[var(--espace-blanc)] rounded-lg p-6 sm:p-8 w-full max-w-md mx-4 shadow-lg">
                        <h2 class="text-lg sm:text-xl font-semibold text-[var(--espace-vert)] mb-4 font-poppins">
                            Collaborer sur {{ produit.nom }}
                        </h2>
                        <p class="text-sm text-[var(--espace-gris)] mb-4">
                            Proposez un prix de revente (minimum : {{ produit.prix + (produit.marge_min || 0) }} XAF)
                        </p>
                        <form @submit.prevent="submitCollaboration" class="space-y-4">
                            <div>
                                <label for="prix_revente" class="text-sm text-[var(--espace-vert)]">Prix de revente
                                    (XAF)</label>
                                <input id="prix_revente" v-model.number="prixRevente" type="number" min="0"
                                    class="w-full h-10 p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--espace-vert)] transition"
                                    :aria-label="`Prix de revente pour ${produit.nom}`" required />
                                <p v-if="prixRevente" class="text-sm text-[var(--espace-gris)] mt-1">
                                    Marge potentielle : {{ prixRevente - produit.prix }} XAF
                                </p>
                            </div>
                            <div class="flex gap-4">
                                <button type="submit"
                                    class="flex-1 bg-[var(--espace-or)] text-[var(--espace-vert)] font-semibold px-4 py-2 rounded hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] transition"
                                    aria-label="Envoyer la demande de collaboration">
                                    Envoyer
                                </button>
                                <button type="button" @click="closeCollaborationModal"
                                    class="flex-1 bg-[var(--espace-gris)] text-[var(--espace-blanc)] font-semibold px-4 py-2 rounded hover:bg-gray-700 transition"
                                    aria-label="Annuler">
                                    Annuler
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </Transition>
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

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.cart-badge {
    transition: transform 0.2s ease, background-color 0.3s ease;
}

.cart-badge.animate-scale {
    animation: scaleBadge 0.3s ease-in-out;
}

@keyframes scaleBadge {
    0% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.2);
    }

    100% {
        transform: scale(1);
    }
}
</style>    