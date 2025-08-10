<template>
    <div v-if="isOpen"
        class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-y-auto animate-fade-in max-h-[90vh]">
            <!-- HEADER -->
            <div class="bg-gradient-to-r from-[var(--espace-vert)] to-[var(--espace-or)] p-6 text-center">
                <h2 class="text-3xl font-bold text-white">🚀 Passez à Premium</h2>
                <p class="text-white/90 mt-1">
                    Comparez et choisissez le plan qui boostera votre business
                </p>
            </div>

            <div class="p-6">
                <!-- Étape 1 : Choix du pack -->
                <div v-if="!selectedPlan" class="grid md:grid-cols-3 gap-6">
                    <!-- GRATUIT -->
                    <div class="border border-gray-200 bg-gray-50 rounded-xl p-6 flex flex-col justify-between">
                        <div>
                            <h3 class="text-xl font-bold text-gray-800">Gratuit (Base)</h3>
                            <p class="text-sm text-gray-500 mb-4">Pour débuter sans frais</p>
                            <ul class="space-y-2 text-sm">
                                <li class="flex items-center gap-2 text-gray-700">
                                    <span>✔</span> 10 produits max
                                </li>
                                <li class="flex items-center gap-2 text-gray-700">
                                    <span>✔</span> 5 collaborations max
                                </li>
                                <li class="flex items-center gap-2 text-gray-400">
                                    <span>❌</span> Pas de statistiques détaillées
                                </li>
                                <li class="flex items-center gap-2 text-gray-400">
                                    <span>❌</span> Pas de badge Premium
                                </li>
                                <li class="flex items-center gap-2 text-gray-400">
                                    <span>❌</span> Position prioritaire
                                </li>
                            </ul>
                        </div>
                        <button disabled
                            class="mt-6 w-full py-2 rounded-lg bg-gray-300 text-gray-600 font-semibold cursor-not-allowed">
                            Actuel
                        </button>
                    </div>

                    <!-- PREMIUM MENSUEL -->
                    <div class="relative bg-gradient-to-br from-[var(--espace-vert)] to-green-500 rounded-xl text-white p-6 flex flex-col justify-between shadow-lg transform hover:scale-105 scale-103 transition cursor-pointer"
                        @click="selectPlan('monthly')">
                        <span
                            class="absolute top-1 right-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow">⭐
                            Populaire</span>
                        <div>
                            <h3 class="text-xl font-bold">Premium - Mensuel</h3>
                            <p class="text-sm opacity-90 mb-4">
                                Accès complet à toutes les fonctionnalités
                            </p>
                            <div class="text-3xl font-extrabold mb-2">5000 FCFA / mois  </div>
                            <ul class="space-y-2 text-sm">
                                <li class="flex items-center gap-2"><span>✔</span> Produits illimités</li>
                                <li class="flex items-center gap-2"><span>✔</span> Collaborations illimitées</li>
                                <li class="flex items-center gap-2">
                                    <span>✔</span> 20 jetons gratuits/mois
                                </li>
                                <li class="flex items-center gap-2"><span>✔</span> Statistiques détaillées</li>
                                <li class="flex items-center gap-2"><span>✔</span> Badge “Premium”</li>
                                <li class="flex items-center gap-2"><span>✔</span> Position prioritaire</li>
                            </ul>
                        </div>
                        <button @click.stop="selectPlan('monthly')"
                            class="mt-6 w-full py-2 rounded-lg bg-white text-[var(--espace-vert)] font-bold hover:bg-gray-100 transition">
                            Choisir ce plan
                        </button>
                    </div>

                    <!-- PREMIUM ANNUEL -->
                    <div class="relative bg-gradient-to-br from-yellow-400 to-[var(--espace-or)] rounded-xl text-gray-900 p-6 flex flex-col justify-between shadow-lg transform hover:scale-105 transition cursor-pointer"
                        @click="selectPlan('yearly')">
                        <span
                            class="absolute top-1 right-3 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">-16%
                            Économie</span>
                        <div>
                            <h3 class="text-xl font-bold">Premium - Annuel</h3>
                            <p class="text-sm opacity-90 mb-4">Payez moins, profitez plus</p>
                            <div class="text-3xl font-extrabold mb-2">50 000 FCFA / an</div>
                            <ul class="space-y-2 text-sm">
                                <li class="flex items-center gap-2"><span>✔</span> Produits illimités</li>
                                <li class="flex items-center gap-2"><span>✔</span> Collaborations illimitées</li>
                                <li class="flex items-center gap-2">
                                    <span>✔</span> 20 jetons gratuits/mois
                                </li>
                                <li class="flex items-center gap-2"><span>✔</span> Statistiques détaillées</li>
                                <li class="flex items-center gap-2"><span>✔</span> Badge “Premium”</li>
                                <li class="flex items-center gap-2"><span>✔</span> Position prioritaire</li>
                            </ul>
                        </div>
                        <button @click.stop="selectPlan('yearly')"
                            class="mt-6 w-full py-2 rounded-lg bg-white text-[var(--espace-or)] font-bold hover:bg-gray-100 transition">
                            Choisir ce plan
                        </button>
                    </div>
                </div>

                <!-- Étape 2 : Formulaire d'inscription -->
                <!-- Étape 2 : Formulaire paiement professionnel -->
                <div v-else class="flex flex-col md:flex-row max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-lg">
                    <!-- Résumé du pack choisi -->
                    <div class="md:w-1/3 mb-6 md:mb-0 pr-6 border-r border-gray-200">
                        <h3 class="text-xl font-bold mb-4">Votre abonnement</h3>
                        <div :class="{
                            'bg-green-600 text-white': selectedPlan === 'monthly',
                            'bg-yellow-400 text-gray-900': selectedPlan === 'yearly',
                        }" class="rounded-lg p-4">
                            <h4 class="font-extrabold text-lg mb-2">
                                {{ selectedPlan === 'monthly' ? 'Premium Mensuel' : 'Premium Annuel' }}
                            </h4>
                            <p class="mb-2 text-sm opacity-90">
                                {{ selectedPlan === 'monthly'
                                ? 'Accès complet à toutes les fonctionnalités.'
                                : 'Payez moins, profitez plus avec 16% d’économie !' }}
                            </p>
                            <div class="text-3xl font-extrabold">
                                {{ selectedPlan === 'monthly' ? '5 000 FCFA' : '50 000 FCFA' }}
                            </div>
                        </div>
                    </div>

                    <!-- Formulaire paiement -->
                    <form @submit.prevent="confirmUpgrade" class="md:w-2/3 flex flex-col gap-6" novalidate>
                        <h3 class="text-xl font-bold mb-2">Détails du paiement</h3>

                        <label class="flex flex-col text-sm font-medium text-gray-700">
                            Numéro de téléphone
                            <input v-model="phoneNumber" type="tel" placeholder="Ex: 696428651"
                                class="mt-1 rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-[var(--espace-vert)] transition"
                                :class="{ 'border-red-500': phoneError }" @input="phoneError = !phoneNumber" required />
                            <span v-if="phoneError" class="text-xs text-red-600 mt-1">Veuillez entrer un numéro
                                valide.</span>
                        </label>

                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Service de paiement
                        </label>

                        <div class="flex gap-4">
                            <label v-for="service in paymentServices" :key="service.value" class="flex items-center gap-2 cursor-pointer rounded-lg border p-3 flex-1 transition
           hover:border-[var(--espace-vert)]
           " :class="{
            'border-[var(--espace-vert)] bg-[var(--espace-vert)]/10': selectedService === service.value,
            'border-gray-300 bg-white': selectedService !== service.value,
            'border-red-500': serviceError && !selectedService
        }">
                                <input type="radio" :value="service.value" v-model="selectedService" class="hidden" />
                                <img :src="service.logo" alt="" class="h-8 w-8 object-contain" />
                                <span :class="{
                                    'text-[var(--espace-vert)]': selectedService === service.value,
                                    'text-gray-700': selectedService !== service.value,
                                }" class="font-semibold select-none">
                                    {{ service.label }}
                                </span>
                            </label>
                        </div>

                        <span v-if="serviceError && !selectedService" class="text-xs text-red-600 mt-1 block">
                            Veuillez sélectionner un service.
                        </span>
                        <button type="submit" :disabled="isLoading || !phoneNumber || !selectedService"
                            class="w-full py-3 rounded-lg bg-[var(--espace-vert)] text-white font-bold hover:bg-[var(--espace-or)] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                            <template v-if="isLoading">
                                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
                                    fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor"
                                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                </svg>
                                Veuillez patienter...
                            </template>
                            <template v-else>
                                Payer & Souscrire
                            </template>
                        </button>


                        <button type="button" @click="selectedPlan = ''"
                            class="w-full text-center text-gray-500 hover:text-[var(--espace-vert)] transition">
                            ← Retour aux plans
                        </button>

                        <p class="text-xs text-gray-400 mt-4 text-center">
                            🔒 Paiement sécurisé via {{ selectedService || 'votre service' }}
                        </p>
                    </form>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import apiClient from '../api';
import { useToast } from 'vue-toastification';

const props = defineProps<{
    isOpen: boolean;
}>();

const emit = defineEmits(['close', 'upgraded']);

const toast = useToast();

const selectedPlan = ref('');
const selectedService = ref('');
const phoneNumber = ref('');
const phoneError = ref(false);
const serviceError = ref(false);
const isLoading = ref(false);

const selectPlan = (plan: string) => {
    selectedPlan.value = plan;
    // Reset errors and form inputs on plan change
    phoneError.value = false;
    serviceError.value = false;
    selectedService.value = '';
    phoneNumber.value = '';
};


const paymentServices = [
    {
        value: 'ORANGE',
        label: 'Orange Money',
        logo: new URL('../assets/images/logo/orange.png', import.meta.url).href,
    },
    {
        value: 'MTN',
        label: 'MTN Mobile Money',
        logo: new URL('../assets/images/logo/mtn.jpg', import.meta.url).href,
    },
   
];

const confirmUpgrade = async () => {
    phoneError.value = !phoneNumber.value;
    serviceError.value = !selectedService.value;

    if (phoneError.value || serviceError.value) {
        toast.error('Veuillez remplir tous les champs correctement.');
        return;
    }

    isLoading.value = true;
    try {
        console.log({
            subscription_type: selectedPlan.value,
            payment_service: selectedService.value,
            phone_number: phoneNumber.value,
        });
        const res = await apiClient.post('/upgrade-to-premium', {
            subscription_type: selectedPlan.value,
            payment_service: selectedService.value,
            phone_number: phoneNumber.value,
        });
        isLoading.value = false;
        
        toast.success(res.data.message);
        emit('upgraded');
        emit('close');
    } catch (e: any) {
        if (e.response && e.response.data) {
            const errorData = e.response.data;
            toast.error(
                `Paiement échoué :Verifiez vos informations et réessayer`
            );
        } else {
            toast.error('Verifiez vos informations et réessayer.');
        }
        console.error(e);
    } finally {
        isLoading.value = false;

    }
};
</script>

<style scoped>
@keyframes fade-in {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in {
    animation: fade-in 0.3s ease-out;
}

/* Input et select modernisés */
input[type='tel'],
select {
    background-color: #f9fafb;
    border: 1px solid #d1d5db;
    font-size: 0.95rem;
    border-radius: 0.75rem;
    padding: 0.75rem 1rem;
    transition: all 0.3s ease;
}

input[type='tel']:focus,
select:focus {
    border-color: var(--espace-vert);
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.2);
}

/* Plan cards */
div[class*='grid-cols']>div {
    border-radius: 0.75rem;
    overflow: hidden;
    transition: all 0.3s ease;
}

div[class*='grid-cols']>div:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

/* Bouton de souscription */
button.mt-4 {
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.2s ease;
}

/* Red border pour erreurs */
.border-red-500 {
    border-color: #ef4444 !important;
}

/* Amélioration de la boîte modale */
div[class*='bg-white'] {
    border-radius: 1rem;
    box-shadow: 0 20px 35px rgba(0, 0, 0, 0.08);
}

/* Arrière-plan fondu */
div[class*='bg-black'] {
    backdrop-filter: blur(2px);
}
</style>
