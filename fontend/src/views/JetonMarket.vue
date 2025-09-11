<template>
    <Loader :isLoading="isLoading" />

    <div class="w-full pt-5 px-6 bg-gradient-to-b from-gray-50 to-gray-100 relative h-full">
        <!-- Titre principal (fixé en haut, simplifié) -->
        <!-- Titre principal (fixé en haut, simplifié) -->
        <div
            class="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-md px-4 py-1 flex items-center justify-between">
            <router-link to="home"
                class="flex items-center gap-2 text-[var(--espace-vert)] hover:text-[var(--espace-or)] transition rounded-xl p-1 sm:p-2">
                <i class="fas fa-arrow-left text-lg sm:text-xl"></i>
                <span class="hidden sm:inline font-semibold">Retour</span>
            </router-link>
            <div class="text-center">
                <h1 class="text-xl font-bold text-[var(--espace-vert)]">🌍 Marché</h1>
                <p class="text-xs text-gray-600 mt-0 sm:mt-3">Achetez & vendez vos jetons en toute sécurité 🚀</p>
            </div>
            <div class="w-10"></div> <!-- Espacement à droite pour équilibrer -->
        </div>


        <!-- Liste des offres responsive -->
        <!-- Liste des offres responsive -->
        <div v-if="offers.length > 0"
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-3 mt-4"
            @scroll.passive="handleScroll">
            <div v-for="offer in filteredOffers" :key="offer.id"
                class="bg-white py-6 px-3 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition transform hover:-translate-y-2 hover:border-[var(--espace-or)]">
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-3">
                        <router-link :to="getProfileRoute(offer)"
                            class="w-10 h-10 bg-[var(--espace-or)] rounded-full flex items-center justify-center overflow-hidden cursor-pointer">
                            <img v-if="offer.user.photo" :src="storageUrl + offer.user.photo" alt="Photo de profil"
                                class="w-full h-full object-cover">
                            <i v-else class="fas fa-user-circle text-2xl text-gray-500"></i>
                        </router-link>
                        <!-- {{ offer }} -->
                        <router-link :to="getProfileRoute(offer)"
                            class="text-lg font-bold text-[var(--espace-vert)] truncate hover:underline">
                            {{ offer.user.nom }}
                        </router-link>
                    </div>
                    <span class="px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
                        {{ offer.nombre_jetons }} <i class="fas fa-coins"></i>
                    </span>
                </div>
                <p class="text-gray-700 text-sm sm:text-base"><strong>💵 Prix :</strong> {{ offer.prix_unitaire }}
                    FCFA/jeton</p>
                <p class="text-gray-700 text-sm sm:text-base"><strong>💰 Total :</strong> {{ offer.total_prix }} FCFA
                </p>
                <p class="text-xs text-gray-500 mt-3">📅 Publiée le {{ new
                    Date(offer.date_creation).toLocaleDateString() }}</p>
                <button @click="openPaymentModal(offer.id, offer.wallet?.phone_number, offer.wallet?.payment_service)"
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
                    class="font-bold text-[var(--espace-vert)] cursor-pointer underline"
                    @click="checkWalletsBeforeOffer">poster une
                    offre</span>
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
                        <!-- Sélection du portefeuille -->
                        <div>
                            <label class="block text-sm font-semibold text-[var(--espace-vert)]">Portefeuille à
                                utiliser</label>
                            <select v-model="offerForm.walletId" required
                                class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[var(--espace-vert)] focus:outline-none">
                                <option value="" disabled>Sélectionnez un portefeuille</option>
                                <option v-for="wallet in userWallets" :key="wallet.id" :value="wallet.id">
                                    {{ wallet.phone_number }} ({{ wallet.payment_service }})
                                </option>
                            </select>
                        </div>
                        <p class="text-sm text-gray-500">💰 Total: <span class="font-bold">{{ totalPrice }}</span> FCFA
                            | 🏦
                            Commission (10%): <span class="font-bold">{{ commission }}</span> FCFA</p>
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
                                    {{ wallet.phone_number }} ({{ wallet.payment_service }})
                                </option>
                            </select>
                        </div>
                        <p class="text-sm text-[var(--espace-gris)]">Montant total : <span class="font-bold">{{
                            selectedOfferTotal }}</span> FCFA</p>
                        <button type="submit" :disabled="loading"
                            class="w-full bg-gradient-to-r from-[var(--espace-or)] to-yellow-400 text-[var(--espace-vert)] py-3 rounded-xl font-bold shadow hover:from-[var(--espace-vert)] hover:to-green-700 hover:text-white transition">
                            <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
                            <span v-if="loading" class="">Veuillez patienter</span>
                            <span v-else class="">Confirmer le paiement</span>
                        </button>
                    </form>
                </div>
            </div>
        </Transition>

        <!-- Modal Créer un Portefeuille -->
        <Transition name="fade">
            <div v-if="showCreateWallet"
                class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
                <div class="bg-white p-8 rounded-3xl w-full max-w-lg shadow-2xl relative border border-gray-200">
                    <button @click="showCreateWallet = false"
                        class="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-lg">✖</button>
                    <h2 class="text-2xl font-bold text-[var(--espace-vert)] mb-6 text-center">💳 Créer un Portefeuille
                    </h2>
                    <form @submit.prevent="createWallet" class="space-y-5">
                        <div>
                            <label class="block text-sm font-semibold text-[var(--espace-vert)]">Numéro de
                                téléphone</label>
                            <input v-model="newWallet.phone_number" type="tel" placeholder="Ex: 670123456" required
                                class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[var(--espace-vert)] focus:outline-none"
                                pattern="6[0-9]{8}">
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-[var(--espace-vert)]">Service de
                                paiement</label>
                            <select v-model="newWallet.payment_service" required
                                class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[var(--espace-vert)] focus:outline-none">
                                <option value="" disabled>Sélectionnez un service</option>
                                <option value="ORANGE">Orange Money</option>
                                <option value="MTN">MTN Mobile Money</option>
                            </select>
                        </div>
                        <button type="submit" :disabled="loading"
                            class="w-full bg-gradient-to-r from-[var(--espace-or)] to-yellow-400 text-[var(--espace-vert)] py-3 rounded-xl font-bold shadow hover:from-[var(--espace-vert)] hover:to-green-700 hover:text-white transition">
                            <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i> Créer
                        </button>
                    </form>
                </div>
            </div>
        </Transition>

        <!-- Composant WalletManager -->
        <WalletManager v-if="showWalletManager" :show="showWalletManager" :wallets="userWallets"
            @close="showWalletManager = false" @refresh-wallets="fetchUserWallets" />

        <!-- Composant OfferManager -->
        <OfferManager v-if="showOfferManager" :show="showOfferManager" :wallets="userWallets" :offers="userOffers"
            @close="showOfferManager = false" @refresh-offers="fetchOffers" />

        <!-- Barre de navigation fixe en bas -->
        <div
            class="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-md px-4 py-3 flex items-center justify-around md:justify-between">
            <button @click="closeAllModals(); showFilters = true"
                class="flex items-center gap-1 rounded-xl p-2 hover:bg-gray-200 transition text-[var(--espace-vert)]">
                <i class="fas fa-filter text-xl"></i>
                <span class="hidden md:inline font-semibold">Filtres</span>
            </button>
            <button @click="refreshOffers"
                class="flex items-center gap-1 rounded-xl p-2 hover:bg-gray-200 transition text-[var(--espace-vert)]"
                :class="{ 'bg-gray-400': refreshing }">
                <i class="fas fa-sync-alt text-xl" :class="{ 'fa-spin': refreshing }"></i>
                <span class="hidden md:inline font-semibold">Actualiser</span>
            </button>
            <button @click="closeAllModals(); // ✅ ferme tout
            showWalletManager = true;

            "
                class="flex items-center gap-1 rounded-xl p-2 hover:bg-[var(--espace-or)] transition  bg-[var(--espace-ver)] text-[var(--espace-vert)]">
                <i class="fas fa-wallet text-xl"></i>
                <span class="hidden md:inline font-semibold">Porte feuille</span>
            </button>
            <button @click="checkWalletsBeforeOffer"
                class="flex items-center gap-1 rounded-xl p-2 hover:bg-[var(--espace-or)] transition text-[var(--espace-vert)]">
                <i class="fas fa-plus text-xl"></i>
                <span class="hidden md:inline font-semibold">Poster</span>
            </button>
            <button @click=" closeAllModals(); showOfferManager = true; // ✅ ferme tout
            "
                class="flex items-center gap-1 rounded-xl p-2 hover:bg-[var(--espace-or)] transition text-[var(--espace-vert)]">
                <i class="fas fa-list text-xl"></i>
                <span class="hidden md:inline font-semibold">Offres</span>
            </button>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '../api/index';
import { useToast } from "vue-toastification";
import Loader from '../components/Loader.vue';
import WalletManager from '../components/WalletManager.vue';
import OfferManager from '../components/OfferManager.vue';
import { Offer, Wallet } from '../components/types';
// Fonction pour générer l'URL de base du stockage dynamiquement
const getStorageBaseUrl = () => {
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1") {
        return "http://localhost:8000/storage/";
    }
    return "https://espacecameroun.devfack.com/storage/"; // URL de production
};

// Computed property pour l'URL du stockage
const storageUrl = computed(() => getStorageBaseUrl());

const router = useRouter();
const offers = ref<Offer[]>([]);

const userOffers = ref([]);
const filters = ref({ quantityMin: '' });
const showOfferForm = ref(false);
const showFilters = ref(false);
const offerForm = ref({ nombre_jetons: 0, prix_unitaire: 0, description: '', walletId: '' });
const loading = ref(false);
const currentPage = ref(1);
const lastPage = ref(1);
const isFetching = ref(false);
const isLoading = ref(true);
const refreshing = ref(false);

// État pour les modals et gestionnaires
const showPaymentModal = ref(false);
const paymentDetails = ref({ walletId: '' });
const selectedOfferId = ref<number | null>(null);
const selectedOfferTotal = ref(0);
const userWallets = ref<any[]>([]);
const showCreateWallet = ref(false);
const newWallet = ref<Wallet>({
    id: 0,
    phone_number: '',
    payment_service: ''
});

const showWalletManager = ref(false);
const showOfferManager = ref(false);

const toast = useToast();

const closeAllModals = () => {
    showOfferForm.value = false;
    showFilters.value = false;
    showPaymentModal.value = false;
    showCreateWallet.value = false;
    showWalletManager.value = false;
    showOfferManager.value = false;
};

// Récupérer les portefeuilles de l'utilisateur
const fetchUserWallets = async () => {
    try {
        const response = await apiClient.get('/wallets');
        userWallets.value = response.data.data || [];
    } catch (error) {
        console.error('Erreur lors du chargement des portefeuilles:', error);
        userWallets.value = [];
    }
};

// Récupérer les offres de l'utilisateur
const fetchUserOffers = async () => {
    try {
        const response = await apiClient.get('/jeton_market/my-offers');
        userOffers.value = response.data.data || [];
    } catch (error: any) {

        if (error.response?.data?.message == 'Unauthenticated.') {
            router.push('login')
        }

        console.error('Erreur lors du chargement des offres de l\'utilisateur:', error);
        userOffers.value = [];
    }
};

const checkWalletsBeforeOffer = async () => {
    await fetchUserWallets();
    closeAllModals();

    if (userWallets.value.length === 0) {
        showCreateWallet.value = true;
    } else {
        showOfferForm.value = true;
    }
};

const createWallet = async () => {
    loading.value = true;
    try {
        closeAllModals();

        const response = await apiClient.post('/wallets', newWallet.value);
        toast.success(response.data.message || "Portefeuille créé avec succès !");
        showCreateWallet.value = false;
        await fetchUserWallets();
        showOfferForm.value = true;
    } catch (error: any) {
        if (error.response?.data?.message == 'Unauthenticated.') {
            router.push('login')
        }

        toast.error(error.response?.data?.message || "Erreur lors de la création du portefeuille");
        console.error('Erreur:', error);
    } finally {
        loading.value = false;
        newWallet.value = { id: 0, phone_number: '', payment_service: '' };
    }
};

const openOfferForm = () => {
    closeAllModals();
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
const commission = computed(() => totalPrice.value * 0.10);

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
    } catch (error : any) {
        if (error.response?.data?.message == 'Unauthenticated.') {
            router.push('login')
        }

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
    if (!offerForm.value.walletId) {
        toast.error('Veuillez sélectionner un portefeuille.');
        return;
    }

    loading.value = true;
    try {
        const response = await apiClient.post('/jeton_market/offer', {
            ...offerForm.value,
            wallet_id: offerForm.value.walletId,
            total_price: totalPrice.value,
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

const openPaymentModal = (offerId: number, walletPhone?: string, walletService?: string) => {
    closeAllModals();
    const offer = offers.value.find(o => o.id === offerId);
    if (offer) {
        selectedOfferId.value = offerId;
        selectedOfferTotal.value = offer.total_prix;
        paymentDetails.value.walletId = '';
        showPaymentModal.value = true;
    }
};

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
        console.error('Erreur lors de l\'achat:', error.response.data.message);
        toast.error(error.response?.data?.message || "Erreur lors de l'achat");
    } finally {
        loading.value = false;
        selectedOfferId.value = null;
        selectedOfferTotal.value = 0;
    }
};

const buyOffer = async (offerId: number) => {
    openPaymentModal(offerId);
};

// Nouvelle méthode pour déterminer la route du profil
const getProfileRoute = (offer: any) => {
    //console.log(offer.user_id);
    return offer.user?.commercant ? `/commercants/${offer.user.commercant.id}` : `/profile/public/${offer.user_id}`;
};

// Gestion du scroll et du chargement initial
onMounted(() => {
    isLoading.value = true;
    fetchOffers();
    fetchUserWallets();
    fetchUserOffers();
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