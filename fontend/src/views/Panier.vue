<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '../api';
import { useToast } from 'vue-toastification';

const toast = useToast();
const router = useRouter();
const panier = ref([]);

const fetchPanier = async () => {
    try {
        const response = await apiClient.get('/panier');
        panier.value = response.data.items;
    } catch (error) {
        toast.error('Erreur lors du chargement du panier');
    }
};

const updateQuantite = async (itemId: string, quantite: number) => {
    try {
        await apiClient.put(`/panier/${itemId}`, { quantite });
        const item = panier.value.find((i: any) => i.id === itemId);
        if (item) item.quantite = quantite;
        toast.success('Quantité mise à jour');
    } catch (error) {
        toast.error('Erreur lors de la mise à jour');
    }
};

const removeFromPanier = async (itemId: string) => {
    try {
        await apiClient.delete(`/panier/${itemId}`);
        panier.value = panier.value.filter((i: any) => i.id !== itemId);
        toast.success('Produit retiré du panier');
    } catch (error) {
        toast.error('Erreur lors de la suppression');
    }
};

const viewProduit = (produitId: string) => {
    router.push({ path: `/produits/${produitId}` });
};

onMounted(fetchPanier);
</script>

<template>
    <div class="min-h-screen bg-gray-100 pt-16 pb-20 px-4 sm:px-6">
        <div class="container mx-auto max-w-4xl">
            <h1 class="text-2xl sm:text-3xl font-bold text-[var(--espace-vert)] mb-6">
                <i class="fas fa-shopping-cart mr-2 text-[var(--espace-or)]"></i> Mon Panier
            </h1>
            <div v-if="panier.length" class="grid grid-cols-1 gap-4">
                <div v-for="item in panier" :key="item.id"
                    class="bg-[var(--espace-blanc)] rounded-lg shadow-md p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div class="flex items-center gap-4">
                        <img :src="item.produit.photo_url || 'https://via.placeholder.com/150'"
                            :alt="`Image de ${item.produit.nom}`" class="w-16 h-16 object-cover rounded" />
                        <div>
                            <h2 @click="viewProduit(item.produit_id)"
                                class="text-lg font-semibold text-[var(--espace-vert)] hover:text-[var(--espace-or)] hover:underline cursor-pointer">
                                {{ item.produit.nom }}
                            </h2>
                            <p class="text-sm text-[var(--espace-gris)]">{{ item.produit.prix }} FCFA</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-4">
                        <input type="number" v-model.number="item.quantite" min="1"
                            class="w-16 h-8 p-1 text-sm border border-gray-300 rounded focus:ring-[var(--espace-vert)]"
                            @change="updateQuantite(item.id, item.quantite)" aria-label="Quantité" />
                        <button @click="removeFromPanier(item.id)"
                            class="bg-red-500 text-white px-3 py-1.5 rounded hover:bg-red-600 transition"
                            aria-label="Supprimer du panier">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
            <p v-else class="text-center text-[var(--espace-gris)]">Votre panier est vide.</p>
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
</style>