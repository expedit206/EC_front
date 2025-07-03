<!-- src/views/Profil.vue -->
<template>
    <div class="container mx-auto p-4 sm:p-6">
        <AppHeader />
        <h1 class="text-2xl sm:text-3xl font-bold text-[var(--espace-vert)] mb-4 flex items-center">
            <i class="fas fa-user mr-2"></i> Mon Profil
        </h1>
        <div class="bg-[var(--espace-blanc)] shadow-md rounded-lg p-4 sm:p-6 mb-4">
            <h2 class="text-lg sm:text-xl font-semibold text-[var(--espace-vert)] flex items-center">
                <i class="fas fa-info-circle mr-2"></i> Informations personnelles
            </h2>
            <p class="text-[var(--espace-gris)]"><strong>Nom :</strong> {{ user.nom }}</p>
            <p class="text-[var(--espace-gris)]"><strong>Téléphone :</strong> {{ user.telephone }}</p>
            <p class="text-[var(--espace-gris)]"><strong>Email :</strong> {{ user.email || 'Non défini' }}</p>
            <p class="text-[var(--espace-gris)]"><strong>Ville :</strong> {{ user.ville }}</p>
            <p class="text-[var(--espace-gris)]"><strong>Statut Premium :</strong> {{ user.premium ? 'Actif' : 'Inactif'
                }}</p>
        </div>

        <div class="bg-[var(--espace-blanc)] shadow-md rounded-lg p-4 sm:p-6 mb-4">
            <h2 class="text-lg sm:text-xl font-semibold text-[var(--espace-vert)] flex items-center">
                <i class="fas fa-store-alt mr-2"></i> Compte Commerçant
            </h2>
            <div v-if="user.commercant">
                <p class="text-[var(--espace-gris)]"><strong>Nom :</strong> {{ user.commercant.nom }}</p>
                <p class="text-[var(--espace-gris)]"><strong>Ville :</strong> {{ user.commercant.ville }}</p>
                <p class="text-[var(--espace-gris)]"><strong>Actif :</strong> {{ user.commercant.actif ? 'Oui' : 'Non'
                    }}</p>
            </div>
            <div v-else>
                <p class="text-[var(--espace-gris)]">Aucun compte commerçant. Créez-en un !</p>
                <form @submit.prevent="createCommercant" class="space-y-4 mt-4">
                    <div>
                        <label class="block text-[var(--espace-gris)] text-sm sm:text-base">
                            <i class="fas fa-store mr-1"></i> Nom du commerçant
                        </label>
                        <input v-model="commercantForm.nom" type="text" class="w-full p-2 border rounded" required />
                    </div>
                    <div>
                        <label class="block text-[var(--espace-gris)] text-sm sm:text-base">
                            <i class="fas fa-city mr-1"></i> Ville
                        </label>
                        <input v-model="commercantForm.ville" type="text" class="w-full p-2 border rounded" required />
                    </div>
                    <div>
                        <label class="block text-[var(--espace-gris)] text-sm sm:text-base">
                            <i class="fas fa-align-left mr-1"></i> Description (optionnel)
                        </label>
                        <textarea v-model="commercantForm.description" class="w-full p-2 border rounded"></textarea>
                    </div>
                    <button type="submit"
                        class="w-full bg-[var(--espace-or)] text-[var(--espace-vert)] p-2 rounded hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] flex items-center justify-center">
                        <i class="fas fa-store-alt mr-2"></i> Créer Compte Commerçant
                    </button>
                </form>
            </div>
        </div>

        <div class="bg-[var(--espace-blanc)] shadow-md rounded-lg p-4 sm:p-6">
            <h2 class="text-lg sm:text-xl font-semibold text-[var(--espace-vert)] flex items-center">
                <i class="fas fa-shop mr-2"></i> Mes Boutiques
            </h2>
            <div v-if="user.commercant && boutiques.length"
                class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <BoutiqueCard v-for="boutique in boutiques" :key="boutique.id" :boutique="boutique" />
            </div>
            <p v-else class="text-[var(--espace-gris)]">Aucune boutique. Créez-en une !</p>
            <form v-if="user.commercant" @submit.prevent="createBoutique" class="space-y-4 mt-4">
                <div>
                    <label class="block text-[var(--espace-gris)] text-sm sm:text-base">
                        <i class="fas fa-shop mr-1"></i> Nom de la boutique
                    </label>
                    <input v-model="boutiqueForm.nom" type="text" class="w-full p-2 border rounded" required />
                </div>
                <div>
                    <label class="block text-[var(--espace-gris)] text-sm sm:text-base">
                        <i class="fas fa-city mr-1"></i> Ville
                    </label>
                    <input v-model="boutiqueForm.ville" type="text" class="w-full p-2 border rounded" required />
                </div>
                <div>
                    <label class="block text-[var(--espace-gris)] text-sm sm:text-base">
                        <i class="fas fa-align-left mr-1"></i> Description (optionnel)
                    </label>
                    <textarea v-model="boutiqueForm.description" class="w-full p-2 border rounded"></textarea>
                </div>
                <button type="submit"
                    class="w-full bg-[var(--espace-or)] text-[var(--espace-vert)] p-2 rounded hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] flex items-center justify-center">
                    <i class="fas fa-shop mr-2"></i> Créer Boutique
                </button>
            </form>
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
import BoutiqueCard from '../components/BoutiqueCard.vue'

const authStore = useAuthStore()
const router = useRouter()
const toast = useToast()
const user = ref(authStore.user)
const boutiques = ref([])
const commercantForm = ref({ nom: '', ville: '', description: '' })
const boutiqueForm = ref({ nom: '', ville: '', description: '' })

onMounted(async () => {
    try {
        await authStore.fetchUser()
        user.value = authStore.user
        if (user.value.commercant) {
            const response = await axios.get('http://localhost:8000/api/v1/boutiques')
            boutiques.value = response.data.boutiques.filter(b => b.commercant_id === user.value.commercant.id)
        }
    } catch (error) {
        toast.error('Erreur lors du chargement du profil')
        authStore.logout()
        router.push({ name: 'login' })
    }
})

const createCommercant = async () => {
    try {
        const response = await axios.post('http://localhost:8000/api/v1/commercants', commercantForm.value)
        user.value.commercant = response.data.commercant
        toast.success('Compte commerçant créé !')
    } catch (error) {
        toast.error(error.response?.data.message || 'Erreur lors de la création')
    }
}

const createBoutique = async () => {
    try {
        const response = await axios.post('http://localhost:8000/api/v1/boutiques', boutiqueForm.value)
        boutiques.value.push(response.data.boutique)
        toast.success('Boutique créée !')
        boutiqueForm.value = { nom: '', ville: '', description: '' }
    } catch (error) {
        toast.error(error.response?.data.message || 'Erreur lors de la création')
    }
}
</script>