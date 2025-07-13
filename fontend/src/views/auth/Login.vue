<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '../../stores/Auth';
import FormField from '../../components/FormField.vue'; 

const form = ref({
    login: '',
    mot_de_passe: '',
    remember: false,
});

const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();
const errors = ref<{ login?: string; mot_de_passe?: string }>({});
const processing = ref<boolean>(false);

const login = async () => {
    processing.value = true;
    try {
        await authStore.login(form.value);
        toast.success('Connexion réussie !');
        router.push({ name: 'dashboard' });
    } catch (error: any) {
        console.error('Erreur lors de la connexion:', error);
        const message = error.response?.data?.message || 'Erreur lors de la connexion. Veuillez vérifier vos informations.';
        toast.error(message);
        if (error.response?.status === 422) {
            errors.value = error.response.data.errors;
        }
    } finally {
        processing.value = false;
    }
};
</script>

<template>
    <div class="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8"
        :style="{ background: 'url(/src/assets/images/bginsc.jpg) center/cover' }">
        <div class="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 sm:p-10">
            <h1 class="text-3xl sm:text-4xl font-bold text-center text-[var(--espace-vert)] mb-6">
                <i class="fas fa-sign-in-alt mr-2 text-[var(--espace-or)]"></i> Se connecter
            </h1>
            <p class="text-center text-sm sm:text-base text-gray-600 mb-6">
                Connectez-vous à <strong>Espace Cameroun</strong> pour accéder à votre compte et profitez de nos
                services.
            </p>
            <form @submit.prevent="login" class="space-y-5">
                <FormField label="Email ou numéro de téléphone" icon="fa-envelope" v-model="form.login" type="text"
                    required placeholder="email@example.com ou +237 6XX XXX XXX" :error="errors.login" />
                <FormField label="Mot de passe" icon="fa-lock" v-model="form.mot_de_passe" type="password" required
                    placeholder="Mot de passe" :error="errors.mot_de_passe" />
                <div class="flex items-center justify-between">
                    <label class="flex items-center space-x-3">
                        <input type="checkbox" v-model="form.remember" id="remember"
                            class="form-checkbox text-[var(--espace-or)]" />
                        <span class="text-sm text-[var(--espace-vert)]">Se souvenir de moi</span>
                    </label>
                </div>
                <button type="submit"
                    class="w-full bg-[var(--espace-or)] text-[var(--espace-vert)] font-semibold p-3 rounded-xl hover:bg-[var(--espace-vert)] hover:text-white transition flex items-center justify-center shadow-md"
                    :disabled="processing">
                    <i v-if="processing" class="fas fa-spinner fa-spin mr-2"></i>
                    <i v-else class="fas fa-sign-in-alt mr-2"></i> Se connecter
                </button>
            </form>
            <p class="text-center text-sm text-gray-600 mt-6">
                Vous n'avez pas de compte ?
                <router-link to="/register" class="text-[var(--espace-vert)] font-medium hover:underline">
                    S'inscrire ici
                </router-link>
            </p>
            <p class="text-center text-xs text-gray-400 mt-4">
                <router-link to="/forgot-password" class="hover:underline text-[var(--espace-vert)]">
                    Mot de passe oublié ?
                </router-link>
            </p>
        </div>
    </div>
</template>

<style scoped>
:root {
    --espace-vert: #14532d;
    --espace-or: #facc15;
}

.font-poppins {
    font-family: 'Poppins', sans-serif;
}
</style>