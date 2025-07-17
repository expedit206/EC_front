<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStateStore } from '../stores/userState';
import { useToast } from 'vue-toastification';
import apiClient from '../api';
import Loader from '../components/Loader.vue'; // Importer le composant Loader

const userStateStore = useUserStateStore();
const router = useRouter();
const toast = useToast();
const cartItems = ref<any[]>([]);
const isLoading = ref(true); // Ajouter isLoading

const fetchCart = async () => {
    try {
        isLoading.value = true;
        const response = await apiClient.get('/panier');
        cartItems.value = response.data.items;
        userStateStore.saveCartToLocalStorage(
            cartItems.value.map((item: any) => ({
                produit_id: item.produit_id,
                quantite: item.quantite,
                nom: item.produit.nom,
                prix: item.produit.prix,
            }))
        );
    } catch (error) {
        toast.error('Erreur lors du chargement du panier');
    } finally {
        isLoading.value = false;
    }
};

const placeOrder = async () => {
    if (cartItems.value.length === 0) {
        toast.error('Votre panier est vide');
        return;
    }
    const success = await userStateStore.placeOrder();
    if (success) {
        router.push({ path: '/commandes' });
    }
};

const removeFromCart = async (produitId: string) => {
    try {
        await apiClient.delete(`/panier/${produitId}`);
        await fetchCart();
        toast.success('Produit retiré du panier');
    } catch (error) {
        toast.error('Erreur lors de la suppression');
    }
};

onMounted(fetchCart);
</script>

<template>
    <Loader :isLoading="isLoading" />
    <div class="container mx-auto px-4 py-6 min-h-screen bg-gray-100 pt-16 pb-20">
        <h1 class="text-2xl font-bold text-[var(--espace-vert)] mb-4 font-poppins">Votre Panier</h1>
        <div v-if="isLoading" class="text-center text-[var(--espace-gris)]">
            <!-- Le loader remplace ce contenu -->
        </div>
        <div v-else-if="cartItems.length === 0" class="text-center text-[var(--espace-gris)]">
            Votre panier est vide.
        </div>
        <div v-else class="space-y-4">
            <div v-for="item in cartItems" :key="item.produit_id"
                class="flex items-center justify-between border-b py-2">
                <div class="flex items-center gap-4">
                    <img :src="item.produit.photo_url || 'https://via.placeholder.com/50'"
                        :alt="`Image de ${item.produit.nom}`" class="w-12 h-12 object-cover rounded" />
                    <div>
                        <p class="text-[var(--espace-vert)] font-semibold font-poppins">{{ item.produit.nom }}</p>
                        <p class="text-[var(--espace-gris)] text-sm">Quantité: {{ item.quantite }}</p>
                        <p class="text-[var(--espace-or)] font-bold">{{ item.produit.prix * item.quantite }} FCFA</p>
                    </div>
                </div>
                <button @click="removeFromCart(item.produit_id)" class="text-red-500 hover:text-red-600"
                    aria-label="Supprimer du panier">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="flex justify-between items-center mt-4">
                <p class="text-[var(--espace-vert)] font-bold">
                    Total: {{cartItems.reduce((sum, item) => sum + item.produit.prix * item.quantite, 0)}} FCFA
                </p>
                <button @click="placeOrder"
                    class="bg-[var(--espace-or)] text-[var(--espace-vert)] font-semibold px-4 py-2 rounded-lg hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] transition-transform hover:scale-105"
                    aria-label="Passer la commande">
                    Passer la commande
                </button>
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
}

.font-poppins {
    font-family: 'Poppins', sans-serif;
}
</style>