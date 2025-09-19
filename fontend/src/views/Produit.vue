<!-- src/views/ProductDetails.vue -->
<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/Auth';
import { useUserStateStore } from '../stores/userState';
import { useToast } from 'vue-toastification';
import { useProductStore } from '../stores/product';
import ProductCard from '../components/ProductCard.vue';
import Loader from '../components/Loader.vue';
import AppHeader from '../components/AppHeader.vue';
import apiClient from '../api/index';

const productStore = useProductStore();
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const userStateStore = useUserStateStore();
const toast = useToast();
const relatedProducts = ref<any[]>([]);
const showCollaborationModal = ref(false);
const prixRevente = ref<number | null>(null);
const observer = ref<IntersectionObserver | null>(null);
const loadMoreTrigger = ref<HTMLElement | null>(null);
const showBoostModal = ref(false); // Modale pour le boost
const targetViews = ref(0); // Vues cibles, début à 0
const calculatedCost = ref(0); // Coût initial minimum (basé sur vues)

// Intervalles stricts de 500 de 0 à 10000
const viewIntervals = [0, 500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 5500, 6000, 6500, 7000, 7500, 8000, 8500, 9000, 9500, 10000]; // 21 valeurs
const viewFactors = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]; // Facteurs linéaires commençant à 0

// Fonction pour formater les nombres (vues et favoris)
const formatNumber = (num: number | undefined): string => {
    if (num == null || isNaN(num) || num === 0) return "0";

    const absNum = Math.abs(num);
    if (absNum < 1000) return num.toString();
    if (absNum < 10000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + "k";
    if (absNum < 1000000) return Math.floor(num / 1000) + "k";
    if (absNum < 1000000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + "M";
    return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + "B";
};

const fetchProduit = async () => {
    try {
        productStore.isLoading = true;
        await productStore.viewProduct(route.params.id);
        productStore.isLoading = false;
        if (productStore.product.photos && !productStore.product.photo_url) {
            productStore.product.photo_url = productStore.product.photos[0];
        }
        await productStore.fetchProducts({ category: productStore.product.category_id, per_page: 8 }, true);
    } catch (error: any) {
        toast.error(error || 'Erreur lors du chargement du produit');
        router.push({ name: 'home' });
    } finally {
        productStore.isLoading = false;
    }
};

const contactCommercant = () => {
    if (!authStore.user) {
        toast.error('Veuillez vous connecter pour contacter le commerçant');
        router.push({ name: 'login' });
        return;
    }
    const commerçantPhone = productStore.product.commercant?.telephone;
    const message = encodeURIComponent(`Bonjour ${productStore.product.commercant?.nom}, je suis intéressé par ${productStore.product.nom}. Pouvez-vous me contacter ?`);
    window.open(`https://wa.me/${commerçantPhone}?text=${message}`, '_blank');
};

const openCollaborationModal = () => {
    if (!authStore.user) {
        toast.error('Veuillez vous connecter pour collaborer');
        router.push({ name: 'login' });
        return;
    }
    if (authStore.user.commercant?.id === productStore.product.commercant_id) {
        toast.error('Vous ne pouvez pas collaborer sur votre propre produit');
        return;
    }
    if (!productStore.product.collaboratif) {
        toast.error('Ce produit n’est pas ouvert à la collaboration');
        return;
    }
    prixRevente.value = productStore.product.prix + (productStore.product.marge_min || 500);
    showCollaborationModal.value = true;
};

const submitCollaboration = async () => {
    if (!prixRevente.value || prixRevente.value < productStore.product.prix + (productStore.product.marge_min || 0)) {
        toast.error(`Le prix de revente doit être supérieur ou égal à ${productStore.product.prix + (productStore.product.marge_min || 0)} XAF`);
        return;
    }
    const success = await userStateStore.addCollaboration({
        produit_id: productStore.product.id,
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
    router.push({ path: `/commercant/produits/${productStore.product.id}/edit` });
};

const viewCommercant = () => {
    router.push(`/commercants/${productStore.product.commercant_id}`);
};

const boostProduit = async () => {
    if (!authStore.user || authStore.user.commercant?.id !== productStore.product.commercant_id) {
        toast.error('Seul le commerçant propriétaire peut booster ce produit');
        return;
    }

    if (authStore.user.jetons < calculatedCost.value) {
        toast.error(`Pas assez de Jetons. Il vous faut ${calculatedCost.value} Jetons pour ce boost.`);
        return;
    }

    try {
        const response = await apiClient.post(`/produits/${productStore.product.id}/boost`, {
            target_views: targetViews.value,
        });
        authStore.user.jetons -= calculatedCost.value;
        productStore.product.boosted = true;
        toast.success(response.data.message || 'Produit boosté avec succès !');
        showBoostModal.value = false;
    } catch (error: any) {
        toast.error(error.response?.data?.message || 'Erreur lors du boostage du produit');
    }
};

const openBoostModal = () => {
    if (!authStore.user || authStore.user.commercant?.id !== productStore.product.commercant_id) {
        toast.error('Seul le commerçant propriétaire peut booster ce produit');
        return;
    }
    showBoostModal.value = true;
    calculateCost();
};

const calculateCost = () => {
    const index = viewIntervals.indexOf(targetViews.value);
    calculatedCost.value = index !== -1 ? Math.max(5, viewFactors[index]) : 5; // Minimum 5 jetons
};

watch(targetViews, () => {
    calculateCost();
});

const handleMouseOver = (productId: string) => {
    recordView(productId);
};

const handleTouchStart = (productId: string) => {
    recordView(productId);
};

const recordView = async (productId: string) => {
    const userId = authStore.user?.id;
    if (!userId) {
        toast.error('Connexion requise pour enregistrer la vue.');
        return;
    }

    const viewedProducts = JSON.parse(localStorage.getItem('viewedProducts') || '{}');
    const today = new Date().toISOString().split('T')[0];
    const lastResetDate = localStorage.getItem('lastResetDate');

    if (!lastResetDate || lastResetDate !== today) {
        localStorage.removeItem('viewedProducts');
        localStorage.setItem('lastResetDate', today);
    }

    if (viewedProducts[productId]) {
        return;
    }

    try {
        setTimeout(async () => {
            const response = await apiClient.post(`/record_view`, {
                product_id: productId,
                user_id: userId,
            });
        }, 1000);

        viewedProducts[productId] = true;
        localStorage.setItem('viewedProducts', JSON.stringify(viewedProducts));
    } catch (error: any) {
        console.error('Erreur lors de l\'enregistrement de la vue:', error);
        toast.error(error.response?.data?.message || 'Erreur lors de l\'enregistrement de la vue.');
    }
};

const handleFavorite = async () => {
    try {
        await productStore.toggleFavorite(productStore.product.id);
    } catch (error: any) {
        toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour des favoris.');
    }
};

const initChatFromProduct = (productId: string, productName: string, receiverId: number) => {
    if (!authStore.user) {
        toast.error('Veuillez vous connecter pour démarrer une conversation');
        router.push({ name: 'login' });
        return;
    }
    const productData = {
        id: productId,
        name: productName,
        commercant_id: productStore.product.commercant_id,
        name_user: authStore.user?.nom || 'Inconnu'
    };
    localStorage.setItem('chatProduct', JSON.stringify(productData));
    router.push(`/messages/${receiverId}`);
};

// Gestion du slider
const currentSlideIndex = ref(0);
const nextSlide = () => {
    const maxIndex = (productStore.product.photos?.length || 1) - 1;
    currentSlideIndex.value = Math.min(currentSlideIndex.value + 1, maxIndex);
};
const prevSlide = () => {
    currentSlideIndex.value = Math.max(currentSlideIndex.value - 1, 0);
};

onMounted(() => {
    fetchProduit();
    userStateStore.initializeState();

    observer.value = new IntersectionObserver(
        (entries) => {
            if (entries[0].isIntersecting && !productStore.isLoading && productStore.hasMore) {
                productStore.fetchProducts({ category: productStore.product.category_id, per_page: 8 }, false);
            }
        },
        { threshold: 0.1 }
    );

    if (loadMoreTrigger.value) {
        observer.value.observe(loadMoreTrigger.value);
    }
});

onUnmounted(() => {
    if (observer.value && loadMoreTrigger.value) {
        observer.value.unobserve(loadMoreTrigger.value);
    }
});

watch(
    () => route.params.id,
    (newId) => {
        if (newId) {
            fetchProduit();
            currentSlideIndex.value = 0;
        }
    }
);

watch(productStore.product, (newProduit) => {
    if (newProduit) {
        productStore.page = 1;
        productStore.fetchProducts({ category: newProduit.category_id, per_page: 4 }, true);
        currentSlideIndex.value = 0;
    }
});
</script>

<template>
    <Loader :isLoading="productStore.isLoading" />
    <div class="relative h-full overflow-y-scroll bg-[var(--espace-blanc)] pt-16 pb-0 px-4 sm:px-6">
        <div class="container mx-auto max-w-5xl">
            <div v-if="productStore.isLoading" class="text-center text-[var(--espace-gris)]">
                <!-- Loader géré par Loader.vue -->
            </div>
            <div v-else-if="productStore.product" class="bg-[var(--espace-blanc)] rounded-lg shadow-md p-4 sm:p-6">
                <Transition name="slide-up">
                    <div class="flex flex-col lg:flex-row gap-4 sm:gap-6">
                        <!-- Slider pour les images du produit -->
                        <div class="w-full lg:w-1/2 relative">
                            <div class="relative w-full h-64 sm:h-80 lg:h-96 overflow-hidden rounded-lg">
                                <div class="flex w-full h-full slider-container"
                                    :style="{ transform: `translateX(-${currentSlideIndex * 100}%)` }">
                                    <img v-for="(photo, index) in productStore.product.photos || [productStore.product.photo_url || 'https://via.placeholder.com/300']"
                                        :key="index" :src="photo"
                                        class="w-full h-full object-contain flex-shrink-0 mx-auto"
                                        :alt="`Image de ${productStore.product.nom} - ${index + 1}`" />
                                </div>
                                <button v-if="productStore.product.photos && productStore.product.photos.length > 1"
                                    @click="prevSlide"
                                    class="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-75 hidden md:block"
                                    aria-label="Image précédente">
                                    <i class="fas fa-chevron-left"></i>
                                </button>
                                <button v-if="productStore.product.photos && productStore.product.photos.length > 1"
                                    @click="nextSlide"
                                    class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-75 hidden md:block"
                                    aria-label="Image suivante">
                                    <i class="fas fa-chevron-right"></i>
                                </button>
                                <div v-if="productStore.product.photos && productStore.product.photos.length > 1"
                                    class="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                                    <span v-for="(photo, index) in productStore.product.photos" :key="index"
                                        class="w-2 h-2 rounded-full bg-gray-400"
                                        :class="{ 'bg-[var(--espace-or)]': index === currentSlideIndex }"></span>
                                </div>
                            </div>
                            <span
                                v-if="productStore.product.boosted"
                                class="absolute top-3 left-3 bg-[var(--espace-or)] text-[var(--espace-vert)] text-[10px] font-semibold px-2 py-1 rounded-full font-poppins"
                                aria-label="Produit boosté">
                                Boosté
                            </span>
                            <span v-if="productStore.product.collaboratif"
                                class="absolute top-3 right-3 bg-[var(--espace-or)] text-[var(--espace-vert)] text-[10px] font-semibold px-2 py-1 rounded-full font-poppins"
                                aria-label="Produit collaboratif">
                                Collaboratif
                            </span>
                            <span v-if="authStore.user?.premium"
                                class="absolute bottom-3 left-3 bg-[var(--espace-bleu)] text-[var(--espace-blanc)] text-[10px] font-semibold px-2 py-1 rounded-full font-poppins"
                                aria-label="Commerçant Pro">
                                Premium
                            </span>
                        </div>
                        <!-- Détails du produit -->
                        <div class="w-full lg:w-1/2">
                            <h1
                                class="text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--espace-vert)] mb-3 font-poppins">
                                {{ productStore.product.nom }}
                            </h1>
                            <p class="text-sm text-[var(--espace-gris)] mb-3">{{ productStore.product.description ||
                                'Aucune description disponible' }}</p>
                            <p class="text-lg sm:text-xl font-semibold text-[var(--espace-or)] mb-3">
                                {{ productStore.product.prix }} XAF
                            </p>
                            <div class="grid grid-cols-2 gap-3 sm:gap-4 mb-4 text-xs text-[var(--espace-gris)]">
                                <p><strong>Catégorie :</strong> {{ productStore.product.category?.nom || 'Non spécifiée'
                                    }}</p>
                                <p><strong>Quantité :</strong> {{ productStore.product.quantite }}</p>
                                <p><strong>Ville :</strong> {{ productStore.product.ville || 'Non spécifiée' }}</p>
                                <p><strong>Ajouté le :</strong> {{ new
                                    Date(productStore.product.created_at).toLocaleDateString('fr-FR') }}</p>
                                <div class="flex items-center gap-3">
                                    <div class="flex items-center gap-1">
                                        <i class="fas fa-eye text-[10px]"></i>
                                        <span>{{ formatNumber(productStore.product.counts?.views_count) }} vues</span>
                                    </div>
                                    <div class="flex items-center gap-1">
                                        <i class="fas fa-bookmark text-[10px]"
                                            :class="{ 'text-[var(--espace-or)]': productStore.product.is_favorited_by }"></i>
                                        <span>{{ formatNumber(productStore.product.counts?.favorites_count) }}
                                            favoris</span>
                                    </div>
                                </div>
                            </div>
                            <button @click="handleFavorite"
                                class="w-full bg-[var(--espace-vert)] text-[var(--espace-blanc)] font-semibold py-2 rounded-lg hover:bg-[var(--espace-or)] hover:text-[var(--espace-vert)] transition-all duration-200 active:scale-95 text-sm mb-3"
                                :aria-label="productStore.product.is_favorited_by ? 'Retirer des favoris' : 'Ajouter aux favoris'">
                                <i class="fas fa-bookmark mr-2 text-sm"
                                    :class="{ 'text-[var(--espace-or)]': productStore.product.is_favorited_by }"></i>
                                {{ productStore.product.is_favorited_by ? 'Retirer des favoris' : 'Ajouter aux favoris'
                                }}
                            </button>
                            <!-- Détails du commerçant -->
                            <div class="border-t pt-3 mt-3">
                                <h2 class="text-base font-semibold text-[var(--espace-vert)] mb-2 font-poppins">
                                    À propos du commerçant
                                </h2>
                                <p class="text-xs text-[var(--espace-gris)] mb-1">
                                    <strong>{{ productStore.product.commercant?.nom }}</strong>
                                    <span v-if="productStore.product.commercant?.verified"
                                        class="ml-1 text-[var(--espace-or)]" aria-label="Commerçant vérifié"
                                        title="Commerçant vérifié">
                                        <i class="fas fa-check-circle text-[10px]"></i>
                                    </span>
                                </p>
                                <p class="text-xs text-[var(--espace-gris)] mb-1">
                                    {{ productStore.product.commercant?.description || 'Aucune description disponible'
                                    }}
                                </p>
                                <p class="text-xs text-[var(--espace-gris)] mb-1">
                                    <strong>Ville :</strong> {{ productStore.product.commercant?.ville || 'Nonspécifiée'
                                    }}
                                </p>
                                <p class="text-xs text-[var(--espace-gris)] mb-2">
                                    <strong>Note :</strong> {{
                                        Number(productStore.product.commercant?.rating).toFixed(1) || 'Non évalué'
                                    }} / 5
                                </p>
                                <router-link :to="`/commercants/${productStore.product.commercant_id}`"
                                    class="text-[var(--espace-vert)] hover:text-[var(--espace-or)] hover:underline text-xs font-poppins"
                                    aria-label="Voir le profil du commerçant">
                                    Voir le profil du commerçant
                                </router-link>
                            </div>
                            <!-- Actions -->
                            <div class="flex flex-col sm:flex-row gap-3 mt-4">
                                <button
                                    v-if="productStore.product.collaboratif && authStore.user?.commercant?.id !== productStore.product.commercant_id"
                                    @click="openCollaborationModal"
                                    class="flex-1 bg-[var(--espace-vert)] text-[var(--espace-blanc)] font-semibold px-4 py-2 rounded-lg hover:bg-[var(--espace-or)] hover:text-[var(--espace-vert)] transition-all duration-200 active:scale-95 text-sm"
                                    aria-label="Collaborer sur ce produit">
                                    <i class="fas fa-handshake mr-2 text-sm"></i> Collaborer
                                </button>
                                <button v-if="authStore.user?.commercant?.id === productStore.product.commercant_id"
                                    @click="editProduit"
                                    class="flex-1 bg-[var(--espace-vert)] text-[var(--espace-blanc)] font-semibold px-4 py-2 rounded-lg hover:bg-[var(--espace-or)] hover:text-[var(--espace-vert)] transition-all duration-200 active:scale-95 text-sm"
                                    aria-label="Modifier le produit">
                                    <i class="fas fa-edit mr-2 text-sm"></i> Modifier le produit
                                </button>
                                <button v-if="authStore.user?.commercant?.id === productStore.product.commercant_id"
                                    @click="openBoostModal"
                                    class="flex-1 bg-[var(--espace-or)] text-[var(--espace-vert)] flex items-center justify-center gap-1 font-semibold px-4 py-2 rounded-lg hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] transition-all duration-200 active:scale-95 text-sm"
                                    :disabled="!!productStore.product.boosted "
                                    :aria-label="productStore.product.boosted  ? 'Boost déjà actif' : 'Personnaliser le boost'">
                                    <span class="md:flex">Boost</span>
                                    <i class="fas fa-rocket mr-2 text-sm"></i>
                                </button>
                                <button v-if="authStore.user?.commercant?.id !== productStore.product.commercant_id"
                                    @click="initChatFromProduct(productStore.product.id, productStore.product.nom, productStore.product.commercant.user.id)"
                                    class="flex-1 bg-green-500 text-[var(--espace-blanc)] font-semibold px-4 py-2 rounded-lg hover:bg-green-600 transition-all duration-200 active:scale-95 text-sm"
                                    aria-label="Envoyer un message ">
                                    <i class="fas fa-comment mr-2 text-sm"></i> Envoyer un message
                                </button>
                            </div>
                        </div>
                    </div>
                </Transition>
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
                            Collaborer sur {{ productStore.product.nom }}
                        </h2>
                        <p class="text-xs text-[var(--espace-gris)] mb-3">
                            Proposez un prix de revente (minimum : {{ productStore.product.prix +
                                (productStore.product.marge_min || 0) }} XAF)
                        </p>
                        <form @submit.prevent="submitCollaboration" class="space-y-3">
                            <div>
                                <label for="prix_revente" class="text-xs text-[var(--espace-vert)] font-medium">Prix de
                                    revente (XAF)</label>
                                <input id="prix_revente" v-model.number="prixRevente" type="number" min="0"
                                    class="w-full h-10 p-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--espace-or)] transition"
                                    :aria-label="`Prix de revente pour ${productStore.product.nom}`" required />
                                <p v-if="prixRevente" class="text-xs text-[var(--espace-gris)] mt-1">
                                    Marge potentielle : {{ prixRevente - productStore.product.prix }} XAF
                                </p>
                            </div>
                            <div class="flex gap-3">
                                <button type="submit"
                                    class="flex-1 bg-[var(--espace-or)] text-[var(--espace-vert)] font-semibold px-4 py-2 rounded-lg hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] transition-all duration-200 active:scale-95 text-xs"
                                    aria-label="Envoyer la demande de collaboration">
                                    Envoyer
                                </button>
                                <button type="button" @click="closeCollaborationModal"
                                    class="flex-1 bg-[var(--espace-gris)] text-[var(--espace-blanc)] font-semibold px-4 py-2 rounded-lg hover:bg-gray-700 transition-all duration-200 active:scale-95 text-sm"
                                    aria-label="Annuler">
                                    Annuler
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </Transition>

            <!-- Modale de boost personnalisé -->
            <Transition name="fade">
                <div v-if="showBoostModal"
                    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    @click.self="showBoostModal = false" role="dialog" aria-modal="true"
                    aria-label="Personnaliser le boost du produit">
                    <div
                        class="bg-[var(--espace-blanc)] rounded-lg p-6 w-full max-w-md mx-4 shadow-lg border border-[var(--espace-or)]">
                        <h2 class="text-lg font-semibold text-[var(--espace-vert)] mb-4 font-poppins">
                            Personnaliser le Boost
                        </h2>
                        <form @submit.prevent="boostProduit" class="space-y-6">
                            <div>
                                <label class="text-sm text-[var(--espace-vert)] font-medium mb-2 block">Objectif de
                                    vues</label>
                                <input type="range" v-model.number="targetViews" min="0" max="10000" step="500"
                                    class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[var(--espace-or)]"
                                    @input="calculateCost" />
                                <p class="text-xs text-[var(--espace-gris)] mt-1 text-center">
                                    {{ targetViews }} vues
                                </p>
                            </div>
                            <p class="text-sm text-[var(--espace-gris)]">Coût estimé : <strong
                                    class="text-[var(--espace-or)]">{{ calculatedCost }}</strong> Jetons</p>
                            <div class="flex gap-4">
                                <button type="submit"
                                    class="flex-1 bg-[var(--espace-or)] text-[var(--espace-vert)] font-semibold py-2 rounded-lg hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] transition-all duration-200 active:scale-95 text-sm">
                                    Confirmer
                                </button>
                                <button type="button" @click="showBoostModal = false"
                                    class="flex-1 bg-[var(--espace-gris)] text-[var(--espace-blanc)] font-semibold py-2 rounded-lg hover:bg-gray-700 transition-all duration-200 active:scale-95 text-sm"
                                    aria-label="Annuler">
                                    Annuler
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </Transition>
        </div>
        <div v-if="productStore.products" class="mt-6">
            <h2 class="text-lg sm:text-xl font-bold text-[var(--espace-vert)] mb-3 font-poppins">
                Produits similaires
            </h2>
            <TransitionGroup name="fade" tag="div"
                class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <ProductCard v-for="produit in productStore.products" :key="produit.id" :produit="produit"
                    @mouseover="handleMouseOver(produit.id)" @touchstart="handleTouchStart(produit.id)" />
            </TransitionGroup>
            <div ref="loadMoreTrigger" class="h-10 flex items-center justify-center" aria-live="polite"
                :aria-busy="productStore.isLoading">
                <p v-if="!productStore.hasMore" class="text-[var(--espace-gris)] text-xs font-poppins">
                    Aucun produit supplémentaire
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
    --espace-bleu: #3b82f6;
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

button:disabled {
    background-color: #a3bffa;
    color: #6b7280;
    cursor: not-allowed;
}

.slider-container {
    display: flex;
    transition: transform 0.3s ease;
    width: 100%;
    height: 100%;
}

@media (max-width: 768px) {
    .slider-button {
        display: none;
    }
}
</style>