<template>
    <div class="mx-auto max-w-4xl py-5 px-4 flex flex-col gap-3">
        <h1 class="text-3xl font-bold text-[var(--espace-vert)]">Historique des Transactions de Jetons</h1>

        <!-- Liste des transactions -->
        <div v-if="transactions.length > 0" class="overflow-y-scroll space-y-4">
            <div v-for="transaction in transactions" :key="transaction.id"
                class="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
                <div class="flex justify-between items-center">
                    <div>
                        <p class="text-lg font-semibold">Achat de {{ transaction.nombre_jetons }} jetons</p>
                        <p class="text-gray-600">Montant: {{ transaction.montant }} FCFA</p>
                        <p class="text-gray-600">Méthode: {{ transaction.methode_paiement }}</p>
                        <p class="text-gray-600">Numéro: {{ transaction.phone_number }}</p> <!-- Nouveau champ -->
                        <p class="text-gray-600">Statut: {{ transaction.statut }}</p>
                        <p class="text-gray-600">Date: {{ formatDate(transaction.date_transaction) }}</p>
                        <p v-if="transaction.transaction_id_mesomb" class="text-gray-600">
                            ID Transaction: {{ transaction.transaction_id_mesomb }}
                        </p>
                    </div>
                    <div class="text-right">
                        <button @click="redoTransaction(transaction)"
                            class="text-[var(--espace-vert)] hover:text-[var(--espace-or)] mr-2">
                            <i class="fas fa-redo"></i> Refaire
                        </button>
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
            <router-link to="/commercant/produits"
                class="bg-[var(--espace-vert)] text-white px-4 py-2 rounded-md font-semibold hover:bg-[var(--espace-or)] hover:text-[var(--espace-vert)]">
                Booster un Produit
            </router-link>
        </div>

        <!-- Modal de chargement -->
        <div v-if="isLoading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white p-6 rounded-lg shadow-lg text-center">
                <p class="text-lg text-[var(--espace-vert)]">Veuillez patienter...</p>
                <svg class="animate-spin h-8 w-8 text-[var(--espace-vert)] mx-auto mt-2"
                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import apiClient from "../api/index";
import { useAuthStore } from "../stores/Auth";
import { useToast } from "vue-toastification";
import { Transaction } from "../components/types/index"; // Import de l'interface Parrainage

const authStore = useAuthStore();
const user = authStore.user;
const transactions = ref<Transaction[]>([]);
const isLoading = ref(false); // Nouvel état pour le modal de chargement
const toast = useToast();

const fetchTransactions = async () => {
    try {
        const response = await apiClient.get(`/jeton-transactions/${user?.id}`);
        console.log(response.data);
        transactions.value = response.data;
    } catch (error) {
        console.error("Erreur lors du chargement des transactions:", error);
    }
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const redoTransaction = async (transaction: Transaction) => {
    console.log("Refaire la transaction:", transaction);
    if (!confirm(`Refaire l'achat de ${transaction.nombre_jetons} jetons avec le même service (${transaction.methode_paiement}) ?`)) {
        return;
    }

    isLoading.value = true; // Afficher le modal de chargement

    try {
        const res = await apiClient.post("/acheter-jetons", {
            nombre_jetons: transaction.nombre_jetons,
            payment_service: transaction.methode_paiement,
            phone_number: transaction.phone_number, // Utiliser le numéro existant
        });

        // console.log(res.data);
        
        toast.success(res.data.message);
        fetchTransactions(); // Rafraîchir la liste après achat
    } catch (e: any) {
        toast.error(e.response?.data?.message || "Erreur lors de l'achat.");
        console.error(e);
    } finally {
        isLoading.value = false; // Cacher le modal de chargement
    }
};

onMounted(() => {
    if (user) {
        fetchTransactions();
    }
});
</script>

<style scoped>
/* Styles hérités ou personnalisés si nécessaire */
</style>