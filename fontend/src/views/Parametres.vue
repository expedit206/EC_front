<!-- src/views/Parametres.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/Auth';
import { useToast } from 'vue-toastification';
import FormField from '../components/FormField.vue';
import Loader from '../components/Loader.vue';
import apiClient from '../api';
import { watch } from 'vue';

const isLoading = ref(false);
const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();

const user = authStore.user;
const activeSection = ref('profile'); // Section active (profile, security, notifications, links)
const profileForm = ref({
    nom: user?.nom || '',
    email: user?.email || '',
    telephone: user?.telephone || '',
    ville: user?.ville || '',
});
const passwordForm = ref({
    current_password: '',
    new_password: '',
    confirm_password: '',
});
const notifications = ref({
    email_notifications: user?.email_notifications || false,
    sms_notifications: user?.sms_notifications || false,
});
const passwordStrength = ref(''); // Force du mot de passe

const settingsLinks = computed(() => [
    ...(user?.commercant
        ? [{ to: '/commercant', label: 'Espace Commerçant', icon: 'fa-store-alt', description: 'Gérez votre boutique et vos produits' }]
        : []),
    { to: '/parrainage', label: 'Parrainage', icon: 'fa-users', description: 'Invitez des amis et gagnez des récompenses' },
    { to: '/abonnements', label: 'Abonnements', icon: 'fa-star', description: 'Gérez vos abonnements premium' },
    { to: '/collaborations', label: 'Collaborations', icon: 'fa-handshake', description: 'Gérez vos collaborations sur des produits' },
]);

const updateProfile = async () => {
    isLoading.value = true;
    try {
        await apiClient.put('/user/profile', profileForm.value);
        authStore.user = { ...authStore.user, ...profileForm.value };
        localStorage.setItem('user', JSON.stringify(authStore.user));
        toast.success('Profil mis à jour avec succès', { timeout: 3000 });
    } catch (error: any) {
        toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour du profil');
    } finally {
        isLoading.value = false;
    }
};

const updatePassword = async () => {
    isLoading.value = true;
    try {
        if (passwordForm.value.new_password !== passwordForm.value.confirm_password) {
            toast.error('Les mots de passe ne correspondent pas');
            return;
        }
        if (passwordStrength.value === 'weak') {
            toast.error('Le mot de passe est trop faible. Utilisez au moins 8 caractères avec des lettres, chiffres et symboles.');
            return;
        }
        await apiClient.put('/user/password', passwordForm.value);
        toast.success('Mot de passe mis à jour avec succès', { timeout: 3000 });
        passwordForm.value = { current_password: '', new_password: '', confirm_password: '' };
        passwordStrength.value = '';
    } catch (error: any) {
        toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour du mot de passe');
    } finally {
        isLoading.value = false;
    }
};

const updateNotifications = async () => {
    isLoading.value = true;
    try {
        await apiClient.put('/user/notifications', notifications.value);
        authStore.user = { ...authStore.user, ...notifications.value };
        localStorage.setItem('user', JSON.stringify(authStore.user));
        toast.success('Préférences de notification mises à jour', { timeout: 3000 });
    } catch (error: any) {
        toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour des notifications');
    } finally {
        isLoading.value = false;
    }
};

const logout = () => {
    authStore.logout();
    router.push({ name: 'login' });
};

// Calculer la force du mot de passe
const checkPasswordStrength = () => {
    const password = passwordForm.value.new_password;
    if (password.length === 0) {
        passwordStrength.value = '';
    } else if (password.length < 8 || !/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
        passwordStrength.value = 'weak';
    } else if (!/[!@#$%^&*]/.test(password)) {
        passwordStrength.value = 'medium';
    } else {
        passwordStrength.value = 'strong';
    }
};

// Mettre à jour la force du mot de passe en temps réel
watch(() => passwordForm.value.new_password, checkPasswordStrength);
</script>

<template>
    <Loader :isLoading="isLoading" />
    <div class="min-h-screen bg-gray-100 pt-16 pb-20 px-4 sm:px-6 flex flex-col lg:flex-row gap-4">
        <!-- Sidebar (Desktop) -->
        <aside class="hidden lg:block w-full max-w-xs bg-[var(--espace-blanc)] rounded-lg shadow-md p-4">
            <h2 class="text-xl font-semibold text-[var(--espace-vert)] mb-4 font-poppins">Paramètres</h2>
            <nav class="space-y-2">
                <button v-for="section in [
                    { id: 'profile', label: 'Profil', icon: 'fa-user' },
                    { id: 'security', label: 'Sécurité', icon: 'fa-lock' },
                    { id: 'notifications', label: 'Notifications', icon: 'fa-bell' },
                    { id: 'links', label: 'Autres options', icon: 'fa-cog' },
                    { id: 'logout', label: 'Déconnexion', icon: 'fa-sign-out-alt' },
                ]" :key="section.id" @click="section.id === 'logout' ? logout() : (activeSection = section.id)"
                    class="w-full flex items-center gap-3 p-3 rounded-lg transition-colors duration-300" :class="{
                        'bg-[var(--espace-vert)] text-[var(--espace-blanc)]': activeSection === section.id,
                        'text-[var(--espace-vert)] hover:bg-[var(--espace-or)] hover:text-[var(--espace-vert)]': activeSection !== section.id,
                    }">
                    <i class="fas" :class="section.icon"></i>
                    <span class="font-poppins">{{ section.label }}</span>
                </button>
            </nav>
        </aside>

        <!-- Main content -->
        <main class="flex-1 bg-[var(--espace-blanc)] rounded-lg shadow-md p-4 sm:p-6">
            <!-- Tabs (Mobile) -->
            <div class="lg:hidden mb-4">
                <div class="flex overflow-x-auto space-x-2 border-b border-[var(--espace-gris)]">
                    <button v-for="section in [
                        { id: 'profile', label: 'Profil', icon: 'fa-user' },
                        { id: 'security', label: 'Sécurité', icon: 'fa-lock' },
                        { id: 'notifications', label: 'Notifications', icon: 'fa-bell' },
                        { id: 'links', label: 'Autres', icon: 'fa-cog' },
                        { id: 'logout', label: 'Déconnexion', icon: 'fa-sign-out-alt' },
                    ]" :key="section.id" @click="section.id === 'logout' ? logout() : (activeSection = section.id)"
                        class="flex items-center gap-2 px-4 py-2 text-sm font-medium font-poppins transition-colors duration-300"
                        :class="{
                            'border-b-2 border-[var(--espace-or)] text-[var(--espace-vert)]': activeSection === section.id,
                            'text-[var(--espace-gris)] hover:text-[var(--espace-vert)]': activeSection !== section.id,
                        }">
                        <i class="fas" :class="section.icon"></i>
                        {{ section.label }}
                    </button>
                </div>
            </div>

            <!-- Section Profil -->
            <Transition name="slide">
                <section v-if="activeSection === 'profile'" class="space-y-6">
                    <h2 class="text-2xl font-bold text-[var(--espace-vert)] font-poppins">Profil</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Form -->
                        <form @submit.prevent="updateProfile" class="space-y-4">
                            <FormField label="Nom" icon="fa-user" v-model="profileForm.nom" type="text" required
                                placeholder="Votre nom" />
                            <FormField label="Email" icon="fa-envelope" v-model="profileForm.email" type="email"
                                placeholder="Votre email" />
                            <FormField label="Téléphone" icon="fa-phone" v-model="profileForm.telephone" type="tel"
                                required placeholder="Votre numéro de téléphone" />
                            <FormField label="Ville" icon="fa-city" v-model="profileForm.ville" type="text" required
                                placeholder="Votre ville" />
                            <button type="submit"
                                class="w-full bg-[var(--espace-or)] text-[var(--espace-vert)] font-semibold px-4 py-2 rounded-lg hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] transition-transform hover:scale-105">
                                Mettre à jour
                            </button>
                        </form>
                        <!-- Preview -->
                        <div class="bg-gray-50 p-4 rounded-lg shadow-sm">
                            <h3 class="text-lg font-semibold text-[var(--espace-vert)] mb-2 font-poppins">Aperçu</h3>
                            <div class="flex items-center gap-4 mb-4">
                                <img :src="user?.commercant?.photo_url || 'https://via.placeholder.com/50'"
                                    alt="Photo de profil" class="w-12 h-12 rounded-full object-cover" />
                                <div>
                                    <p class="text-[var(--espace-vert)] font-semibold">{{ profileForm.nom || 'Nonni' }}</p>
                                    <p class="text-sm text-[var(--espace-gris)]">{{ profileForm.email || 'Non défini' }}
                                    </p>
                                </div>
                            </div>
                            <p class="text-sm text-[var(--espace-gris)]">Téléphone: {{ profileForm.telephone || 'Nonni' }}</p>
                            <p class="text-sm text-[var(--espace-gris)]">Ville: {{ profileForm.ville || 'Non défini' }}
                            </p>
                        </div>
                    </div>
                </section>
            </Transition>

            <!-- Section Sécurité -->
            <Transition name="slide">
                <section v-if="activeSection === 'security'" class="space-y-6">
                    <h2 class="text-2xl font-bold text-[var(--espace-vert)] font-poppins">Sécurité</h2>
                    <form @submit.prevent="updatePassword" class="space-y-4">
                        <FormField label="Mot de passe actuel" icon="fa-lock" v-model="passwordForm.current_password"
                            type="password" required placeholder="Mot de passe actuel" />
                        <FormField label="Nouveau mot de passe" icon="fa-lock" v-model="passwordForm.new_password"
                            type="password" required placeholder="Nouveau mot de passe"
                            @input="checkPasswordStrength" />
                        <div v-if="passwordStrength" class="text-sm" :class="{
                            'text-red-500': passwordStrength === 'weak',
                            'text-yellow-500': passwordStrength === 'medium',
                            'text-green-500': passwordStrength === 'strong',
                        }">
                            Force du mot de passe : {{ passwordStrength === 'weak' ? 'Faible' : passwordStrength ===
                            'medium' ? 'Moyen' : 'Fort' }}
                        </div>
                        <FormField label="Confirmer le nouveau mot de passe" icon="fa-lock"
                            v-model="passwordForm.confirm_password" type="password" required
                            placeholder="Confirmer le mot de passe" />
                        <button type="submit"
                            class="w-full bg-[var(--espace-or)] text-[var(--espace-vert)] font-semibold px-4 py-2 rounded-lg hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] transition-transform hover:scale-105">
                            Changer le mot de passe
                        </button>
                    </form>
                </section>
            </Transition>

            <!-- Section Notifications -->
            <Transition name="slide">
                <section v-if="activeSection === 'notifications'" class="space-y-6">
                    <h2 class="text-2xl font-bold text-[var(--espace-vert)] font-poppins">Notifications</h2>
                    <div class="space-y-4">
                        <label class="flex items-center gap-3 cursor-pointer">
                            <input v-model="notifications.email_notifications" type="checkbox"
                                class="h-5 w-5 text-[var(--espace-vert)] rounded transition" />
                            <span class="text-sm text-[var(--espace-gris)] font-poppins">Recevoir les notifications par
                                email</span>
                        </label>
                        <label class="flex items-center gap-3 cursor-pointer">
                            <input v-model="notifications.sms_notifications" type="checkbox"
                                class="h-5 w-5 text-[var(--espace-vert)] rounded transition" />
                            <span class="text-sm text-[var(--espace-gris)] font-poppins">Recevoir les notifications par
                                SMS</span>
                        </label>
                        <button @click="updateNotifications"
                            class="w-full bg-[var(--espace-or)] text-[var(--espace-vert)] font-semibold px-4 py-2 rounded-lg hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] transition-transform hover:scale-105">
                            Mettre à jour
                        </button>
                    </div>
                </section>
            </Transition>

            <!-- Section Autres options -->
            <Transition name="slide">
                <section v-if="activeSection === 'links'" class="space-y-6">
                    <h2 class="text-2xl font-bold text-[var(--espace-vert)] font-poppins">Autres options</h2>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <RouterLink v-for="link in settingsLinks" :key="link.to" :to="link.to"
                            class="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] transition-transform hover:scale-105">
                            <i class="fas" :class="link.icon"></i>
                            <div>
                                <h3 class="text-base font-medium font-poppins">{{ link.label }}</h3>
                                <p class="text-sm text-[var(--espace-gris)]">{{ link.description }}</p>
                            </div>
                        </RouterLink>
                    </div>
                </section>
            </Transition>
        </main>
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

/* Animation de transition pour les sections */
.slide-enter-active,
.slide-leave-active {
    transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
    transform: translateX(20px);
    opacity: 0;
}

/* Animation pour les boutons et cartes */
button:hover,
a:hover {
    transform: scale(1.05);
    transition: transform 0.2s ease, background-color 0.3s ease;
}

/* Style pour la sidebar */
aside {
    position: sticky;
    top: 80px;
    /* Ajuster en fonction de la hauteur de AppHeader */
    height: fit-content;
}

/* Style pour les tabs sur mobile */
@media (max-width: 1023px) {
    .flex.overflow-x-auto {
        scrollbar-width: thin;
        scrollbar-color: var(--espace-or) var(--espace-gris);
    }
}
</style>