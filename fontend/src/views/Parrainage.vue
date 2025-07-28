<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/Auth';
import apiClient from '../api';
import { useToast } from 'vue-toastification';

const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();

// Données réactives
const code = ref('');
const link = ref('');
const parrainages = ref([]);
const totalGains = ref(0); // Total en jetons
const suggestedCode = ref('');
const customCode = ref('');
const isGenerating = ref(false);
const isCreating = ref(false);
const niveauActuel = ref<any>({});
const niveauSuivant = ref<any>(null);
const progression = ref(0);

// Récupérer les données de parrainage
const fetchParrainageData = async () => {
    if (!authStore.user) {
        toast.error('Veuillez vous connecter pour accéder à cette page');
        router.push('/login');
        return;
    }

    try {
        const response = await apiClient.get('/parrainages/dashboard');
        const data = response.data;
        code.value = data.code || '';
        link.value = data.code ? `https://espacecameroun.cm/invite/${data.code}` : '';
        parrainages.value = data.parrainages || [];
        totalGains.value = data.total_gains || 0; // Total en jetons
        niveauActuel.value = data.niveau_actuel;
        niveauSuivant.value = data.niveau_suivant;
        progression.value = data.progression;
    } catch (error) {
        toast.error('Erreur lors de la récupération des données de parrainage');
        console.error(error);
    }
};

// Générer une suggestion de code
const generateCodeSuggestion = async () => {
    if (!authStore.user) {
        toast.error('Veuillez vous connecter');
        return;
    }

    isGenerating.value = true;
    try {
        const response = await apiClient.post('/parrainages/generate-code');
        suggestedCode.value = response.data.suggested_code;
        customCode.value = suggestedCode.value;
        toast.success('Nouveau code suggéré avec succès !');
    } catch (error) {
        toast.error('Erreur lors de la génération du code');
        console.error(error);
    } finally {
        isGenerating.value = false;
    }
};

// Créer un code personnalisé
const createCode = async () => {
    if (!authStore.user) {
        toast.error('Veuillez vous connecter');
        return;
    }
    if (!customCode.value.trim()) {
        toast.error('Veuillez entrer un code valide');
        return;
    }

    isCreating.value = true;
    try {
        const response = await apiClient.post('/parrainages/create-code', { code: customCode.value.trim() });
        code.value = response.data.code;
        link.value = response.data.link || `https://espacecameroun.cm/invite/${response.data.code}`;
        toast.success(response.data.message || 'Code créé avec succès !');
        await fetchParrainageData();
    } catch (error: any) {
        toast.error(error.response?.data?.message || 'Erreur lors de la création du code');
        console.error(error);
    } finally {
        isCreating.value = false;
    }
};

// Partager le lien sur les réseaux sociaux
const shareLink = (platform: string) => {
    if (!link.value) {
        toast.error('Aucun lien disponible pour le partage');
        return;
    }

    let url = '';
    const message = encodeURIComponent(`Rejoins-moi sur Espace Cameroun avec mon lien : ${link.value}`);
    switch (platform) {
        case 'whatsapp':
            url = `https://api.whatsapp.com/send?text=${message}`;
            break;
        case 'facebook':
            url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link.value)}`;
            break;
        default:
            toast.error('Plateforme non prise en charge');
            return;
    }
    window.open(url, '_blank');
};

// Initialisation au montage
onMounted(() => {
    fetchParrainageData();
});
</script>

<template>
    <div class="min-h-screen bg-gray-100 pt-2 pb-12 px-4 sm:px-6">
        <div class="container mx-auto max-w-4xl">
            <!-- Section des Niveaux de Parrainage -->
            <div class="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 class="text-lg font-semibold text-[var(--espace-vert)] mb-4">Niveaux de Parrainage</h2>
                <p class="text-[var(--espace-gris)] text-sm mb-2">
                    Votre niveau actuel : <strong>{{ niveauActuel.nom }} {{ niveauActuel.emoji }} ({{ parrainages.length
                        }}/{{ niveauSuivant ? niveauSuivant.filleuls_requis : niveauActuel.filleuls_requis }})</strong>
                    <span v-if="niveauActuel.jetons_bonus > 0" class="ml-2">+{{ niveauActuel.jetons_bonus }} jetons
                        bonus</span>
                </p>
                <div class="w-full bg-gray-200 rounded-full h-4">
                    <div class="h-4 rounded-full bg-[var(--espace-or)] transition-all duration-300"
                        :style="{ width: `${progression}%` }"></div>
                </div>
                <p class="text-[var(--espace-gris)] text-xs mt-2">
                    Prochain niveau : {{ niveauSuivant ? niveauSuivant.nom : 'Légende 🛡️' }} à {{ niveauSuivant ?
                        niveauSuivant.filleuls_requis : '1000+' }} parrainages
                </p>
                <p v-if="niveauActuel.avantages?.length" class="text-[var(--espace-gris)] text-xs mt-1">
                    Avantages : {{ niveauActuel.avantages.join(', ') }}
                </p>
                <button @click="router.push('/parrainage/info')"
                    class="mt-4 bg-[var(--espace-vert)] text-white px-4 py-2 rounded hover:bg-[var(--espace-or)] hover:text-[var(--espace-vert)] transition">
                    <i class="fas fa-info-circle mr-2"></i> En savoir plus
                </button>
            </div>

            <!-- Bloc Explicatif -->
            <div class="bg-white rounded-lg shadow-md p-6 mb-6">
                <p class="text-[var(--espace-gris)] text-sm sm:text-base">
                    Invitez des amis avec votre lien ou code unique et gagnez des récompenses ! Recevez <strong>1
                        jeton</strong> pour chaque commerçant actif parrainé.
                </p>
            </div>

            <!-- Générer ou Créer le Code -->
            <div class="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 class="text-lg font-semibold text-[var(--espace-vert)] mb-4">Votre Code de Parrainage</h2>
                <div v-if="code" class="mb-4">
                    <p class="text-sm text-[var(--espace-gris)]">
                        Code : <span class="font-bold text-[var(--espace-or)]">{{ code }}</span>
                    </p>
                    <p class="text-sm text-[var(--espace-gris)] truncate">
                        Lien : <a :href="link" target="_blank" class="text-blue-500 underline hover:text-blue-700">{{
                            link }}</a>
                    </p>
                </div>
                <div v-else class="mb-4">
                    <input v-model="customCode" type="text"
                        :placeholder="suggestedCode || 'Entrez ou générez un code (ex: DOM2025)'"
                        class="w-full p-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-[var(--espace-vert)]"
                        maxlength="10" />
                    <div class="flex flex-col sm:flex-row gap-2">
                        <button @click="generateCodeSuggestion" :disabled="isGenerating"
                            class="bg-[var(--espace-or)] text-[var(--espace-vert)] px-4 py-2 rounded hover:bg-[var(--espace-vert)] hover:text-white transition flex-1 disabled:opacity-50">
                            <span v-if="isGenerating">
                                <i class="fas fa-spinner animate-spin mr-2"></i> Génération...
                            </span>
                            <span v-else>
                                <i class="fas fa-magic mr-2"></i> Générer un code
                            </span>
                        </button>
                        <button @click="createCode" :disabled="isCreating || !customCode.trim()"
                            class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition flex-1 disabled:opacity-50">
                            <span v-if="isCreating">
                                <i class="fas fa-spinner animate-spin mr-2"></i> Création...
                            </span>
                            <span v-else>
                                <i class="fas fa-check mr-2"></i> Créer le code
                            </span>
                        </button>
                    </div>
                </div>
                <div v-if="code" class="mt-4 flex flex-col sm:flex-row gap-2">
                    <button @click="shareLink('whatsapp')"
                        class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition flex-1">
                        <i class="fab fa-whatsapp mr-2"></i> Partager sur WhatsApp
                    </button>
                    <button @click="shareLink('facebook')"
                        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition flex-1">
                        <i class="fab fa-facebook-f mr-2"></i> Partager sur Facebook
                    </button>
                </div>
            </div>

            <!-- Tableau des Parrainés -->
            <div class="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 class="text-lg font-semibold text-[var(--espace-vert)] mb-4">Mes Utilisateurs Parrainés</h2>
                <div v-if="parrainages.length" class="overflow-x-auto">
                    <table class="w-full text-sm text-left text-[var(--espace-gris)]">
                        <thead class="bg-[var(--espace-vert)] text-[var(--espace-blanc)]">
                            <tr>
                                <th class="px-4 py-2">Nom</th>
                                <th class="px-4 py-2">Date d'inscription</th>
                                <th class="px-4 py-2">Est commerçant</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="p in parrainages" :key="p.filleul_nom" class="border-b hover:bg-gray-50">
                                <td class="px-4 py-2">{{ p.filleul_nom || 'Anonyme' }}</td>
                                <td class="px-4 py-2">{{ new Date(p.date_inscription).toLocaleDateString('fr-FR') }}
                                </td>
                                <td class="px-4 py-2">{{ p.est_commercant ? 'Oui' : 'Non' }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <p v-else class="text-center text-[var(--espace-gris)] py-4">
                    Aucun utilisateur parrainé pour le moment. Commencez à inviter dès maintenant !
                </p>
            </div>

            <!-- Résumé des Gains -->
            <div class="bg-white rounded-lg shadow-md p-6 text-center">
                <h2 class="text-lg font-semibold text-[var(--espace-vert)] mb-2">Vos Gains</h2>
                <p class="text-2xl sm:text-3xl font-bold text-[var(--espace-or)]">
                    {{ totalGains }} jetons
                </p>
                <p class="text-[var(--espace-gris)] mt-2">
                    🎉 Vous avez invité <strong>{{ parrainages.length }}</strong> utilisateurs, dont <strong>{{
                        parrainages.filter(p => p.est_commercant).length }}</strong> sont commerçants !
                </p>
                <p class="text-[var(--espace-gris)]">
                    ⬇️ Gagnez <strong>1 jeton</strong> par commerçant actif parrainé.
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

table {
    border-collapse: collapse;
    width: 100%;
}

th,
td {
    padding: 8px 16px;
}

th {
    background-color: var(--espace-vert);
    color: var(--espace-blanc);
}

tr:hover {
    background-color: #f9fafb;
}

.animate-spin {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

/* Responsive adjustments */
@media (max-width: 640px) {

    th,
    td {
        padding: 8px;
        font-size: 0.875rem;
    }

    button {
        width: 100%;
    }
}
</style>