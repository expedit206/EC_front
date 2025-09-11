    <script setup lang="ts">
    import { ref } from 'vue';
    import { useRouter } from 'vue-router';
    import { useToast } from 'vue-toastification';
    import { useAuthStore } from '../../stores/Auth';
    import FormField from '../../components/Form.vue';
    import apiClient from '../../api/index';
    import axios from 'axios';


    const credentials = ref({
        login: '',
        mot_de_passe: '',
    });

    const errors = ref<{
        login?: string;
        mot_de_passe?: string;
    }>({});

    const router = useRouter();
    const toast = useToast();
    const authStore = useAuthStore();


    const isLoading = ref(false);


    const login = async () => {
        try {
            isLoading.value = true; // activation du loader
            await authStore.login({
                login: credentials.value.login,
                mot_de_passe: credentials.value.mot_de_passe,
            })

            toast.success('Connexion réussie !');
            // router.push(authStore.user?.commercant ? { name: 'commercant' } : { name: 'profil' });
            router.push( { name: 'home' });
        } catch (error: any) {
            console.error('Erreur lors de la connexion:', error);
            const message = error.message || 'Erreur lors de la connexion. Veuillez vérifier vos informations.';
            toast.error(message);
            if (error.response?.status === 422) {
                errors.value = error.response.data.errors || {};
            }
        }finally{
            isLoading.value = false; // désactive le loader

        }
    };
    </script>

    <template>
        <div class="overflow-y-scroll  flex items-center justify-center px-4 py-4">
            <div class="w-full max-w-lg bg-gray-30 rounded-2xl shadow-xl p-6 sm:p-10">
                <h1 class="text-3xl sm:text-4xl font-bold text-center text-[var(--espace-vert)] mb-6">
                    <i class="fas fa-sign-in-alt mr-2 text-[var(--espace-or)]"></i> Connexion
                </h1>
                <p class="text-center text-sm sm:text-base text-gray-600 mb-6">
                    Connectez-vous à <strong>Espace Cameroun</strong> pour accéder à vos achats et votre espace
                    commerçant.
                </p>
                <form @submit.prevent="login" class="space-y-5 ">
                    <FormField label="Email ou Téléphone" icon="fa-envelope" v-model="credentials.login" type="text"
                        required :error="errors.login" />
                    <FormField label="Mot de passe" icon="fa-lock" v-model="credentials.mot_de_passe" type="password"
                        required :error="errors.mot_de_passe" />
               
                    <button type="submit" :disabled="isLoading"
                        class="w-full bg-[var(--espace-or)] text-[var(--espace-vert)] font-semibold p-3 rounded-xl hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] transition flex items-center justify-center shadow-md disabled:opacity-60 disabled:cursor-not-allowed">
                        <i v-if="isLoading" class="fas fa-spinner fa-spin mr-2"></i>
                        <i v-else class="fas fa-sign-in-alt mr-2"></i>
                        <span>{{ isLoading ? 'Connexion...' : 'Se connecter' }}</span>
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