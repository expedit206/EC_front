<!-- src/views/Register.vue -->
<template>
    <div class="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8"
         :style="{ background: 'url(/src/assets/images/bginsc.jpg) center/cover' }">
        <div class="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 sm:p-10">
            <h1 class="text-3xl sm:text-4xl font-bold text-center text-[var(--espace-vert)] mb-6">
                <i class="fas fa-user-plus mr-2 text-[var(--espace-or)]"></i> Créez votre compte
            </h1>
            <p class="text-center text-sm sm:text-base text-gray-600 mb-6">
                Rejoignez <strong>Espace Cameroun</strong> et profitez d’une expérience d’achat unique. Vos informations
                resteront confidentielles.
            </p>
            <form @submit.prevent="register" class="space-y-5">
                <FormField label="Nom" icon="fa-user" v-model="form.nom" type="text" required />
                <FormField label="Téléphone" icon="fa-phone" v-model="form.telephone" type="tel" required />
                <FormField label="Email (optionnel)" icon="fa-envelope" v-model="form.email" type="email" />
                <FormField label="Ville" icon="fa-city" v-model="form.ville" type="text" required />
                <FormField label="Mot de passe" icon="fa-lock" v-model="form.mot_de_passe" type="password" required />
                <FormField label="Code de parrainage (optionnel)" icon="fa-users" v-model="form.parrain_code" type="text" />
                <button type="submit"
                        class="w-full bg-[var(--espace-or)] text-[var(--espace-vert)] font-semibold p-3 rounded-xl hover:bg-[var(--espace-vert)] hover:text-white transition flex items-center justify-center shadow-md">
                    <i class="fas fa-user-plus mr-2"></i> S'inscrire
                </button>
            </form>
            <p class="text-center text-sm text-gray-600 mt-6">
                Vous avez déjà un compte ?
                <router-link to="/login" class="text-[var(--espace-vert)] font-medium hover:underline">
                    Connectez-vous ici
                </router-link>
            </p>
            <p class="text-center text-xs text-gray-400 mt-4">
                En vous inscrivant, vous acceptez nos
                <a href="/conditions" class="hover:underline text-[var(--espace-vert)]">conditions d'utilisation</a>
                et notre
                <a href="/confidentialite" class="hover:underline text-[var(--espace-vert)]">politique de confidentialité</a>.
            </p>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '../store';
import FormField from '../components/FormField.vue';

const form = ref({
    nom: '',
    telephone: '',
    email: '',
    ville: '',
    mot_de_passe: '',
    parrain_code: '',
});

const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();

const register = async () => {
    try {
        // console.log('Envoi des données d\'inscription:', form.value);
        await authStore.register(form.value);
        toast.success('Inscription réussie !');
        router.push({ name: 'profil' });
    } catch (error) {
        console.error('Erreur lors de l\'inscription dans Register.vue:', {
            message: error.message,
            status: error.status,
            details: error.details,
        });
        toast.error(error.message || 'Erreur lors de l\'inscription. Veuillez vérifier vos informations.');
    }
};
</script>