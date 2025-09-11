<!-- resources/js/views/PublicProfile.vue -->
<template>
    <div class="min-h-screen bg-gray-100 py-8 sm:px-6">
        <div class="container mx-auto max-w-3xl bg-white rounded-lg shadow-md p-6">
            <!-- En-tête du profil -->
            <div class="flex flex-col sm:flex-row items-center gap-6 mb-6">
                <!-- Photo de profil -->
                <div class="relative">
                    <img v-if="profile?.photo" :src="`http://localhost:8000/storage/${profile?.photo}`"
                        alt="Photo de profil"
                        class="w-24 h-24 rounded-full object-cover border-2 border-[var(--espace-vert)]" />
                    <div v-else
                        class="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500"
                        :style="{ background: `${profile?.niveaux_users?.at(-1)?.parrainage_niveau?.couleur || '#0af'}` }">
                        <i class="fas fa-user-circle text-5xl"></i>
                    </div>
                    <i v-if="profile?.premium"
                        class="fas fa-crown text-yellow-400 absolute -top-2 -right-2 text-xl p-1 rounded-full"></i>
                </div>

                <!-- Détails de base -->
                <div class="flex-1">
                    <h1 class="text-3xl font-bold flex items-center gap-2"
                        :style="{ color: `${profile?.niveaux_users?.at(-1)?.parrainage_niveau?.couleur || '#0af'}` }">
                        {{ profile?.nom }}
                        <span v-if="profile?.premium"
                            class="text-white text-sm px-2 py-1 rounded-full uppercase font-semibold"
                            :style="{ background: `${profile?.niveaux_users?.at(-1)?.parrainage_niveau?.couleur || '#0af'}` }">
                            Premium
                        </span>
                    </h1>
                    <p class="text-gray-600">Statut : {{ profile?.commercant ? 'Commerçant' : 'Utilisateur' }}</p>
                    <p v-if="profile?.subscription_ends_at" class="text-sm text-gray-500">
                        Abonnement Premium jusqu'au {{ new Date(profile?.subscription_ends_at).toLocaleDateString() }}
                    </p>
                    <p class="text-gray-600">Ville : {{ profile?.ville }}</p>
                    <p class="text-gray-600">Téléphone : {{ profile?.telephone }}</p>
                    <!-- <p class="text-gray-600">Jetons : {{ profile?.jetons }}</p>
                    <p class="text-gray-600">Solde : {{ profile?.solde }} XAF</p> -->
                </div>
                <div class="mt-6 flex justify-center">
                    <button @click="goToChat"
                        class="bg-[var(--espace-vert)] text-white px-4 py-2 rounded-md font-semibold hover:bg-[var(--espace-or)] hover:text-[var(--espace-vert)]">
                        <i class="fas fa-comments mr-2"></i> Discuter
                    </button>
                </div>
            </div>

            <!-- Bouton pour le chat -->

            <!-- Message simple -->
            <div class="mt-6 text-center">
                <p class="text-gray-700">Ce profil affiche les informations publiques de l'utilisateur.</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import apiClient from "../api/index";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const profile = ref<any>(null);

const fetchProfile = async () => {
    try {
        const response = await apiClient.get(`/profile/public/${route.params.id}`);
        profile.value = response.data;
    } catch (error : any) {
        if (error.response?.data?.message == 'Unauthenticated.') {
            router.push('login')
        }

        toast.error("Erreur lors de la récupération du profil.");
        console.error(error);
    }
};

const goToChat = () => {
    if (profile.value?.id) {
        router.push({ name: "messages", params: { receiverId: profile.value.id } });
    } else {
        toast.error("Impossible d'accéder au chat. Profil invalide.");
    }
};

onMounted(() => {
    fetchProfile();
});
</script>

<style scoped>
:root {
    --espace-vert: #14532d;
    --espace-or: #facc15;
    --espace-blanc: #ffffff;
    --espace-gris: #6b7280;
}
</style>