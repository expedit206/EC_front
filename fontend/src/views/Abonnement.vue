<!-- src/views/Abonnement.vue -->
<template>
    <div class="container mx-auto p-4 sm:p-6">

        <h1 class="text-2xl sm:text-3xl font-bold text-[var(--espace-vert)] mb-4 flex items-center">
            <i class="fas fa-star mr-2"></i> Abonnements Premium
        </h1>
        <div v-if="abonnement" class="bg-[var(--espace-blanc)] shadow-md rounded-lg p-4 sm:p-6 mb-4">
            <h2 class="text-lg sm:text-xl font-semibold text-[var(--espace-vert)] flex items-center">
                <i class="fas fa-crown mr-2"></i> Votre abonnement actuel
            </h2>
            <p class="text-[var(--espace-gris)] text-sm sm:text-base">
                <strong>Plan :</strong> {{ abonnement.plan }}
            </p>
            <p class="text-[var(--espace-gris)] text-sm sm:text-base">
                <strong>Début :</strong> {{ new Date(abonnement.debut).toLocaleDateString() }}
            </p>
            <p class="text-[var(--espace-gris)] text-sm sm:text-base">
                <strong>Fin :</strong> {{ new Date(abonnement.fin).toLocaleDateString() }}
            </p>
            <p class="text-[var(--espace-gris)] text-sm sm:text-base">
                <strong>Statut :</strong> {{ abonnement.actif ? 'Actif' : 'Inactif' }}
            </p>
        </div>
        <div v-else class="bg-[var(--espace-blanc)] shadow-md rounded-lg p-4 sm:p-6">
            <h2 class="text-lg sm:text-xl font-semibold text-[var(--espace-vert)] flex items-center">
                <i class="fas fa-star mr-2"></i> Choisissez un plan Premium
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div class="border rounded-lg p-4 shadow-md">
                    <h3 class="text-lg font-semibold text-[var(--espace-vert)]">Premium Pro</h3>
                    <p class="text-[var(--espace-gris)] text-sm sm:text-base">
                        Mise en avant prioritaire, statistiques détaillées, campagnes sponsorisées
                    </p>
                    <p class="text-[var(--espace-or)] font-bold">4 000 FCFA/mois</p>
                    <button @click="subscribe('premium_pro')"
                        class="mt-2 w-full bg-[var(--espace-or)] text-[var(--espace-vert)] px-4 py-2 rounded hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] flex items-center justify-center">
                        <i class="fas fa-star mr-2"></i> S'abonner
                    </button>
                </div>
                <div class="border rounded-lg p-4 shadow-md">
                    <h3 class="text-lg font-semibold text-[var(--espace-vert)]">Premium Max</h3>
                    <p class="text-[var(--espace-gris)] text-sm sm:text-base">
                        Toutes les fonctionnalités Pro + relance automatique, catalogue exportable
                    </p>
                    <p class="text-[var(--espace-or)] font-bold">75 000 FCFA/an</p>
                    <button @click="subscribe('premium_max')"
                        class="mt-2 w-full bg-[var(--espace-or)] text-[var(--espace-vert)] px-4 py-2 rounded hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] flex items-center justify-center">
                        <i class="fas fa-star mr-2"></i> S'abonner
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '../stores/Auth'

import axios from 'axios'
import AppHeader from '../components/AppHeader.vue'

const authStore = useAuthStore()
const toast = useToast()
const abonnement = ref(null)

onMounted(async () => {
    try {
        await authStore.fetchUser()
        const response = await apiClient.get('/abonnements')
        abonnement.value = response.data.abonnements.find(a => a.user_id === authStore.user.id && a.actif)
    } catch (error) {
        toast.error('Erreur lors du chargement des abonnements')
    }
})

const subscribe = async (plan) => {
    try {
        await apiClient.post('/abonnements', { plan })
        toast.success('Abonnement souscrit !')
        await authStore.fetchUser()
        abonnement.value = { plan, actif: true, debut: new Date(), fin: new Date() }
    } catch (error) {
        if (error.response?.data?.message == 'Unauthenticated.') {
            router.push('login')
        }

        toast.error(error.response?.data.message || 'Erreur lors de la souscription')
    }
}
</script>