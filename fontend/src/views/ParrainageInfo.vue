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
        <div class="container mx-auto max-w-4xl">
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
                    Le système de parrainage d'Espace Cameroun vous permet d'inviter des amis à rejoindre la plateforme
                    en utilisant votre code ou lien unique. Pour chaque commerçant actif que vous parrainez, vous
                    recevez <strong>1 jeton </strong>. En plus de cela, vous pouvez débloquer des niveaux en
                    fonction du nombre total de parrainages, chacun offrant des bonus en jetons et des avantages
                    exclusifs. Voici les étapes et détails complets :
                </p>
            </div>

            <!-- Fonctionnement -->
            <div class="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 class="text-lg font-semibold text-[var(--espace-vert)] mb-4">Comment ça fonctionne ?</h2>
                <ol class="list-decimal list-inside text-[var(--espace-gris)] text-sm sm:text-base space-y-2">
                    <li>Obtenez votre code de parrainage unique via la page "Mon Parrainage".</li>
                    <li>Partagez votre lien ou code avec vos amis via WhatsApp, Facebook, ou autre.</li>
                    <li>Lorsqu'un ami s'inscrit avec votre code et devient un commerçant actif, vous gagnez 1 jeton.
                    </li>
                    <li>Accumulez des parrainages pour progresser dans les niveaux et débloquer des bonus
                        supplémentaires.</li>
                    <li>Consultez vos gains et votre niveau actuel sur la page "Mon Parrainage".</li>
                </ol>
            </div>

            <!-- Liste des niveaux -->
            <div class="bg-white rounded-lg shadow-md p-6">
                <h2 class="text-lg font-semibold text-[var(--espace-vert)] mb-4">Détails des Niveaux</h2>
                <div v-for="niveau in niveaux" :key="niveau.id" class="mb-6 p-4 border rounded-lg bg-gray-50">
                    <h3 class="text-md font-semibold text-[var(--espace-vert)] flex items-center">
                        {{ niveau.nom }} {{ niveau.emoji }} <span class="ml-2 text-sm text-[var(--espace-gris)]">({{
                            niveau.filleuls_requis }} parrainages requis)</span>
                    </h3>
                    <p class="text-[var(--espace-gris)] text-sm mt-2">
                        <strong>Bonus en jetons :</strong> {{ niveau.jetons_bonus }} jetons
                    </p>
                    <p v-if="niveau.avantages.length" class="text-[var(--espace-gris)] text-sm mt-1">
                        <strong>Avantages exclusifs :</strong>
                    <ul class="list-disc list-inside ml-4">
                        <li v-for="avantage in niveau.avantages" :key="avantage">{{ avantage }}</li>
                    </ul>
                    </p>
                    <p class="text-[var(--espace-gris)] text-xs mt-1 italic">
                        * Les jetons bonus sont crédités une fois le niveau atteint et cumulables avec les jetons gagnés
                        par commerçant.
                    </p>
                </div>
                <p class="text-[var(--espace-gris)] text-sm mt-4">
                    <strong>Note importante :</strong> Le niveau maximum ("Légende 🛡️") est atteint à 1000 parrainages.
                    Continuez à inviter pour maximiser vos récompenses !
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