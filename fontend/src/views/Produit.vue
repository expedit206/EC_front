<!-- src/views/Produit.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/Auth';
import { useUserStateStore } from '../stores/userState';
import { useToast } from 'vue-toastification';
import { useProductStore } from '../stores/product';
import ProductCard from '../components/ProductCard.vue';
import Loader from '../components/Loader.vue';
import AppHeader from '../components/AppHeader.vue';

const productStore = useProductStore();
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const userStateStore = useUserStateStore();
const toast = useToast();
const produit = ref<any>(null);
const relatedProducts = ref<any[]>([]);
const showCollaborationModal = ref(false);
const prixRevente = ref<number | null>(null);

const fetchProduit = async () => {
    try {
        productStore.isLoading = true;
        produit.value = await productStore.viewProduct(route.params.id);
        // await fetchRelatedProducts();
    } catch (error: any) {
        toast.error(error || 'Erreur lors du chargement du produit');
        router.push({ name: 'home' });
    }finally{
        productStore.isLoading = false;
    }
};

const fetchRelatedProducts = async () => {
    try {
        const response = await apiClient.get(`/produits/related/${route.params.id}`, {
            params: { category_id: produit.value.category_id, limit: 4 },
        });
        relatedProducts.value = response.data.produits;
    } catch (error: any) {
        toast.error(error.response?.data?.message || 'Erreur lors du chargement des produits similaires');
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
        toast.success('Produit ajouté au panier', { timeout: 3000 });
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
        toast.success('Demande de collaboration envoyée', { timeout: 3000 });
        showCollaborationModal.value = false;
        prixRevente.value = null;
    }
};

const closeCollaborationModal = () => {
    showCollaborationModal.value = false;
    prixRevente.value = null;
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
    <AppHeader />
    <Loader :isLoading="productStore.isLoading" />
    <div class="min-h-screen bg-[var(--espace-blanc)] pt-16 pb-20 px-4 sm:px-6">
        <div class="container mx-auto max-w-5xl">
            <div v-if="productStore.isLoading" class="text-center text-[var(--espace-gris)]">
                <!-- Loader géré par Loader.vue -->
            </div>
            <div v-else-if="produit" class="bg-[var(--espace-blanc)] rounded-lg shadow-md p-4 sm:p-6">
                <Transition name="slide-up">
                    <div class="flex flex-col lg:flex-row gap-4 sm:gap-6">
                        <!-- Image du produit -->
                        <div class="w-full lg:w-1/2 relative">
                            <img :src="produit.photo_url || 'https://via.placeholder.com/300'"
                                :alt="`Image de ${produit.nom}`"
                                class="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-lg shadow-sm hover:scale-[1.02] transition-transform duration-300" />
                            <span v-if="produit.collaboratif"
                                class="absolute top-3 left-3 bg-[var(--espace-or)] text-[var(--espace-vert)] text-[10px] font-semibold px-2 py-1 rounded-full font-poppins"
                                aria-label="Produit collaboratif">
                                Collaboratif
                            </span>
                        </div>
                        <!-- Détails du produit -->
                        <div class="w-full lg:w-1/2">
                            <h1
                                class="text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--espace-vert)] mb-3 font-poppins">
                                {{ produit.nom }}
                            </h1>
                            <p class="text-sm text-[var(--espace-gris)] mb-3">{{ produit.description || 'Aucune' }}</p>
                            <p class="text-lg sm:text-xl font-semibold text-[var(--espace-or)] mb-3">{{ produit.prix }}
                                XAF</p>
                            <div class="grid grid-cols-2 gap-3 sm:gap-4 mb-4 text-xs text-[var(--espace-gris)]">
                                <p><strong>Catégorie :</strong> {{ produit.category?.nom || 'Non spécifiée' }}</p>
                                <p><strong>Quantité :</strong> {{ produit.quantite }}</p>
                                <p><strong>Ville :</strong> {{ produit.ville || 'Non spécifiée' }}</p>
                                <p><strong>Ajouté le :</strong> {{ new
                                    Date(produit.created_at).toLocaleDateString('fr-FR') }}</p>
                                <div class="flex items-center gap-3">
                                    <div class="flex items-center gap-1">
                                        <i class="fas fa-eye text-[10px]"></i>
                                        <span>{{ produit.views_count }} vues</span>
                                    </div>
                                    <div class="flex items-center gap-1">
                                        <i class="fas fa-heart text-[10px]"
                                            :class="{ 'text-[var(--espace-or)]': produit.is_favorited_by }"></i>
                                        <span>{{ produit.favorites_count }} favoris</span>
                                    </div>
                                </div>
                            </div>
                            <button @click="productStore.toggleFavorite(produit.id)"
                                class="w-full bg-gradient-to-r from-[var(--espace-or)] to-[var(--espace-vert)] text-[var(--espace-blanc)] font-semibold py-2 rounded-lg hover:from-[var(--espace-vert)] hover:to-[var(--espace-or)] transition-all duration-200 active:scale-95 text-sm mb-3"
                                :aria-label="produit.is_favorited_by ? 'Retirer des favoris' : 'Ajouter aux favoris'">
                                <i class="fas fa-heart mr-2 text-sm"
                                    :class="{ 'text-[var(--espace-or)]': produit.is_favorited_by }"></i>
                                {{ produit.is_favorited_by ? 'Retirer des favoris' : 'Ajouter aux favoris' }}
                            </button>
                            <!-- Détails du commerçant -->
                            <div class="border-t pt-3 mt-3">
                                <h2 class="text-base font-semibold text-[var(--espace-vert)] mb-2 font-poppins">
                                    À propos du commerçant
                                </h2>
                                <p class="text-xs text-[var(--espace-gris)] mb-1">
                                    <strong>{{ produit.commercant.nom }}</strong>
                                    <span v-if="produit.commercant.verified" class="ml-1 text-[var(--espace-or)]"
                                        aria-label="Commerçant vérifié" title="Commerçant vérifié">
                                        <i class="fas fa-check-circle text-[10px]"></i>
                                    </span>
                                </p>
                                <p class="text-xs text-[var(--espace-gris)] mb-1">
                                    {{ produit.commercant.bio || 'Aucune description disponible' }}
                                </p>
                                <p class="text-xs text-[var(--espace-gris)] mb-1">
                                    <strong>Ville :</strong> {{ produit.commercant.ville || 'Non spécifiée' }}
                                </p>
                                <p class="text-xs text-[var(--espace-gris)] mb-2">
                                    <strong>Note :</strong> {{ produit.commercant.rating || 'Non évalué' }} / 5
                                </p>
                                <RouterLink :to="`/commercant/${produit.commercant_id}`"
                                    class="text-[var(--espace-vert)] hover:text-[var(--espace-or)] hover:underline text-xs font-poppins"
                                    aria-label="Voir le profil du commerçant">
                                    Voir le profil du commerçant
                                </RouterLink>
                            </div>
                            <!-- Actions -->
                            <div class="flex flex-col sm:flex-row gap-3 mt-4">
                                <button v-if="authStore.user?.commercant?.id !== produit.commercant_id"
                                    @click="addToCart"
                                    class="flex-1 bg-[var(--espace-or)] text-[var(--espace-vert)] font-semibold px-4 py-2 rounded-lg hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] transition-all duration-200 active:scale-95 text-sm"
                                    aria-label="Ajouter au panier">
                                    <i class="fas fa-shopping-cart mr-2 text-sm"></i> Ajouter au panier
                                </button>
                                <button
                                    v-if="produit.collaboratif && authStore.user?.commercant?.id !== produit.commercant_id"
                                    @click="openCollaborationModal"
                                    class="flex-1 bg-[var(--espace-vert)] text-[var(--espace-blanc)] font-semibold px-4 py-2 rounded-lg hover:bg-[var(--espace-or)] hover:text-[var(--espace-vert)] transition-all duration-200 active:scale-95 text-sm"
                                    aria-label="Collaborer sur ce produit">
                                    <i class="fas fa-handshake mr-2 text-sm"></i> Collaborer
                                </button>
                                <button v-if="authStore.user?.commercant?.id === produit.commercant_id"
                                    @click="editProduit"
                                    class="flex-1 bg-[var(--espace-vert)] text-[var(--espace-blanc)] font-semibold px-4 py-2 rounded-lg hover:bg-[var(--espace-or)] hover:text-[var(--espace-vert)] transition-all duration-200 active:scale-95 text-sm"
                                    aria-label="Modifier le produit">
                                    <i class="fas fa-edit mr-2 text-sm"></i> Modifier le produit
                                </button>
                            </div>
                        </div>
                    </div>
                </Transition>
                <!-- Produits similaires -->
                <div v-if="relatedProducts.length" class="mt-6">
                    <h2 class="text-lg sm:text-xl font-bold text-[var(--espace-vert)] mb-3 font-poppins">
                        Produits similaires
                    </h2>
                    <TransitionGroup name="fade" tag="div"
                        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        <ProductCard v-for="related in relatedProducts" :key="related.id" :produit="related"
                            @toggle-favorite="productStore.toggleFavorite(related.id)" />
                    </TransitionGroup>
                </div>
            </div>
            <div v-else class="text-center text-[var(--espace-gris)] text-sm font-poppins">
                Produit non trouvé.
            </div>

            <!-- Modale de collaboration -->
            <Transition name="fade">
                <div v-if="showCollaborationModal"
                    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    @click.self="closeCollaborationModal" role="dialog" aria-modal="true"
                    aria-label="Proposer un prix de revente">
                    <div class="bg-[var(--espace-blanc)] rounded-lg p-4 sm:p-6 w-full max-w-md mx-4 shadow-lg">
                        <h2 class="text-base sm:text-lg font-semibold text-[var(--espace-vert)] mb-3 font-poppins">
                            Collaborer sur {{ produit.nom }}
                        </h2>
                        <p class="text-xs text-[var(--espace-gris)] mb-3">
                            Proposez un prix de revente (minimum : {{ produit.prix + (produit.marge_min || 0) }} XAF)
                        </p>
                        <form @submit.prevent="submitCollaboration" class="space-y-3">
                            <div>
                                <label for="prix_revente" class="text-xs text-[var(--espace-vert)] font-medium">Prix de
                                    revente (XAF)</label>
                                <input id="prix_revente" v-model.number="prixRevente" type="number" min="0"
                                    class="w-full h-10 p-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--espace-or)] transition"
                                    :aria-label="`Prix de revente pour ${produit.nom}`" required />
                                <p v-if="prixRevente" class="text-xs text-[var(--espace-gris)] mt-1">
                                    Marge potentielle : {{ prixRevente - produit.prix }} XAF
                                </p>
                            </div>
                            <div class="flex gap-3">
                                <button type="submit"
                                    class="flex-1 bg-[var(--espace-or)] text-[var(--espace-vert)] font-semibold px-4 py-2 rounded-lg hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] transition-all duration-200 active:scale-95 text-xs"
                                    aria-label="Envoyer la demande de collaboration">
                                    Envoyer
                                </button>
                                <button type="button" @click="closeCollaborationModal"
                                    class="flex-1 bg-[var(--espace-gris)] text-[var(--espace-blanc)] font-semibold px-4 py-2 rounded-lg hover:bg-gray-700 transition-all duration-200 active:scale-95 text-xs"
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

.slide-up-enter-active,
.slide-up-leave-active {
    transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
    transform: translateY(10px);
    opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(10px);
}

button:active {
    transform: scale(0.95);
}
</style>