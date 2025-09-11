<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '../api/index';
import { useToast } from 'vue-toastification';

const router = useRouter();
const toast = useToast();

// Données réactives
const niveaux = ref<any[]>([]);

// Récupérer les données des niveaux
const fetchNiveaux = async () => {
    try {
        const response = await apiClient.get('/parrainages/niveaux');
        niveaux.value = response.data.niveaux;
    } catch (error) {
        toast.error('Erreur lors de la récupération des niveaux de parrainage');
        console.error(error);
    }
};

// Retour à la page précédente
const goBack = () => {
    router.go(-1);
};

// Initialisation au montage
onMounted(() => {
    fetchNiveaux();
});
</script>

<template>
    <div class="overflow-scroll bg-gray-100 pt-16 pb-20 px-4 sm:px-6">
        <div class="container mx-auto max-w-4xl pb-8">
            <!-- Titre -->
            <h1 class="text-2xl sm:text-3xl font-bold text-[var(--espace-vert)] mb-6 font-poppins">
                <i class="fas fa-info-circle mr-2 text-[var(--espace-or)]"></i> Tout Savoir sur le Parrainage
            </h1>

            <!-- Bouton de retour -->
            <button @click="goBack"
                class="mb-4 bg-[var(--espace-vert)] text-white px-4 py-2 rounded hover:bg-[var(--espace-or)] hover:text-[var(--espace-vert)] transition">
                <i class="fas fa-arrow-left mr-2"></i> Retour
            </button>

            <!-- Introduction -->
            <div class="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 class="text-lg font-semibold text-[var(--espace-vert)] mb-4">Qu'est-ce que le Parrainage ?</h2>
                <p class="text-[var(--espace-gris)] text-sm sm:text-base">
                    Le système de parrainage d'Espace Cameroun vous permet d'inviter des amis avec votre code ou lien
                    unique. Vos gains
                    dépendent des <strong>niveaux de parrainage</strong>, débloqués par le nombre de commerçants
                    parrainés, avec des
                    bonus en jetons cumulatifs. Plus vous parrainez, plus vous montez de niveau ! Découvrez les détails
                    ci-dessous.
                </p>
            </div>

            <!-- Fonctionnement -->
            <div class="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 class="text-lg font-semibold text-[var(--espace-vert)] mb-4">Comment ça fonctionne ?</h2>
                <ol class="list-decimal list-inside text-[var(--espace-gris)] text-sm sm:text-base space-y-2">
                    <li><strong>Obtenez votre code unique :</strong> Générez ou créez votre code de parrainage via la
                        page "Mon Parrainage".</li>
                    <li><strong>Partagez avec vos amis :</strong> Diffusez votre lien ou code via WhatsApp, Facebook ou
                        d'autres moyens pour inviter des amis à s'inscrire.</li>
                    <li><strong>Attirez des commerçants :</strong> Encouragez vos filleuls à devenir des commerçants
                        actifs sur la plateforme. Seuls les commerçants parrainés comptent pour débloquer les
                        niveaux.</li>
                    <li><strong>Montez de niveau :</strong> Chaque niveau nécessite un nombre spécifique de commerçants
                        parrainés. Une fois le seuil atteint, vous débloquez un bonus en jetons correspondant à ce
                        niveau, en plus des bonus des niveaux précédents.</li>
                    <li><strong>Suivez vos progrès :</strong> Consultez votre niveau actuel, vos jetons bonus et vos
                        avantages exclusifs sur la page "Mon Parrainage".</li>
                </ol>
                <p class="text-[var(--espace-gris)] text-sm mt-4">
                    <strong>Note importante :</strong> Les jetons bonus sont cumulatifs et attribués en fonction des
                    niveaux atteints, pas directement par parrainage individuel. Par exemple, si vous atteignez le
                    niveau 2 avec 5 commerçants, vous recevez les bonus des niveaux 1 et 2.
                </p>
            </div>

            <!-- Liste des niveaux -->
            <div v-for="niveau in niveaux" :key="niveau.id" class="mb-6 p-4 border rounded-lg"
                :style="{ backgroundColor: niveau.couleur || '#f0f0f0' }">
                <h3 class="text-md font-semibold text-white flex items-center">
                    {{ niveau.nom }} {{ niveau.emoji }}
                    <span class="ml-2 text-sm text-white/80">({{ niveau.filleuls_requis }} commerçants requis)</span>
                </h3>
                <p class="text-white/90 text-sm mt-2">
                    <strong>Bonus en jetons :</strong> {{ niveau.jetons_bonus }} jetons
                </p>
                <p v-if="niveau.avantages.length" class="text-white/90 text-sm mt-1">
                    <strong>Avantages exclusifs :</strong>
                <ul class="list-disc list-inside ml-4">
                    <li v-for="avantage in niveau.avantages" :key="avantage">{{ avantage }}</li>
                </ul>
                </p>
                <p class="text-white/70 text-xs mt-1 italic">
                    * Les jetons bonus sont crédités une fois le niveau atteint et cumulés avec les niveaux précédents.
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