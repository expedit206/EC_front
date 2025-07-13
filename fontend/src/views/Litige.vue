<!-- src/views/Litige.vue -->
<template>
    <div class="container mx-auto p-4 sm:p-6">
        <AppHeader />
        <h1 class="text-2xl sm:text-3xl font-bold text-[var(--espace-vert)] mb-4 flex items-center">
            <i class="fas fa-exclamation-triangle mr-2"></i> Mes Litiges
        </h1>
        <div v-if="route.query.commande_id" class="bg-[var(--espace-blanc)] shadow-md rounded-lg p-4 sm:p-6 mb-4">
            <h2 class="text-lg sm:text-xl font-semibold text-[var(--espace-vert)] flex items-center">
                <i class="fas fa-plus-circle mr-2"></i> Signaler un litige
            </h2>
            <form @submit.prevent="createLitige" class="space-y-4">
                <div>
                    <label class="block text-[var(--espace-gris)] text-sm sm:text-base">
                        <i class="fas fa-align-left mr-1"></i> Description du problème
                    </label>
                    <textarea v-model="litigeForm.description" class="w-full p-2 border rounded" required></textarea>
                </div>
                <div>
                    <label class="block text-[var(--espace-gris)] text-sm sm:text-base">
                        <i class="fas fa-file-upload mr-1"></i> Preuves (URLs des photos/vidéos)
                    </label>
                    <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <input v-model="preuve" type="text" class="w-full p-2 border rounded"
                            placeholder="Entrez l'URL d'une preuve" />
                        <button type="button" @click="addPreuve"
                            class="bg-[var(--espace-or)] text-[var(--espace-vert)] px-4 py-2 rounded hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] flex items-center">
                            <i class="fas fa-plus mr-2"></i> Ajouter
                        </button>
                    </div>
                    <ul class="mt-2 text-[var(--espace-gris)] text-sm sm:text-base">
                        <li v-for="(p, index) in litigeForm.preuves" :key="index">{{ p }}</li>
                    </ul>
                </div>
                <button type="submit"
                    class="w-full bg-[var(--espace-or)] text-[var(--espace-vert)] p-2 rounded hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] flex items-center justify-center">
                    <i class="fas fa-exclamation-triangle mr-2"></i> Signaler Litige
                </button>
            </form>
        </div>
        <div class="space-y-4">
            <div v-for="litige in litiges" :key="litige.id"
                class="bg-[var(--espace-blanc)] shadow-md rounded-lg p-4 sm:p-6">
                <p class="text-[var(--espace-gris)] text-sm sm:text-base">
                    <strong>Commande :</strong> {{ litige.commande.produit.nom }}
                </p>
                <p class="text-[var(--espace-gris)] text-sm sm:text-base">
                    <strong>Description :</strong> {{ litige.description }}
                </p>
                <p class="text-[var(--espace-gris)] text-sm sm:text-base">
                    <strong>Statut :</strong> {{ litige.statut }}
                </p>
                <p class="text-[var(--espace-gris)] text-sm sm:text-base">
                    <strong>Preuves :</strong> {{ litige.preuves?.join(', ') || 'Aucune' }}
                </p>
                <div v-if="isCommercant && litige.statut === 'ouvert'"
                    class="mt-2 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <button @click="updateLitige(litige.id, 'résolu')"
                        class="bg-[var(--espace-or)] text-[var(--espace-vert)] px-4 py-2 rounded hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] flex items-center">
                        <i class="fas fa-check mr-2"></i> Résoudre
                    </button>
                    <button @click="updateLitige(litige.id, 'rejeté')"
                        class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center">
                        <i class="fas fa-times mr-2"></i> Rejeter
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

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const toast = useToast()
const litiges = ref([])
const litigeForm = ref({ commande_id: route.query.commande_id || '', description: '', preuves: [] })
const preuve = ref('')
const isCommercant = ref(false)

onMounted(async () => {
    try {
        await authStore.fetchUser()
        isCommercant.value = !!authStore.user.commercant
        const response = await axios.get('http://localhost:8000/api/v1/litiges')
        litiges.value = response.data.litiges.filter(l =>
            l.user_id === authStore.user.id || (authStore.user.commercant && l.commande.commercant_id === authStore.user.commercant.id)
        )
    } catch (error) {
        toast.error('Erreur lors du chargement des litiges')
    }
})

const addPreuve = () => {
    if (preuve.value) {
        litigeForm.value.preuves.push(preuve.value)
        preuve.value = ''
    }
}

const createLitige = async () => {
    try {
        await axios.post('http://localhost:8000/api/v1/litiges', litigeForm.value)
        toast.success('Litige signalé !')
        router.push({ name: 'litiges' })
    } catch (error) {
        toast.error(error.response?.data.message || 'Erreur lors du signalement du litige')
    }
}

const updateLitige = async (id, statut) => {
    try {
        await axios.patch(`http://localhost:8000/api/v1/litiges/${id}`, { statut })
        toast.success(`Litige ${statut} !`)
        litiges.value = litiges.value.map(l => l.id === id ? { ...l, statut } : l)
    } catch (error) {
        toast.error('Erreur lors de la mise à jour du litige')
    }
}
</script>