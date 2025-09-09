<template>
    <Loader :isLoading="isLoading" />

    <div class="w-full pt-5 px-6 bg-gradient-to-b from-gray-50 to-gray-100 relative h-full">
        <!-- Barre flottante fixe -->
        <div
            class="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-md px-1 py-3 flex items-center justify-between">
            <button @click="showFilters = true"
                class="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-xl font-semibold text-[var(--espace-vert)] hover:bg-gray-200 transition">
                <i class="fas fa-filter"></i> Filtres
            </button>
            <div class="flex items-center gap-4">
                <h1 class="text-xl font-bold text-[var(--espace-vert)]">🌍 Marché</h1>
                <button @click="refreshOffers"
                    class="flex items-center gap-2 bg-gray-200 px-3 py-2 rounded-xl font-semibold text-[var(--espace-vert)] hover:bg-gray-300 transition"
                    :class="{ 'bg-gray-400': refreshing }">
                    <i class="fas fa-sync-alt" :class="{ 'fa-spin': refreshing }"></i> Actualiser
                </button>
            </div>
            <button @click="openOfferForm"
                class="flex items-center gap-2 bg-[var(--espace-vert)] text-white px-4 py-2 rounded-xl font-semibold shadow hover:bg-[var(--espace-or)] hover:text-[var(--espace-vert)] transition">
                <i class="fas fa-plus"></i> Poster
            </button>
        </div>

        <!-- Liste des offres responsive -->
        <div v-if="offers.length > 0"
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-3 mt-4"
            @scroll.passive="handleScroll">
            <div v-for="offer in filteredOffers" :key="offer.id"
                class="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition transform hover:-translate-y-2 hover:border-[var(--espace-or)]">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-bold text-[var(--espace-vert)] truncate">{{ offer.user.nom }}</h3>
                    <span class="px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">{{
                        offer.nombre_jetons }} <i class="fas fa-coins"></i></span>
                </div>
                <p class="text-gray-700 text-sm sm:text-base"><strong>💵 Prix :</strong> {{ offer.prix_unitaire }}
                    FCFA/jeton</p>
                <p class="text-gray-700 text-sm sm:text-base"><strong>💰 Total :</strong> {{ offer.total_prix }} FCFA
                </p>
                <p class="text-xs text-gray-500 mt-3">📅 Publiée le {{ new
                    Date(offer.date_creation).toLocaleDateString() }}</p>
                <button @click="openPaymentModal(offer.id, offer.wallet?.phone_number, offer.wallet?.service)"
                    class="mt-6 w-full bg-gradient-to-r from-[var(--espace-or)] to-yellow-400 text-[var(--espace-vert)] px-3 py-2 sm:px-4 sm:py-3 rounded-xl font-bold shadow hover:from-[var(--espace-vert)] hover:to-green-700 hover:text-white transition text-sm sm:text-base">
                    ⚡ Acheter
                </button>
            </div>
            <div v-if="loading" class="col-span-full text-center py-4">
                <i class="fas fa-spinner fa-spin text-2xl text-[var(--espace-vert)]"></i>
            </div>
        </div>

        <!-- Message vide -->
        <div v-else class="text-center text-gray-600 py-24">
            <i class="fas fa-box-open text-6xl text-gray-400 mb-6"></i>
            <p class="text-xl">Aucune offre disponible pour le moment.</p>
            <p class="mt-3">Soyez le premier à <span
                    class="font-bold text-[var(--espace-vert)] cursor-pointer underline" @click="openOfferForm">poster
                    une offre</span>
                🎉</p>
        </div>

        <!-- Modal Poster une offre -->
        <Transition name="fade">
            <div v-if="showOfferForm"
                class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
                <div class="bg-white p-8 rounded-3xl w-full max-w-lg shadow-2xl relative border border-gray-200">
                    <button @click="showOfferForm = false"
                        class="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-lg">✖</button>
                    <h2 class="text-2xl font-bold text-[var(--espace-vert)] mb-6 text-center">📝 Nouvelle Offre</h2>
                    <form @submit.prevent="submitOffer" class="space-y-5">
                        <div>
                            <label class="block text-sm font-semibold text-[var(--espace-vert)]">Quantité</label>
                            <input v-model.number="offerForm.nombre_jetons" type="number" min="1" required
                                class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[var(--espace-vert)] focus:outline-none">
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-[var(--espace-vert)]">Prix unitaire
                                (FCFA)</label>
                            <input v-model.number="offerForm.prix_unitaire" type="number" min="1" required
                                class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[var(--espace-vert)] focus:outline-none">
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-[var(--espace-vert)]">Description
                                (optionnel)</label>
                            <textarea v-model="offerForm.description" rows="3"
                                class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[var(--espace-vert)] focus:outline-none"></textarea>
                        </div>
                        <!-- Configuration du portefeuille -->
                        <div>
                            <label class="block text-sm font-semibold text-[var(--espace-vert)]">Numéro de téléphone du
                                portefeuille</label>
                            <input v-model="offerForm.walletPhoneNumber" type="tel" placeholder="Ex: 670123456" required
                                class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[var(--espace-vert)] focus:outline-none"
                                pattern="6[0-9]{8}">
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-[var(--espace-vert)]">Service de
                                paiement</label>
                            <select v-model="offerForm.walletService" required
                                class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[var(--espace-vert)] focus:outline-none">
                                <option value="" disabled>Sélectionnez un service</option>
                                <option value="ORANGE">Orange Money</option>
                                <option value="MTN">MTN Mobile Money</option>
                            </select>
                        </div>
                        <p class="text-sm text-gray-500">💰 Total: <span class="font-bold">{{ totalPrice }}</span> FCFA
                            | 🏦
                            Commission (5%): <span class="font-bold">{{ commission }}</span> FCFA</p>
                        <button type="submit" :disabled="loading"
                            class="w-full bg-gradient-to-r from-[var(--espace-or)] to-yellow-400 text-[var(--espace-vert)] py-3 rounded-xl font-bold shadow hover:from-[var(--espace-vert)] hover:to-green-700 hover:text-white transition">
                            <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i> Publier
                        </button>
                    </form>
                </div>
            </div>
        </Transition>

        <!-- Modal Filtres -->
        <Transition name="fade">
            <div v-if="showFilters"
                class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
                <div class="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md relative">
                    <button @click="showFilters = false"
                        class="absolute top-3 right-3 text-gray-400 hover:text-red-500">✖</button>
                    <h2 class="text-lg font-bold text-[var(--espace-vert)] mb-4">🎛️ Filtres</h2>
                    <div class="space-y-4">
                        <input v-model.number="filters.quantityMin" type="number" placeholder="Quantité min"
                            class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[var(--espace-vert)]">
                    </div>
                    <button @click="applyFilters"
                        class="mt-6 w-full bg-[var(--espace-or)] text-[var(--espace-vert)] py-3 rounded-xl font-bold hover:bg-[var(--espace-vert)] hover:text-white transition">
                        🔍 Appliquer
                    </button>
                </div>
            </div>
        </Transition>

        <!-- Modal Paiement -->
        <Transition name="fade">
            <div v-if="showPaymentModal"
                class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
                <div class="bg-white p-8 rounded-3xl w-full max-w-lg shadow-2xl relative border border-gray-200">
                    <button @click="showPaymentModal = false"
                        class="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-lg">✖</button>
                    <h2 class="text-2xl font-bold text-[var(--espace-vert)] mb-6 text-center">📲 Paiement</h2>
                    <form @submit.prevent="confirmPayment" class="space-y-5">
                        <div>
                            <label class="block text-sm font-semibold text-[var(--espace-vert)]">Sélectionnez votre
                                portefeuille</label>
                            <select v-model="paymentDetails.walletId" required
                                class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[var(--espace-vert)] focus:outline-none">
                                <option value="" disabled>Sélectionnez un portefeuille</option>
                                <option v-for="wallet in userWallets" :key="wallet.id" :value="wallet.id">
                                    {{ wallet.phone_number }} ({{ wallet.service }})
                                </option>
                            </select>
                        </div>
                        <p class="text-sm text-[var(--espace-gris)]">Montant total : <span class="font-bold">{{
                                selectedOfferTotal }}</span> FCFA</p>
                        <button type="submit" :disabled="loading"
                            class="w-full bg-gradient-to-r from-[var(--espace-or)] to-yellow-400 text-[var(--espace-vert)] py-3 rounded-xl font-bold shadow hover:from-[var(--espace-vert)] hover:to-green-700 hover:text-white transition">
                            <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i> Confirmer le paiement
                        </button>
                    </form>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '../api/index';
import { useToast } from "vue-toastification";
import Loader from '../components/Loader.vue';

const router = useRouter();
const offers = ref([]);
const filters = ref({ quantityMin: '' });
const showOfferForm = ref(false);
const showFilters = ref(false);
const offerForm = ref({ nombre_jetons: 0, prix_unitaire: 0, description: '', walletPhoneNumber: '', walletService: '' });
const loading = ref(false);
const currentPage = ref(1);
const lastPage = ref(1);
const isFetching = ref(false);
const isLoading = ref(true); // Loader global
const refreshing = ref(false); // État pour l'actualisation

// État pour le modal de paiement
const showPaymentModal = ref(false);
const paymentDetails = ref({ walletId: '' });
const selectedOfferId = ref<number | null>(null);
const selectedOfferTotal = ref(0);
const userWallets = ref<any[]>([]); // Liste des portefeuilles de l'utilisateur

const toast = useToast();

// Récupérer les portefeuilles de l'utilisateur au montage
const fetchUserWallets = async () => {
    try {
        const response = await apiClient.get('/wallets');
        userWallets.value = response.data.data || [];
    } catch (error) {
        console.error('Erreur lors du chargement des portefeuilles:', error);
        userWallets.value = [];
    }
};

const openOfferForm = () => {
    showOfferForm.value = true;
};

const applyFilters = () => {
    showFilters.value = false;
    currentPage.value = 1;
    offers.value = [];
    fetchOffers();
};

const refreshOffers = async () => {
    refreshing.value = true;
    currentPage.value = 1;
    offers.value = [];
    await fetchOffers();
    refreshing.value = false;
};

const filteredOffers = computed(() => {
    return offers.value.filter(offer => {
        const quantityMatch = !filters.value.quantityMin || offer.nombre_jetons >= parseInt(filters.value.quantityMin, 10);
        return quantityMatch;
    });
});

const totalPrice = computed(() => offerForm.value.nombre_jetons * offerForm.value.prix_unitaire);
const commission = computed(() => totalPrice.value * 0.05);

const fetchOffers = async () => {
    if (isFetching.value || currentPage.value > lastPage.value) return;

    isFetching.value = true;
    try {
        const params = {
            page: currentPage.value,
            quantity_min: filters.value.quantityMin || undefined,
        };
        const response = await apiClient.get('/jeton_market/offers', { params });
        offers.value = [...offers.value, ...response.data.data];
        lastPage.value = response.data.last_page;
        currentPage.value += 1;
    } catch (error) {
        console.error('Erreur lors du chargement des offres:', error);
    } finally {
        isFetching.value = false;
        isLoading.value = false;
    }
};

const handleScroll = () => {
    const container = document.querySelector('.grid');
    if (container) {
        const { scrollTop, clientHeight, scrollHeight } = container;
        if (scrollTop + clientHeight >= scrollHeight - 300 && !isFetching.value) {
            fetchOffers();
        }
    }
};

const submitOffer = async () => {
    loading.value = true;
    try {
        const response = await apiClient.post('/jeton_market/offer', {
            ...offerForm.value,
            total_price: totalPrice.value, // Calculer le total pour l'API
        });
        showOfferForm.value = false;
        toast.success(response?.data?.message || "Offre créée avec succès !");
        fetchOffers();
    } catch (error: any) {
        toast.error(error.response?.data?.message || "Erreur lors de la création de l'offre");
        console.error('Erreur lors de la création de l\'offre:', error.response);
    } finally {
        loading.value = false;
    }
};

// Ouvre le modal de paiement avec les détails de l'offre sélectionnée
const openPaymentModal = (offerId: number, walletPhone?: string, walletService?: string) => {
    const offer = offers.value.find(o => o.id === offerId);
    if (offer) {
        selectedOfferId.value = offerId;
        selectedOfferTotal.value = offer.total_prix;
        paymentDetails.value.walletId = ''; // Réinitialiser la sélection
        showPaymentModal.value = true;
    }
};

// Confirme le paiement et envoie la requête
const confirmPayment = async () => {
    if (!selectedOfferId.value || !paymentDetails.value.walletId) {
        toast.error('Veuillez sélectionner un portefeuille.');
        return;
    }

    loading.value = true;
    try {
        const response = await apiClient.post(`/jeton_market/buy/${selectedOfferId.value}`, {
            wallet_id: paymentDetails.value.walletId,
        });
        showPaymentModal.value = false;
        fetchOffers();
        toast.success(response.data.message || "Achat effectué avec succès !");
    } catch (error: any) {
        toast.error(error.response?.data?.message || "Erreur lors de l'achat");
        console.error('Erreur lors de l\'achat:', error);
    } finally {
        loading.value = false;
        selectedOfferId.value = null;
        selectedOfferTotal.value = 0;
    }
};

const buyOffer = async (offerId: number) => {
    openPaymentModal(offerId);
};

// Gestion du scroll et du chargement initial
onMounted(() => {
    isLoading.value = true;
    fetchOffers();
    fetchUserWallets(); // Charger les portefeuilles au montage
    window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
:root {
    --espace-vert: #14532d;
    --espace-or: #facc15;
    --espace-blanc: #ffffff;
    --espace-gris: #6b7280;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.grid {
    height: calc(100vh - 200px);
    /* Ajuster selon la hauteur de la barre fixe et le padding */
    overflow-y: auto;
    scroll-behavior: smooth;
}
</style>