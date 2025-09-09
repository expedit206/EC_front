<template>
    <div v-if="show"
        class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm p-4">

        <div
            class=" h-full overflow-y-scroll pb-16 relative bg-white p-6 md:p-8 rounded-3xl w-full max-w-2xl shadow-2xl border border-gray-200 flex flex-col h-full">
            <!-- Bouton fermeture -->
            <button @click="$emit('close')"
                class="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-lg">✖</button>

            <!-- Titre -->
            <h2 class="text-2xl font-bold text-[var(--espace-vert)] mb-6 text-center">📋 Mes Offres</h2>

            <!-- Liste des offres (scrollable) -->
            <div class="flex-1 overflow-y-auto pr-2 space-y-4 mb-4">
                <div v-if="offers.length > 0" class="space-y-4">
                    <div v-for="offer in offers" :key="offer.id"
                        class="p-4 rounded-lg flex flex-col md:flex-row md:justify-between md:items-center gap-3 bg-gray-50 shadow-sm hover:shadow-md transition">

                        <!-- Infos offre -->
                        <div class="flex flex-col">
                            <span class="text-[var(--espace-vert)] font-medium">
                                {{ offer.nombre_jetons }} jetons • {{ offer.total_prix }} FCFA
                            </span>
                            <span class="text-xs text-gray-500">PU : {{ offer.prix_unitaire }} FCFA</span>

                            <!-- Wallet associé -->
                          
                            <p class="text-gray-700 text-sm sm:text-base">
                                <strong>💳 </strong>
                                {{ offer.wallet?.phone_number }} ({{ offer.wallet?.payment_service }})
                            </p>

                        </div>

                        <!-- Boutons -->
                        <div class="flex items-center gap-2">
                            <button @click="editOffer(offer)"
                                class="flex items-center gap-1 text-blue-500 bg-blue-100 px-2 py-1 rounded hover:bg-blue-200 transition">
                                <i class="fas fa-edit"></i> Modifier
                            </button>
                            <button @click="deleteOffer(offer.id)"
                                class="flex items-center gap-1 text-red-500 bg-red-100 px-2 py-1 rounded hover:bg-red-200 transition">
                                <i class="fas fa-trash"></i> Supprimer
                            </button>
                        </div>
                    </div>

                </div>
                <p v-else class="text-center text-gray-500">Aucune offre créée.</p>
            </div>

            <!-- Formulaire (fixe en bas) -->
            <div v-if="isEditing" class="border-t pt-4 mt-2 bg-gray-50 rounded-lg">
                <form @submit.prevent="saveOffer" class="space-y-4"
                    :class="{ 'bg-green-50 p-4 rounded-lg': !currentOffer.id, 'bg-yellow-50 p-4 rounded-lg': currentOffer.id }">

                    <h3 class="text-lg font-semibold text-[var(--espace-vert)] text-center">
                        {{ currentOffer.id ? 'Modifier l\'offre' : 'Créer une nouvelle offre' }}
                    </h3>

                    <!-- Quantité -->
                    <div>
                        <label class="block text-sm font-semibold text-[var(--espace-vert)]">Quantité</label>
                        <input v-model.number="currentOffer.nombre_jetons" type="number" min="1" required
                            class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[var(--espace-vert)] focus:outline-none">
                    </div>

                    <!-- Prix unitaire -->
                    <div>
                        <label class="block text-sm font-semibold text-[var(--espace-vert)]">Prix unitaire
                            (FCFA)</label>
                        <input v-model.number="currentOffer.prix_unitaire" type="number" min="1" required
                            class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[var(--espace-vert)] focus:outline-none">
                    </div>

                    <!-- Portefeuille -->
                    <div>
                        <label class="block text-sm font-semibold text-[var(--espace-vert)]">Portefeuille</label>
                        <select v-model="currentOffer.wallet_id" required
                            class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[var(--espace-vert)] focus:outline-none">
                            <option value="" disabled>Sélectionnez un portefeuille</option>
                            <option v-for="wallet in wallets" :key="wallet.id" :value="wallet.id">
                                {{ wallet.phone_number }} ({{ wallet.payment_service }})
                            </option>
                        </select>
                    </div>

                    <!-- Boutons -->
                    <button type="submit" :disabled="loading"
                        class="w-full bg-gradient-to-r from-[var(--espace-or)] to-yellow-400 text-[var(--espace-vert)] py-3 rounded-xl font-bold shadow hover:from-[var(--espace-vert)] hover:to-green-700 hover:text-white transition">
                        <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
                        {{ currentOffer.id ? 'Mettre à jour' : 'Créer' }}
                    </button>
                    <button @click="cancelEdit" type="button"
                        class="w-full mt-2 text-gray-500 hover:underline">Annuler</button>
                </form>
            </div>

            <!-- Bouton ajouter (fixe en bas aussi si pas d’édition) -->
            <div v-else class="border-t pt-4 mt-2">
                <button @click="addOffer" type="button"
                    class="w-full bg-gradient-to-r from-[var(--espace-or)] to-yellow-400 text-[var(--espace-vert)] py-3 rounded-xl font-bold shadow hover:from-[var(--espace-vert)] hover:to-green-700 hover:text-white transition">
                    <i class="fas fa-plus"></i> Nouvelle offre
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue';
import apiClient from '../api/index';
import { useToast } from 'vue-toastification';

const props = defineProps<{
    show: boolean;
    offers: any[];
    wallets: any[];
}>();

const emit = defineEmits(['close', 'refresh-offers']);
const toast = useToast();
const loading = ref(false);

// 🔥 Liste dynamique des offres
const offers = ref<any[]>([...props.offers]);

// Synchroniser quand le parent change les offres
watch(() => props.offers, (newVal) => {
    offers.value = [...newVal];
}, { deep: true });

// état édition
const isEditing = ref(false);
const currentOffer = ref<{
    id: number | null;
    nombre_jetons: number;
    prix_unitaire: number;
    description: string;
    wallet_id: string | number
}>({
    id: null,
    nombre_jetons: 0,
    prix_unitaire: 0,
    description: '',
    wallet_id: ''
});

// Ajouter une nouvelle offre
const addOffer = () => {
    isEditing.value = true;
    currentOffer.value = { id: null, nombre_jetons: 0, prix_unitaire: 0, description: '', wallet_id: '' };
};

// Modifier une offre existante
const editOffer = (offer: any) => {
    isEditing.value = true;
    currentOffer.value = {
        id: offer.id,
        nombre_jetons: offer.nombre_jetons,
        prix_unitaire: offer.prix_unitaire,
        description: offer.description || '',
        wallet_id: offer.wallet_id
    };
};

// Annuler
const cancelEdit = () => {
    isEditing.value = false;
    currentOffer.value = { id: null, nombre_jetons: 0, prix_unitaire: 0, description: '', wallet_id: '' };
};

// Sauvegarder
const saveOffer = async () => {
    loading.value = true;
    try {
        if (currentOffer.value.id) {
            const res = await apiClient.put(`/jeton_market/updateOffer/${currentOffer.value.id}`, currentOffer.value);
            toast.success('Offre mise à jour avec succès !');

            // ⚡ maj locale
            const idx = offers.value.findIndex(o => o.id === currentOffer.value.id);
            if (idx !== -1) offers.value[idx] = { ...offers.value[idx], ...currentOffer.value };

        } else {
            const res = await apiClient.post('/jeton_market/offer', currentOffer.value);
            toast.success('Offre créée avec succès !');

            // ⚡ ajout direct
            offers.value.push(res.data);
        }

        emit('refresh-offers');
        cancelEdit();
    } catch (error: any) {
        toast.error(error.response?.data?.message || 'Erreur lors de la sauvegarde de l\'offre');
        console.error('Erreur:', error);
    } finally {
        loading.value = false;
    }
};

// Supprimer
const deleteOffer = async (offerId: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) {
        loading.value = true;
        try {
            await apiClient.delete(`/jeton_market/deleteOffer/${offerId}`);
            toast.success('Offre supprimée avec succès !');

            // ⚡ suppression locale
            offers.value = offers.value.filter(o => o.id !== offerId);

            emit('refresh-offers');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erreur lors de la suppression de l\'offre');
            console.error('Erreur:', error);
        } finally {
            loading.value = false;
        }
    }
};
</script>

<style scoped>
/* Responsive déjà géré via Tailwind */
</style>
