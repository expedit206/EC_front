<template>
    <div v-if="isOpen"
        class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div
            class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 space-y-6 animate-fade-in max-h-[90vh] overflow-auto">
            <h2 class="text-3xl font-extrabold text-[var(--espace-vert)] text-center">
                🎫 Acheter des Jetons
            </h2>
            <p class="text-center text-gray-600 text-sm mb-6">1 jeton = 25 FCFA</p>

            <!-- Facilitateurs de quantité -->
            <div class="flex justify-center gap-3 mb-4">
                <button v-for="preset in presetQuantities" :key="preset" type="button" @click="setQuantity(preset)"
                    :class="[
                        'rounded-full px-4 py-2 border font-semibold transition',
                        jetonQuantity === preset
                            ? 'bg-[var(--espace-vert)] text-white border-[var(--espace-vert)]'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-[var(--espace-vert)] hover:text-white',
                    ]">
                    {{ preset }}
                </button>
            </div>

            <!-- Quantité de jetons -->
            <label class="block text-gray-700 font-semibold mb-1" for="jetonQuantity">
                Nombre de jetons <span class="text-sm text-gray-500">(min 10)</span>
            </label>
            <input id="jetonQuantity" v-model.number="jetonQuantity" type="number" min="10" placeholder="Ex: 10"
                @input="onQuantityInput"
                class="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--espace-vert)] transition" />

            <!-- Numéro de téléphone -->
            <label class="block text-gray-700 font-semibold mb-1 mt-4" for="phoneNumber">
                Numéro de téléphone
            </label>
            <input id="phoneNumber" v-model="phoneNumber" type="tel" placeholder="Ex: 696428651"
                class="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--espace-vert)] transition" />

            <!-- Service de paiement avec logos -->
            <label class="block text-gray-700 font-semibold mb-2 mt-4">
                Service de paiement
            </label>
            <div class="flex gap-4">
                <label v-for="service in paymentServices" :key="service.value" class="flex items-center gap-3 cursor-pointer rounded-lg border p-3 flex-1 transition
                hover:border-[var(--espace-vert)]" :class="{
                    'border-[var(--espace-vert)] bg-[var(--espace-vert)]/10': selectedService === service.value,
                    'border-gray-300 bg-white': selectedService !== service.value,
                }">
                    <input type="radio" :value="service.value" v-model="selectedService" class="hidden" />
                    <img :src="service.logo" alt="" class="h-8 w-8 object-contain" />
                    <span :class="{
                        'text-[var(--espace-vert)] font-bold': selectedService === service.value,
                        'text-gray-700': selectedService !== service.value,
                    }">
                        {{ service.label }}
                    </span>
                </label>
            </div>
            <p v-if="serviceError && !selectedService" class="text-xs text-red-600 mt-1">
                Veuillez sélectionner un service.
            </p>

            <!-- Montant à payer -->
            <div class="text-center text-lg font-bold mt-6">
                Montant total : <span class="text-[var(--espace-vert)]">{{ montant }} FCFA</span>
            </div>

            <!-- Bouton d'achat avec loading -->
            <button @click="acheterJetons" :disabled="!isFormValid || loading"
                class="w-full mt-4 bg-[var(--espace-vert)] text-white py-3 rounded-lg font-semibold hover:bg-[var(--espace-or)] transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-3">
                <svg v-if="loading" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
                    fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                <span> Acheter </span>
            </button>

            <button @click="$emit('close')"
                class="w-full mt-2 text-center text-gray-500 hover:text-[var(--espace-vert)] transition">
                Annuler
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import apiClient from '../api';
import { useToast } from 'vue-toastification';

defineProps<{
    isOpen: boolean;
}>();

const emit = defineEmits(['close', 'purchased']);

const toast = useToast();

const jetonQuantity = ref<number>(10);
const phoneNumber = ref<string>('');
const selectedService = ref<string>('');
const montant = ref<number>(jetonQuantity.value * 25);

const loading = ref(false);
const serviceError = ref(false);

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

const presetQuantities = [10, 20, 50, 100];

const isFormValid = computed(() => {
    return (
        jetonQuantity.value >= 10 &&
        phoneNumber.value.trim().length >= 8 &&
        selectedService.value !== ''
    );
});

const updateMontant = () => {
    montant.value = jetonQuantity.value * 25;
};

const setQuantity = (qty: number) => {
    jetonQuantity.value = qty;
    updateMontant();
};

const onQuantityInput = () => {
    // Empêcher valeurs < 10
    if (jetonQuantity.value < 10) {
        jetonQuantity.value = 10;
    }
    updateMontant();
};

const acheterJetons = async () => {
    serviceError.value = !selectedService.value;

    if (!isFormValid.value) {
        toast.error('Veuillez remplir tous les champs correctement.');
        return;
    }

    loading.value = true;
    try {
        const res = await apiClient.post('/acheter-jetons', {
            nombre_jetons: jetonQuantity.value,
            payment_service: selectedService.value,
            phone_number: phoneNumber.value,
        });
        toast.success(res.data.message);
        emit('purchased', jetonQuantity.value);
        emit('close');
    } catch (e: any) {
        if (e.response && e.response.data) {
            const errorData = e.response.data;
            toast.error(
                `Erreur: ${errorData.error_message || 'Achat échoué'}. Détails: ${errorData.details || 'Aucun détail.'
                }`
            );
        } else {
            toast.error("Erreur lors de l'achat. Veuillez réessayer.");
        }
        console.error(e);
    } finally {
        loading.value = false;
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
</style>
