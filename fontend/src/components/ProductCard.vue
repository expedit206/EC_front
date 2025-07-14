<template>
    <div
        class="border rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md transition bg-[var(--espace-blanc)] max-w-xs w-full">
        <img :src="produit.photo_url || 'https://via.placeholder.com/150'" :alt="`Image de ${produit.nom}`"
            class="w-full h-32 sm:h-36 object-cover rounded mb-2" />
        <h3 class="text-base sm:text-lg font-semibold text-[var(--espace-vert)] truncate font-poppins">
            {{ produit.nom }}
        </h3>
        <p class="text-[var(--espace-gris)] text-xs sm:text-sm truncate">
            {{ produit.description || 'Aucune description' }}
        </p>
        <p class="text-[var(--espace-or)] font-bold text-sm sm:text-base">{{ produit.prix }} FCFA</p>
        <button v-if="produit.collaboratif && user" @click="collaborer"
            class="mt-2 w-full bg-[var(--espace-or)] text-[var(--espace-vert)] font-semibold px-3 py-1.5 rounded hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] flex items-center justify-center transition sm:text-sm text-xs"
            aria-label="Collaborer sur ce produit">
            <i class="fas fa-handshake mr-1 sm:mr-2"></i>
            <span class="hidden sm:inline">Collaborer</span>
        </button>
    </div>
</template>

<script setup lang="ts">
import { useToast } from 'vue-toastification';
import { useAuthStore } from '../stores/Auth';
import axios from 'axios';

defineProps < {
    produit: {
        id: string;
        nom: string;
        description?: string;
        prix: number;
        photo_url?: string;
        collaboratif: boolean;
        marge_min?: number;
    };
} > ();

const toast = useToast();
const authStore = useAuthStore();
const user = authStore.user;

const collaborer = async () => {
    try {
        const response = await axios.post('http://localhost:8000/api/v1/collaborations', {
            produit_id: produit.id,
            prix_revente: produit.prix + (produit.marge_min || 500),
        });
        toast.success('Demande de collaboration envoyée !');
    } catch (error: any) {
        toast.error(error.response?.data.message || 'Erreur lors de la demande de collaboration');
    }
};
</script>

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