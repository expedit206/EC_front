<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/Auth';
import { useToast } from 'vue-toastification';
import apiClient from '../api';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();
let produit = ref(null);
const isLoading = ref(true);

const fetchProduit = async () => {
    try {
        
        isLoading.value = true;
        const response = await apiClient.get(`/produits/${route.params.id}`);
        produit.value = response.data.produit;
        // console.log('Produit:', response.data);
    } catch (error) {
        toast.error('Erreur lors du chargement du produit');
        router.push({ name: 'dashboard' });
    } finally {
        isLoading.value = false;
    }
};
onMounted(fetchProduit);



// console.log(produit);
const addToCart = async () => {
    // fetchProduit()
    // console.log(produit.value.id);
// alert('hjkl')
    if (!authStore.user) {
        toast.error('Veuillez vous connecter pour ajouter au panier');
        router.push({ name: 'login' });
        return;
    }
    try {
        // alert(produit.value)
        
        const res = await apiClient.post('/panier', { produit_id: produit.value.id });
      console.log(res.data);
      
        toast.success('Produit ajouté au panier');
    } catch (error) {
        toast.error('Erreur lors de l’ajout au panier');
    }
};

const goToCommercant = () => {
    router.push({ path: `/commercant/${produit.value.commercant_id}` });
};

const editProduit = () => {
    router.push({ path: `/commercant/produits/${produit.value.id}/edit` });
};

</script>

<template>
    <div class="min-h-screen bg-gray-100 pt-16 pb-20 px-4 sm:px-6">
        <div class="container mx-auto max-w-4xl">
            <div v-if="isLoading" class="text-center text-[var(--espace-gris)]">
                <i class="fas fa-spinner fa-spin text-2xl"></i> Chargement...
            </div>
            <div v-else-if="produit" class="bg-[var(--espace-blanc)] rounded-lg shadow-md p-6">
                <div class="flex flex-col sm:flex-row gap-6">
                    <!-- Image du produit -->
                    <div class="w-full sm:w-1/2">
                        <img v-if="produit.photo_url" :src="produit.photo_url" :alt="produit.nom"
                            class="w-full h-64 sm:h-80 object-cover rounded-lg shadow-sm" />
                        <div v-else class="w-full h-64 sm:h-80 bg-gray-200 flex items-center justify-center rounded-lg">
                            <i class="fas fa-image text-4xl text-[var(--espace-gris)]"></i>
                        </div>
                    </div>
                    <!-- Détails du produit -->
                    <div class="w-full sm:w-1/2">
                        <h1 class="text-2xl sm:text-3xl font-bold text-[var(--espace-vert)] mb-4">
                            {{ produit.nom }}
                        </h1>
                        <p class="text-md text-[var(--espace-gris)] mb-4">{{ produit.description || 'Aucune description disponible' }}</p>
                        <p class="text-xl font-semibold text-[var(--espace-or)] mb-4">{{ produit.prix }} XAF</p>
                        <p class="text-sm text-[var(--espace-gris)] mb-2">Stock : {{ produit.stock }}</p>
                        <p class="text-sm text-[var(--espace-gris)] mb-4">
                            Vendu par :
                            <RouterLink :to="`/commercant/${produit.commercant_id}`"
                                class="text-[var(--espace-vert)] hover:text-[var(--espace-or)] hover:underline">
                                {{ produit.commercant.nom }}
                            </RouterLink>
                        </p>
                        <div class="flex flex-col sm:flex-row gap-4">
                            <button v-if="authStore.user?.commercant?.id !== produit.commercant_id" @click="addToCart"
                                class="bg-[var(--espace-or)] text-[var(--espace-vert)] font-semibold px-4 py-2 rounded-lg hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] transition">
                                <i class="fas fa-shopping-cart mr-2"></i> Ajouter au panier
                            </button>
                            <button v-if="authStore.user?.commercant?.id === produit.commercant_id" @click="editProduit"
                                class="bg-[var(--espace-vert)] text-[var(--espace-blanc)] font-semibold px-4 py-2 rounded-lg hover:bg-[var(--espace-or)] transition">
                                <i class="fas fa-edit mr-2"></i> Modifier le produit
                            </button>
                       
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="text-center text-[var(--espace-gris)]">
                Produit non trouvé.
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