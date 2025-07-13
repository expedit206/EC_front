<!-- src/views/Parrainage.vue -->
<template>
    <div class="container mx-auto p-4 sm:p-6">
        <AppHeader />
        <h1 class="text-2xl sm:text-3xl font-bold text-[var(--espace-vert)] mb-4 flex items-center">
            <i class="fas fa-users mr-2"></i> Mon Parrainage
        </h1>
        <div class="bg-[var(--espace-blanc)] shadow-md rounded-lg p-4 sm:p-6 mb-4">
            <p class="text-[var(--espace-gris)] text-sm sm:text-base">
                Votre code : <strong>{{ user.code_parrainage }}</strong>
            </p>
            <button @click="shareCode"
                class="mt-2 w-full sm:w-auto bg-[var(--espace-or)] text-[var(--espace-vert)] px-4 py-2 rounded hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] flex items-center">
                <i class="fas fa-share-alt mr-2"></i> Partager mon lien
            </button>
        </div>
        <div class="mb-4">
            <h2 class="text-lg sm:text-xl font-semibold text-[var(--espace-vert)] flex items-center">
                <i class="fas fa-user-friends mr-2"></i> Mes filleuls
            </h2>
            <div v-for="filleul in filleuls" :key="filleul.id"
                class="p-2 border-b text-[var(--espace-gris)] text-sm sm:text-base">
                <p>{{ filleul.filleul.nom }} - Actif: {{ filleul.filleul.commercant?.actif ? 'Oui' : 'Non' }} - Gains:
                    {{ filleul.recompense }} FCFA</p>
            </div>
        </div>
        <div>
            <h2 class="text-lg sm:text-xl font-semibold text-[var(--espace-vert)] flex items-center">
                <i class="fas fa-chart-line mr-2"></i> Ma progression
            </h2>
            <div class="w-full bg-[var(--espace-blanc)] rounded-full h-4">
                <div class="bg-[var(--espace-vert)] h-4 rounded-full" :style="{ width: progress + '%' }"></div>
            </div>
            <p class="text-[var(--espace-gris)] text-sm sm:text-base">Niveau actuel : {{ niveau.nom }} ({{ niveau.requis
            }} commerçants)</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import axios from 'axios'
import { useAuthStore } from '../stores/Auth'

import AppHeader from '../components/AppHeader.vue'

const authStore = useAuthStore()
const toast = useToast()
const user = ref(authStore.user)
const filleuls = ref([])
const niveaux = [
    { nom: 'Découvreur', requis: 1 },
    { nom: 'Prometteur', requis: 3 },
    { nom: 'Relais Local', requis: 5 },
    { nom: 'Influenceur Marché', requis: 7 },
    { nom: 'Ambassadeur Bronze', requis: 10 },
    { nom: 'Ambassadeur Argent', requis: 15 },
    { nom: 'Ambassadeur Or', requis: 25 },
    { nom: 'Légende', requis: 40 },
    { nom: 'Grand Mentor', requis: 60 },
]
const niveau = ref(niveaux[0])
const progress = ref(0)

onMounted(async () => {
    try {
        await authStore.fetchUser()
        user.value = authStore.user
        const response = await axios.get('http://localhost:8000/api/v1/parrainages')
        filleuls.value = response.data.parrainages
        const actifs = filleuls.value.filter(f => f.filleul.commercant?.actif).length
        niveau.value = niveaux.find(n => actifs >= n.requis) || niveaux[0]
        progress.value = Math.min((actifs / niveau.value.requis) * 100, 100)
    } catch (error) {
        toast.error('Erreur lors du chargement des données')
    }
})

const shareCode = () => {
    const shareUrl = `https://espacecameroun.cm/invite/${user.value.code_parrainage}`
    if (navigator.share) {
        navigator.share({ url: shareUrl, title: 'Rejoignez Espace Cameroun !' })
    } else {
        navigator.clipboard.writeText(shareUrl)
        toast.success('Lien copié dans le presse-papiers !')
    }
}
</script>