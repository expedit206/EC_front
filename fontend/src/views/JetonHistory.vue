<template>
    <div class="container mx-auto max-w-4xl py-8 px-4">
        <h1 class="text-3xl font-bold text-[var(--espace-vert)] mb-6">Historique des Transactions de Jetons</h1>

        <!-- Liste des transactions -->
        <div v-if="transactions.length > 0" class="space-y-4">
            <div v-for="transaction in transactions" :key="transaction.id"
                class="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
                <div class="flex justify-between items-center">
                    <div>
                        <p class="text-lg font-semibold">
                            Achat de {{ transaction.nombre_jetons }} jetons
                        </p>
                        <p class="text-gray-600">Montant: {{ transaction.montant }} FCFA</p>
                        <p class="text-gray-600">Méthode: {{ transaction.methode_paiement }}</p>
                        <p class="text-gray-600">Statut: {{ transaction.statut }}</p>
                        <p class="text-gray-600">Date: {{ formatDate(transaction.date_transaction) }}</p>
                        <p v-if="transaction.transaction_id_mesomb" class="text-gray-600">
                            ID Transaction: {{ transaction.transaction_id_mesomb }}
                        </p>
                    </div>
                    <div class="text-right">
                        <router-link :to="{ name: 'recharge-jetons' }"
                            class="text-[var(--espace-vert)] hover:text-[var(--espace-or)] mr-2">
                            Recharger
                        </router-link>
                        <router-link :to="{ name: 'home' }"
                            class="text-[var(--espace-vert)] hover:text-[var(--espace-or)]">
                            Booster
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
        <p v-else class="text-gray-500">Aucune transaction trouvée.</p>

        <!-- Boutons d'actions -->
        <div class="mt-6 flex gap-4">
            <router-link to="/acheter-jetons"
                class="bg-[var(--espace-vert)] text-white px-4 py-2 rounded-md font-semibold hover:bg-[var(--espace-or)] hover:text-[var(--espace-vert)]">
                Acheter des Jetons
            </router-link>
            <router-link to="/home"
                class="bg-[var(--espace-vert)] text-white px-4 py-2 rounded-md font-semibold hover:bg-[var(--espace-or)] hover:text-[var(--espace-vert)]">
                Booster un Produit
            </router-link>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import apiClient from '../api';
import { useAuthStore } from '../stores/Auth';

const authStore = useAuthStore();
const user = authStore.user;
const transactions = ref<any[]>([]);

const fetchTransactions = async () => {
    try {
        const response = await apiClient.get(`/jeton-transactions/${user.id}`);
        transactions.value = response.data;
    } catch (error) {
        console.error('Erreur lors du chargement des transactions:', error);
    }
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

onMounted(() => {
    if (user) {
        fetchTransactions();
    }
});
</script>

<style scoped>
/* Styles hérités ou personnalisés si nécessaire */
</style>.