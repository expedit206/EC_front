<template>
    <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-md shadow-lg transform transition-all duration-300">
            <h2 class="text-2xl font-semibold text-[var(--espace-vert)] mb-4">Passez à Premium</h2>
            <p class="text-[var(--espace-gris)] mb-6">Déverrouillez des fonctionnalités avancées pour faire décoller
                votre business !</p>
            <div class="space-y-4">
                <button @click="upgrade('monthly')"
                    class="w-full bg-[var(--espace-vert)] text-white p-3 rounded-lg hover:bg-[var(--espace-or)] hover:text-[var(--espace-vert)] transition">
                    Mensuel - 5000 FCFA
                </button>
                <button @click="upgrade('yearly')"
                    class="w-full bg-[var(--espace-vert)] text-white p-3 rounded-lg hover:bg-[var(--espace-or)] hover:text-[var(--espace-vert)] transition">
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

const upgrade = async (type: string) => {
    try {
        const res = await apiClient.post('/upgrade-to-premium', { subscription_type: type });
        toast.success(res.data.message);
        emit('upgraded'); // Notifie le parent de la mise à jour
        emit('close'); // Ferme le modal
    } catch (e) {
        toast.error(e.response?.data?.message || 'Erreur lors de la mise à niveau');
        console.error(e);
    }
};
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}
</style>