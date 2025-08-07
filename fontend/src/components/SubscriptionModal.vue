<template>
    <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-md shadow-lg transform transition-all duration-300">
            <h2 class="text-2xl font-semibold text-[var(--espace-vert)] mb-4">Passez à Premium</h2>
            <p class="text-[var(--espace-gris)] mb-6">Déverrouillez des fonctionnalités avancées pour faire décoller
                votre business !</p>
            <div class="space-y-4">
                <!-- Champ pour le numéro de téléphone -->
                <input v-model="phoneNumber" type="tel" placeholder="Entrez votre numéro (ex: 696428651)"
                    class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--espace-vert)]" />

                <!-- Sélection du service de paiement -->
                <select v-model="selectedService"
                    class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--espace-vert)]"
                    :class="{ 'border-red-500': !selectedService }">
                    <option value="" disabled>Sélectionnez un service</option>
                    <option value="ORANGE">Orange Money</option>
                    <option value="MTN">MTN Mobile Money</option>
                    <option value="AIRTEL">Airtel Money</option>
                </select>

                <!-- Options d'abonnement -->
                <button @click="upgrade('monthly', selectedService)" :disabled="!selectedService"
                    class="w-full bg-[var(--espace-vert)] text-white p-3 rounded-lg hover:bg-[var(--espace-or)] hover:text-[var(--espace-vert)] transition"
                    :class="{ 'opacity-50 cursor-not-allowed': !selectedService }">
                    Mensuel - 5000 FCFA
                </button>
                <button @click="upgrade('yearly', selectedService)" :disabled="!selectedService"
                    class="w-full bg-[var(--espace-vert)] text-white p-3 rounded-lg hover:bg-[var(--espace-or)] hover:text-[var(--espace-vert)] transition"
                    :class="{ 'opacity-50 cursor-not-allowed': !selectedService }">
                    Annuel - 50000 FCFA (Économie !)
                </button>
            </div>
            <button @click="$emit('close')" class="mt-4 text-[var(--espace-gris)] hover:text-[var(--espace-vert)]">
                Fermer
            </button>
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
const selectedService = ref<string>('');
const phoneNumber = ref<string>(''); // Champ pour le numéro

const upgrade = async (type: string, service: string) => {
    if (!service) {
        toast.error('Veuillez sélectionner un service de paiement.');
        return;
    }
    if (!phoneNumber.value) {
        toast.error('Veuillez entrer votre numéro de téléphone.');
        return;
    }

    try {
        const res = await apiClient.post('/upgrade-to-premium', {
            subscription_type: type,
            payment_service: service,
            phone_number: phoneNumber.value, // Transmission du numéro au backend
        });
        console.log(response.data.message);
        
        toast.success(res.data.message);
        emit('upgraded');
        emit('close');
    } catch (e) {
        console.log(e);
        
        toast.error(e.response?.data?.message || 'Erreur lors de la mise à niveau');
        console.error(e);
    }
};
</script>

<style scoped>
/* Transitions modales */
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

/* Input et select modernisés */
input[type="tel"],
select {
    background-color: #f9fafb;
    border: 1px solid #d1d5db;
    font-size: 0.95rem;
    border-radius: 0.75rem;
    padding: 0.75rem 1rem;
    transition: all 0.3s ease;
}

input[type="tel"]:focus,
select:focus {
    border-color: var(--espace-vert);
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.2);
    /* vert clair */
}

/* Boutons de paiement */
button {
    font-weight: 600;
    font-size: 1rem;
    border-radius: 0.75rem;
    transition: all 0.3s ease;
}

/* Couleur spéciale au hover */
button:hover {
    transform: translateY(-1px);
}

/* Bouton de fermeture */
button.mt-4 {
    font-size: 0.9rem;
    font-weight: 500;
    transition: color 0.2s ease;
}

/* Red border si service non sélectionné */
.border-red-500 {
    border-color: #ef4444 !important;
}

/* Amélioration de la boîte modale */
div[class*="bg-white"] {
    border-radius: 1rem;
    box-shadow: 0 20px 35px rgba(0, 0, 0, 0.08);
}

/* Arrière-plan fondu de la modale */
div[class*="bg-black"] {
    backdrop-filter: blur(2px);
}
</style>