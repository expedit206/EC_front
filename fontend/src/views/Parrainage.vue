<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/Auth';
import apiClient from '../api';
import { useToast } from 'vue-toastification';

const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();

const code = ref('');
const link = ref('');
const parrainages = ref([]);
const totalGains = ref(0);
const suggestedCode = ref('');
const customCode = ref('');
const isGenerating = ref(false);
const isCreating = ref(false);

const fetchParrainageData = async () => {
    if (!authStore.user) {
        toast.error('Veuillez vous connecter');
        router.push('/login');
        return;
    }

    try {
        const response = await apiClient.get('/parrainages/dashboard');
        const data = response.data;
        code.value = data.code;
        link.value = `https://espacecameroun.cm/invite/${data.code}`;
        parrainages.value = data.parrainages;
        totalGains.value = data.total_gains;
    } catch (error) {
        toast.error('Erreur lors du chargement des données de parrainage');
    }
};

const generateCodeSuggestion = async () => {
    if (!authStore.user) return;

    isGenerating.value = true;
    try {
        const response = await apiClient.post('/parrainages/generate-suggestion');
        suggestedCode.value = response.data.suggested_code;
        customCode.value = suggestedCode.value;
        toast.success('Nouveau code suggéré !');
    } catch (error) {
        toast.error('Erreur lors de la génération du code');
    } finally {
        isGenerating.value = false;
    }
};

const createCode = async () => {
    if (!authStore.user || !customCode.value) return;

    isCreating.value = true;
    try {
        const response = await apiClient.post('/parrainages/create', { code: customCode.value });
        code.value = response.data.code;
        link.value = response.data.link;
        toast.success(response.data.message);
        await fetchParrainageData();
    } catch (error) {
        toast.error(error.response?.data?.message || 'Erreur lors de la création du code');
    } finally {
        isCreating.value = false;
    }
};

const shareLink = (platform: string) => {
    let url = '';
    switch (platform) {
        case 'whatsapp':
            url = `https://api.whatsapp.com/send?text=${encodeURIComponent(link.value)}`;
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

onMounted(() => {
    fetchParrainageData();
});
</script>

<template>
    <div class="min-h-screen bg-gray-100 pt-16 pb-20 px-4 sm:px-6">
        <div class="container mx-auto max-w-4xl">
            <h1 class="text-2xl sm:text-3xl font-bold text-[var(--espace-vert)] mb-6 font-poppins">
                <i class="fas fa-users mr-2 text-[var(--espace-or)]"></i> Mon Parrainage
            </h1>

            <!-- Bloc Explicatif -->
            <div class="bg-white rounded-lg shadow-md p-4 mb-6">
                <p class="text-[var(--espace-gris)]">
                    Invitez des utilisateurs avec votre lien ou code unique et gagnez des récompenses ! Pour chaque
                    commerçant actif, recevez 500 FCFA de bonus et 10% sur ses 3 premières ventes.
                </p>
            </div>

            <!-- Générer ou Créer le Code -->
            <div class="bg-white rounded-lg shadow-md p-4 mb-6">
                <h2 class="text-lg font-semibold text-[var(--espace-vert)] mb-2">Votre Parrainage</h2>
                <div v-if="code" class="mb-4">
                    <p class="text-sm text-[var(--espace-gris)]">Code : <span
                            class="font-bold text-[var(--espace-or)]">{{ code }}</span></p>
                    <p class="text-sm text-[var(--espace-gris)]">Lien : <a :href="link"
                            class="text-blue-500 underline">{{ link }}</a></p>
                </div>
                <div v-else class="mb-4">
                    <input v-model="customCode" type="text"
                        :placeholder="suggestedCode || 'Entrez ou générez un code (ex: DOM2025)'"
                        class="w-full p-2 border rounded mb-2" />
                    <div class="flex gap-2">
                        <button @click="generateCodeSuggestion" :disabled="isGenerating"
                            class="bg-[var(--espace-or)] text-[var(--espace-vert)] px-4 py-2 rounded hover:bg-[var(--espace-vert)] hover:text-white transition flex-1">
                            <span v-if="isGenerating"><i class="fas fa-spinner animate-spin mr-2"></i>Générer</span>
                            <span v-else><i class="fas fa-magic mr-2"></i>Générer</span>
                        </button>
                        <button @click="createCode" :disabled="isCreating || !customCode"
                            class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition flex-1">
                            <span v-if="isCreating"><i class="fas fa-spinner animate-spin mr-2"></i>Créer</span>
                            <span v-else><i class="fas fa-check mr-2"></i>Créer</span>
                        </button>
                    </div>
                </div>
                <div v-if="code" class="mt-4 flex gap-2">
                    <button @click="shareLink('whatsapp')"
                        class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                        <i class="fab fa-whatsapp mr-1"></i> WhatsApp
                    </button>
                    <button @click="shareLink('facebook')"
                        class="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                        <i class="fab fa-facebook-f mr-1"></i> Facebook
                    </button>
                </div>
            </div>

            <!-- Tableau des Parrainés -->
            <div class="bg-white rounded-lg shadow-md p-4">
                <h2 class="text-lg font-semibold text-[var(--espace-vert)] mb-4">Mes Utilisateurs Parrainés</h2>
                <div v-if="parrainages.length" class="overflow-x-auto">
                    <table class="w-full text-sm text-left text-[var(--espace-gris)]">
                        <thead class="bg-[var(--espace-vert)] text-[var(--espace-blanc)]">
                            <tr>
                                <th class="px-4 py-2">Nom</th>
                                <th class="px-4 py-2">Date Inscription</th>
                                <th class="px-4 py-2">Est Commerçant</th>
                                <th class="px-4 py-2">Ventes Générées (FCFA)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="p in parrainages" :key="p.filleul_nom" class="border-b hover:bg-gray-50">
                                <td class="px-4 py-2">{{ p.filleul_nom }}</td>
                                <td class="px-4 py-2">{{ new Date(p.date_inscription).toLocaleDateString() }}</td>
                                <td class="px-4 py-2">{{ p.est_commercant ? 'Oui' : 'Non' }}</td>
                                <td class="px-4 py-2">{{ p.est_commercant ? p.ventes_generees : '-' }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <p v-else class="text-center text-[var(--espace-gris)] py-4">Aucun utilisateur parrainé pour le moment.
                </p>
            </div>

            <!-- Résumé des Gains -->
            <div class="bg-white rounded-lg shadow-md p-4 mt-6 text-center">
                <h2 class="text-lg font-semibold text-[var(--espace-vert)] mb-2">Vos Gains</h2>
                <p class="text-2xl font-bold text-[var(--espace-or)]">{{ totalGains }} FCFA</p>
                <p class="text-[var(--espace-gris)]">🎉 Tu as invité {{ parrainages.length }} utilisateurs – {{
                    parrainages.filter(p => p.est_commercant).length}} sont commerçants !</p>
                <p class="text-[var(--espace-gris)]">⬇️ Gagne encore 10% sur les ventes des commerçants.</p>
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
    padding: 8px 4px;
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
</style>