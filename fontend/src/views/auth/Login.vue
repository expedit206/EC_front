<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '../../stores/Auth';
import FormField from '../../components/FormField.vue';

const credentials = ref({
    login: '',
    mot_de_passe: '',
});

const errors = ref<{
    email?: string;
    mot_de_passe?: string;
}>({});

const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();

const login = async () => {
    try {
        await authStore.login({
            login: credentials.value.login,
            mot_de_passe: credentials.value.mot_de_passe,
        });
        toast.success('Connexion réussie !');
        router.push(authStore.user.commercant ? { name: 'commercant' } : { name: 'profil' });
    } catch (error: any) {
        console.error('Erreur lors de la connexion:', error);
        const message = error.response?.data?.message || 'Erreur lors de la connexion. Veuillez vérifier vos informations.';
        toast.error(message);
        if (error.response?.status === 422) {
            errors.value = error.response.data.errors || {};
        }
    }
};
</script>

<template>
    <div class="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8"
        >
        <div class="w-full max-w-lg bg-[rgba(255,255,255,0.85)] rounded-2xl shadow-xl p-6 sm:p-10">
            <h1 class="text-3xl sm:text-4xl font-bold text-center text-[var(--espace-vert)] mb-6">
                <i class="fas fa-sign-in-alt mr-2 text-[var(--espace-or)]"></i> Connexion
            </h1>
            <p class="text-center text-sm sm:text-base text-gray-600 mb-6">
                Connectez-vous à <strong>Espace Cameroun</strong> pour accéder à vos achats et votre espace commerçant.
            </p>
            <form @submit.prevent="login" class="space-y-5">
                <FormField label="Email" icon="fa-envelope" v-model="credentials.login" type="email" required
                    :error="errors.email" />
                <FormField label="Mot de passe" icon="fa-lock" v-model="credentials.mot_de_passe" type="password"
                    required :error="errors.mot_de_passe" />
                <button type="submit"
                    class="w-full bg-[var(--espace-or)] text-[var(--espace-vert)] font-semibold p-3 rounded-xl hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] transition flex items-center justify-center shadow-md">
                    <i class="fas fa-sign-in-alt mr-2"></i> Se connecter
                </button>
            </form>
            <p class="text-center text-sm text-gray-600 mt-6">
                Pas de compte ?
                <router-link to="/register"
                    class="text-[var(--espace-vert)] font-medium hover:text-[var(--espace-or)] hover:underline">
                    Inscrivez-vous ici
                </router-link>
            </p>
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