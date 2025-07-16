<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/Auth';
import { useUserStateStore } from '../stores/userState';
import { useToast } from 'vue-toastification';
import apiClient from '../api';
import { log } from 'console';

const authStore = useAuthStore();
const userStateStore = useUserStateStore();
const toast = useToast();
const orders = ref<any[]>([]);

const fetchOrders = async () => {
    if (!authStore.user) {
        toast.error('Veuillez vous connecter pour voir vos commandes');
        return;
    }
    try {
        const response = await apiClient.get('/commandes');
        console.log('ok');
        
        orders.value = response.data;
        userStateStore.saveOrdersToLocalStorage(
            response.data.filter((order: any) => order.status === 'pending').map((order: any) => ({
                id: order.id,
                items: order.items.map((item: any) => ({
                    produit_id: item.produit_id,
                    quantite: item.quantite,
                    nom: item.produit.nom,
                    prix: item.produit.prix,
                })),
                status: order.status,
                created_at: order.created_at,
                total: order.total,
            }))
        );
    } catch (error) {
        toast.error('Erreur lors du chargement des commandes');
    }
};

onMounted(fetchOrders);
</script>

<template>
    <div class="container mx-auto px-4 py-6 min-h-screen bg-gray-100 pt-16 pb-20">
        <h1 class="text-2xl font-bold text-[var(--espace-vert)] mb-4 font-poppins">Vos Commandes</h1>
        <div v-if="orders.length === 0" class="text-center text-[var(--espace-gris)]">
            Aucune commande trouvée.
        </div>
        <div v-else class="space-y-4">
            <div v-for="order in orders" :key="order.id" class="bg-[var(--espace-blanc)] rounded-lg shadow-md p-4">
                <div class="flex justify-between items-center mb-2">
                    <p class="text-[var(--espace-vert)] font-semibold font-poppins">
                        Commande #{{ order.id }} - {{ new Date(order.created_at).toLocaleDateString('fr-FR') }}
                    </p>
                    <span :class="{
                        'text-[var(--espace-or)]': order.status === 'pending',
                        'text-green-600': order.status === 'confirmed',
                        'text-blue-600': order.status === 'shipped',
                        'text-gray-600': order.status === 'delivered' || order.status === 'cancelled',
                    }">
                        {{ order.status === 'pending' ? 'En attente' : order.status === 'confirmed' ? 'Confirmée' :
                            order.status === 'shipped' ? 'Expédiée' : order.status === 'delivered' ? 'Livrée' : 'Annulée' }}
                    </span>
                </div>
                <div v-for="item in order.items" :key="item.produit_id" class="flex items-center gap-4 border-b py-2">
                    <img :src="item.produit.photo_url || 'https://via.placeholder.com/50'"
                        :alt="`Image de ${item.produit.nom}`" class="w-12 h-12 object-cover rounded" />
                    <div>
                        <p class="text-[var(--espace-vert)] font-semibold font-poppins">{{ item.produit.nom }}</p>
                        <p class="text-[var(--espace-gris)] text-sm">Quantité: {{ item.quantite }}</p>
                        <p class="text-[var(--espace-or)] font-bold">{{ item.produit.prix * item.quantite }} FCFA</p>
                    </div>
                </div>
                <p class="text-[var(--espace-vert)] font-bold mt-2">
                    Total: {{ order.total }} FCFA
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
}

.font-poppins {
    font-family: 'Poppins', sans-serif;
}
</style>