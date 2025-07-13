<!-- src/components/ProductCard.vue -->
<template>
    <div class="border rounded-lg p-4 shadow-md hover:shadow-lg transition bg-[var(--espace-blanc)]">
        <img :src="produit.photo_url || 'https://via.placeholder.com/150'" alt="Produit"
            class="w-full h-48 object-cover rounded mb-4" />
        <h3 class="text-lg font-semibold text-[var(--espace-vert)]">{{ produit.nom }}</h3>
        <p class="text-[var(--espace-gris)] text-sm">{{ produit.description || 'Aucune description' }}</p>
        <p class="text-[var(--espace-or)] font-bold">{{ produit.prix }} FCFA</p>
        <button v-if="produit.collaboratif && user" @click="collaborer"
            class="mt-2 w-full bg-[var(--espace-or)] text-[var(--espace-vert)] px-4 py-2 rounded hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] flex items-center justify-center">
            <i class="fas fa-handshake mr-2"></i> Collaborer
        </button>
    </div>
</template>

<script setup>
import { useToast } from 'vue-toastification'
import { useAuthStore } from '../stores/Auth'

import axios from 'axios'

defineProps({
    produit: Object,
})

const toast = useToast()
const authStore = useAuthStore()
const user = authStore.user

const collaborer = async () => {
    try {
        const response = await axios.post('http://localhost:8000/api/v1/collaborations', {
            produit_id: produit.id,
            prix_revente: produit.prix + (produit.marge_min || 500),
        })
        toast.success('Demande de collaboration envoyée !')
    } catch (error) {
        toast.error(error.response?.data.message || 'Erreur lors de la demande de collaboration')
    }
}
</script>