<!-- src/views/Boutique.vue -->
<template>
    <div class="container mx-auto p-4 sm:p-6">

        <h1 class="text-2xl sm:text-3xl font-bold text-[var(--espace-vert)] mb-4 flex items-center">
            <i class="fas fa-store mr-2"></i> {{ boutique.nom }}
        </h1>
        <div class="bg-[var(--espace-blanc)] shadow-md rounded-lg p-4 sm:p-6 mb-4">
            <img :src="boutique.logo || 'https://via.placeholder.com/150'" alt="Boutique"
                class="w-full sm:w-1/2 h-48 object-cover rounded mb-4" />
            <p class="text-[var(--espace-gris)] text-sm sm:text-base">
                <strong>Description :</strong> {{ boutique.description || 'Aucune description' }}
            </p>
            <p class="text-[var(--espace-gris)] text-sm sm:text-base">
                <strong>Ville :</strong> {{ boutique.ville }}
            </p>
            <p class="text-[var(--espace-gris)] text-sm sm:text-base">
                <strong>Statut :</strong> {{ boutique.actif ? 'Active' : 'Inactive' }}
            </p>
        </div>

        <div class="mb-4">
            <h2 class="text-lg sm:text-xl font-semibold text-[var(--espace-vert)] flex items-center">
                <i class="fas fa-box mr-2"></i> Produits
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <ProductCard v-for="produit in produits" :key="produit.id" :produit="produit" />
            </div>
        </div>

        <div v-if="isOwner" class="bg-[var(--espace-blanc)] shadow-md rounded-lg p-4 sm:p-6">
            <h2 class="text-lg sm:text-xl font-semibold text-[var(--espace-vert)] flex items-center">
                <i class="fas fa-plus-circle mr-2"></i> Ajouter un produit
            </h2>
            <form @submit.prevent="createProduit" class="space-y-4">
                <div>
                    <label class="block text-[var(--espace-gris)] text-sm sm:text-base">
                        <i class="fas fa-box mr-1"></i> Nom
                    </label>
                    <input v-model="produitForm.nom" type="text" class="w-full p-2 border rounded" required />
                </div>
                <div>
                    <label class="block text-[var(--espace-gris)] text-sm sm:text-base">
                        <i class="fas fa-align-left mr-1"></i> Description
                    </label>
                    <textarea v-model="produitForm.description" class="w-full p-2 border rounded"></textarea>
                </div>
                <div>
                    <label class="block text-[var(--espace-gris)] text-sm sm:text-base">
                        <i class="fas fa-money-bill mr-1"></i> Prix (FCFA)
                    </label>
                    <input v-model="produitForm.prix" type="number" class="w-full p-2 border rounded" required />
                </div>
                <div>
                    <label class="block text-[var(--espace-gris)] text-sm sm:text-base">
                        <i class="fas fa-cubes mr-1"></i> Quantité
                    </label>
                    <input v-model="produitForm.quantite" type="number" class="w-full p-2 border rounded" required />
                </div>
                <div>
                    <label class="block text-[var(--espace-gris)] text-sm sm:text-base">
                        <i class="fas fa-handshake mr-1"></i> Collaboratif
                    </label>
                    <input v-model="produitForm.collaboratif" type="checkbox" class="p-2" />
                </div>
                <div v-if="produitForm.collaboratif">
                    <label class="block text-[var(--espace-gris)] text-sm sm:text-base">
                        <i class="fas fa-coins mr-1"></i> Marge minimale (FCFA)
                    </label>
                    <input v-model="produitForm.marge_min" type="number" class="w-full p-2 border rounded" />
                </div>
                <button type="submit"
                    class="w-full bg-[var(--espace-or)] text-[var(--espace-vert)] p-2 rounded hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] flex items-center justify-center">
                    <i class="fas fa-plus-circle mr-2"></i> Ajouter Produit
                </button>
            </form>
        </div>

        <div v-if="isOwner" class="bg-[var(--espace-blanc)] shadow-md rounded-lg p-4 sm:p-6 mt-4">
            <h2 class="text-lg sm:text-xl font-semibold text-[var(--espace-vert)] flex items-center">
                <i class="fas fa-handshake mr-2"></i> Demandes de collaboration
            </h2>
            <div v-for="collaboration in collaborations" :key="collaboration.id"
                class="p-2 border-b flex flex-col sm:flex-row sm:items-center">
                <p class="text-[var(--espace-gris)] text-sm sm:text-base">
                    {{ collaboration.user.nom }} - Prix de revente: {{ collaboration.prix_revente }} FCFA - Statut: {{
                        collaboration.statut }}
                </p>
                <div v-if="collaboration.statut === 'en_attente'" class="mt-2 sm:mt-0 sm:ml-4 flex space-x-2">
                    <button @click="updateCollaboration(collaboration.id, 'validée')"
                        class="bg-[var(--espace-or)] text-[var(--espace-vert)] px-2 py-1 rounded hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] flex items-center">
                        <i class="fas fa-check mr-1"></i> Valider
                    </button>
                    <button @click="updateCollaboration(collaboration.id, 'refusée')"
                        class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 flex items-center">
                        <i class="fas fa-times mr-1"></i> Refuser
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '../stores/Auth'

import axios from 'axios'
import AppHeader from '../components/AppHeader.vue'
import ProductCard from '../components/ProductCard.vue'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const toast = useToast()
const boutique = ref({})
const produits = ref([])
const collaborations = ref([])
const produitForm = ref({
    nom: '',
    description: '',
    prix: 0,
    quantite: 0,
    collaboratif: false,
    marge_min: 0,
})
const isOwner = ref(false)

onMounted(async () => {
    try {
        const boutiqueResponse = await axios.get(`http://localhost:8000/api/v1/boutiques/${route.params.id}`)
        boutique.value = boutiqueResponse.data.boutique
        produits.value = boutique.value.produits
        collaborations.value = (await axios.get(`http://localhost:8000/api/v1/collaborations`)).data.filter(c => c.produit.boutique_id === boutique.value.id)
        isOwner.value = authStore.user?.commercant?.id === boutique.value.commercant_id
    } catch (error) {
        toast.error('Erreur lors du chargement de la boutique')
    }
})

const createProduit = async () => {
    try {
        await apiClient.post('/produits', {
            ...produitForm.value,
            boutique_id: boutique.value.id,
        })
        toast.success('Produit ajouté !')
        produits.value.push({ ...produitForm.value, id: Date.now() })
        produitForm.value = { nom: '', description: '', prix: 0, quantite: 0, collaboratif: false, marge_min: 0 }
    } catch (error) {
        toast.error(error.response?.data.message || 'Erreur lors de l\'ajout du produit')
    }
}

const updateCollaboration = async (id, statut) => {
    try {
        await axios.patch(`http://localhost:8000/api/v1/collaborations/${id}`, { statut })
        toast.success(`Collaboration ${statut} !`)
        collaborations.value = collaborations.value.map(c => c.id === id ? { ...c, statut } : c)
    } catch (error) {
        toast.error('Erreur lors de la mise à jour de la collaboration')
    }
}
</script>