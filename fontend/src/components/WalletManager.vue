<template>
    <div v-if="show"
        class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm p-4">

        <div
            class="overflow-y-scroll h-full pb-16 bg-white p-6 md:p-8 rounded-3xl w-full max-w-2xl shadow-2xl relative border border-gray-200">
            <!-- Bouton fermeture -->
            <button @click="$emit('close')"
                class="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-lg">✖</button>

            <!-- Titre -->
            <h2 class="text-2xl font-bold text-[var(--espace-vert)] mb-6 text-center">💳 Gérer Mes Portefeuilles</h2>

            <!-- Formulaire de création/édition (toujours au-dessus) -->
            <div v-if="isEditing" class="mb-8">
                <form @submit.prevent="saveWallet" class="space-y-5"
                    :class="{ 'bg-green-50 p-4 rounded-lg': !currentWallet.id, 'bg-yellow-50 p-4 rounded-lg': currentWallet.id }">

                    <h3 class="text-lg font-semibold text-[var(--espace-vert)] text-center">
                        {{ currentWallet.id ? 'Modifier le Portefeuille' : 'Créer un Nouveau Portefeuille' }}
                    </h3>

                    <!-- Numéro de téléphone -->
                    <div>
                        <label class="block text-sm font-semibold text-[var(--espace-vert)]">Numéro de téléphone</label>
                        <input v-model="currentWallet.phone_number" type="tel" placeholder="Ex: 670123456" required
                            class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[var(--espace-vert)] focus:outline-none"
                            pattern="6[0-9]{8}">
                    </div>

                    <!-- Service -->
                    <div>
                        <label class="block text-sm font-semibold text-[var(--espace-vert)]">Service de paiement</label>
                        <select v-model="currentWallet.payment_service" required
                            class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[var(--espace-vert)] focus:outline-none">
                            <option value="" disabled>Sélectionnez un service</option>
                            <option value="ORANGE">Orange Money</option>
                            <option value="MTN">MTN Mobile Money</option>
                        </select>
                    </div>

                    <!-- Boutons -->
                    <button type="submit" :disabled="loading"
                        class="w-full bg-gradient-to-r from-[var(--espace-or)] to-yellow-400 text-[var(--espace-vert)] py-3 rounded-xl font-bold shadow hover:from-[var(--espace-vert)] hover:to-green-700 hover:text-white transition">
                        <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
                        {{ currentWallet.id ? 'Mettre à jour' : 'Créer' }}
                    </button>
                    <button @click="cancelEdit" type="button"
                        class="w-full mt-2 text-gray-500 hover:underline">Annuler</button>
                </form>
            </div>

            <!-- Liste des portefeuilles -->
            <div v-if="wallets && wallets.length > 0" class="space-y-4 mb-6">
                <div v-for="wallet in wallets" :key="wallet.id || wallet.phone_number"
                    class="p-4 rounded-lg flex flex-col md:flex-row md:justify-between md:items-center gap-3" :class="{
                        'bg-orange-50': wallet.payment_service === 'ORANGE',
                        'bg-purple-50': wallet.payment_service === 'MTN'
                    }">
                    <div class="flex items-center gap-3">
                        <span class="text-[var(--espace-vert)] font-medium">
                            {{ wallet.phone_number }} ({{ wallet.payment_service }})
                        </span>
                        <span v-if="wallet.is_active !== false"
                            class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Actif</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <button @click="editWallet(wallet)"
                            class="flex items-center gap-1 text-blue-500 bg-blue-100 px-2 py-1 rounded hover:bg-blue-200 transition">
                            <i class="fas fa-edit"></i> Modifier
                        </button>
                        <button @click="deleteWallet(wallet.id)"
                            class="flex items-center gap-1 text-red-500 bg-red-100 px-2 py-1 rounded hover:bg-red-200 transition">
                            <i class="fas fa-trash"></i> Supprimer
                        </button>
                    </div>
                </div>
            </div>
            <p v-else class="text-center text-gray-500">Aucun portefeuille créé.</p>

            <!-- Bouton ajouter -->
            <button v-if="!isEditing" @click="addWallet" type="button"
                class="w-full bg-gradient-to-r from-[var(--espace-or)] to-yellow-400 text-[var(--espace-vert)] py-3 rounded-xl font-bold shadow hover:from-[var(--espace-vert)] hover:to-green-700 hover:text-white transition mt-4">
                <i class="fas fa-plus"></i> Ajouter un portefeuille
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';
import apiClient from '../api/index';
import { useToast } from 'vue-toastification';

const props = defineProps<{
    show: boolean;
    wallets: any[];
}>();

const emit = defineEmits(['close', 'refresh-wallets']);

const toast = useToast();
const loading = ref(false);

// état édition
const isEditing = ref(false);
const currentWallet = ref<{ id: number | null; phone_number: string; payment_service: string }>({
    id: null,
    phone_number: '',
    payment_service: ''
});

// Ajouter un nouveau portefeuille
const addWallet = () => {
    isEditing.value = true;
    currentWallet.value = { id: null, phone_number: '', payment_service: '' };
};

// Modifier un portefeuille existant
const editWallet = (wallet: any) => {
    isEditing.value = true;
    currentWallet.value = { id: wallet.id, phone_number: wallet.phone_number, payment_service: wallet.payment_service };
};

// Annuler l’édition
const cancelEdit = () => {
    isEditing.value = false;
    currentWallet.value = { id: null, phone_number: '', payment_service: '' };
};

// Sauvegarder (création ou édition)
const saveWallet = async () => {
    const phonePattern = /^6[0-9]{8}$/;
    if (!phonePattern.test(currentWallet.value.phone_number)) {
        toast.error('Le numéro de téléphone doit commencer par 6 et contenir 9 chiffres.');
        return;
    }

    loading.value = true;
    try {
        if (currentWallet.value.id) {
            await apiClient.put(`/wallets/${currentWallet.value.id}`, currentWallet.value);
            toast.success('Portefeuille mis à jour avec succès !');
        } else {
            await apiClient.post('/wallets', currentWallet.value);
            toast.success('Portefeuille créé avec succès !');
        }
        emit('refresh-wallets');
        cancelEdit();
    } catch (error: any) {
        toast.error(error.response?.data?.message || 'Erreur lors de la sauvegarde du portefeuille');
        console.error('Erreur:', error);
    } finally {
        loading.value = false;
    }
};

// Supprimer un portefeuille
const deleteWallet = async (walletId: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce portefeuille ?')) {
        loading.value = true;
        try {
            await apiClient.delete(`/wallets/${walletId}`);
            toast.success('Portefeuille supprimé avec succès !');
            emit('refresh-wallets');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erreur lors de la suppression du portefeuille');
            console.error('Erreur:', error);
        } finally {
            loading.value = false;
        }
    }
};
</script>

<style scoped>
/* Optimisation responsive déjà gérée par flex + grid Tailwind */
</style>
