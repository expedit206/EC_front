<!-- src/views/Commande.vue -->
<template>
    <div class="container mx-auto p-4 sm:p-6">
        <AppHeader />
        <h1 class="text-2xl sm:text-3xl font-bold text-[var(--espace-vert)] mb-4 flex items-center">
            <i class="fas fa-shopping-cart mr-2"></i> Mes Commandes
        </h1>
        <div class="space-y-4">
            <div v-for="commande in commandes" :key="commande.id"
                class="bg-[var(--espace-blanc)] shadow-md rounded-lg p-4 sm:p-6">
                <p class="text-[var(--espace-gris)] text-sm sm:text-base">
                    <strong>Produit :</strong> {{ commande.produit.nom }}
                </p>
                <p class="text-[var(--espace-gris)] text-sm sm:text-base">
                    <strong>Montant :</strong> {{ commande.montant_total }} FCFA
                </p>
                <p class="text-[var(--espace-gris)] text-sm sm:text-base">
                    <strong>Statut :</strong> {{ commande.statut }}
                </p>
                <p class="text-[var(--espace-gris)] text-sm sm:text-base">
                    <strong>Paiement :</strong> {{ commande.paiement_statut }}
                </p>
                <div class="mt-2 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <button v-if="isCommercant && commande.statut === 'en_attente'"
                        @click="updateCommandeStatus(commande.id, 'livrée')"
                        class="bg-[var(--espace-or)] text-[var(--espace-vert)] px-4 py-2 rounded hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] flex items-center">
                        <i class="fas fa-truck mr-2"></i> Marquer comme livrée
                    </button>
                    <button v-if="isAcheteur && commande.statut === 'livrée'"
                        @click="router.push({ name: 'litiges', query: { commande_id: commande.id } })"
                        class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center">
                        <i class="fas fa-exclamation-triangle mr-2"></i> Signaler un litige
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '../store'
import axios from 'axios'
import AppHeader from '../components/AppHeader.vue'

const authStore = useAuthStore()
const router = useRouter()
const toast = useToast()
const commandes = ref([])
const isCommercant = ref(false)
const isAcheteur = ref(false)

onMounted(async () => {
    try {
        await authStore.fetchUser()
        const user = authStore.user
        isCommercant.value = !!user.commercant
        isAcheteur.value = true
        const response = await axios.get('http://localhost:8000/api/v1/commandes')
        commandes.value = response.data.commandes.filter(c =>
            c.acheteur_id === user.id || (user.commercant && c.commercant_id === user.commercant.id)
        )
    } catch (error) {
        toast.error('Erreur lors du chargement des commandes')
    }
})

const updateCommandeStatus = async (id, statut) => {
    try {
        await axios.patch(`http://localhost:8000/api/v1/commandes/${id}/status`, { statut })
        toast.success('Statut de la commande mis à jour')
        commandes.value = commandes.value.map(c => c.id === id ? { ...c, statut } : c)
    } catch (error) {
        toast.error('Erreur lors de la mise à jour de la commande')
    }
}
</script>