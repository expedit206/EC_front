<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/Auth';
import apiClient from '../api/index';

const router = useRouter();
const authStore = useAuthStore();
const jetons = ref(0);

// Récupérer les jetons de l'utilisateur
const fetchJetons = async () => {
    if (authStore.user) {
        try {
            jetons.value = authStore.user.jetons;
            //console.log(jetons.value)
        } catch (error) {
            console.error('Erreur lors de la récupération des jetons:', error);
        }
    }
};

// Mettre à jour les jetons en temps réel via le store
watch(() => authStore.user, () => {
    fetchJetons();
});

// Initialisation au montage
onMounted(() => {
    fetchJetons();
});

// Déconnexion
const logout = () => {
    authStore.logout();
    router.push('/login');
};
</script>

<template>
    <div v-if="authStore.user" class="fixed top-16 right-4 z-50 flex items-center gap-2  rounded-full px-4 py-2">

        <i class="fas fa-coins text-[var(--espace-or)] text-lg"></i>
        <span class="text-sm font-semibold text-[var(--espace-vert)]">
            <router-link to="/jeton-history">
                Jetons : <span class="text-gray-800">{{ jetons }}</span>
            </router-link>
        </span>
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