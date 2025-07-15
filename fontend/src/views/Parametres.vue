<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/Auth';
import { useToast } from 'vue-toastification';
import FormField from '../components/FormField.vue';

const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();

const user = authStore.user;
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

const settingsLinks = computed(() => [
    ...(user?.commercant
        ? [{ to: '/commercant', label: 'Espace Commerçant', icon: 'fa-store-alt', description: 'Gérez votre boutique et vos produits' }]
        : []),
    { to: '/parrainage', label: 'Parrainage', icon: 'fa-users', description: 'Invitez des amis et gagnez des récompenses' },
    { to: '/abonnements', label: 'Abonnements', icon: 'fa-star', description: 'Gérez vos abonnements premium' },
    { to: '/collaborations', label: 'Collaborations', icon: 'fa-handshake', description: 'Gérez vos collaborations sur des produits' },
]);

const updateProfile = async () => {
    try {
        await apiClient.put('/user/profile', profileForm.value);
        authStore.user = { ...authStore.user, ...profileForm.value };
        localStorage.setItem('user', JSON.stringify(authStore.user));
        toast.success('Profil mis à jour avec succès');
    } catch (error: any) {
        toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour du profil');
    }
};

const updatePassword = async () => {
    try {
        if (passwordForm.value.new_password !== passwordForm.value.confirm_password) {
            toast.error('Les mots de passe ne correspondent pas');
            return;
        }
        await apiClient.put('/user/password', passwordForm.value);
        toast.success('Mot de passe mis à jour avec succès');
        passwordForm.value = { current_password: '', new_password: '', confirm_password: '' };
    } catch (error: any) {
        toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour du mot de passe');
    }
};

const updateNotifications = async () => {
    try {
        await apiClient.put('/user/notifications', notifications.value);
        authStore.user = { ...authStore.user, ...notifications.value };
        localStorage.setItem('user', JSON.stringify(authStore.user));
        toast.success('Préférences de notification mises à jour');
    } catch (error: any) {
        toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour des notifications');
    }
};

const logout = () => {
    authStore.logout();
    router.push({ name: 'login' });
};
</script>

<template>
    <div class="min-h-screen bg-gray-100 pt-16 pb-20 px-4 sm:px-6">
        <div class="container mx-auto max-w-3xl">
            <h1 class="text-2xl sm:text-3xl font-bold text-[var(--espace-vert)] mb-8">
                <i class="fas fa-cog mr-2 text-[var(--espace-or)]"></i> Paramètres
            </h1>

            <!-- Section Profil -->
            <section class="bg-[var(--espace-blanc)] rounded-lg shadow-md p-6 mb-6">
                <h2 class="text-xl font-semibold text-[var(--espace-vert)] mb-4">Profil</h2>
                <form @submit.prevent="updateProfile" class="space-y-4">
                    <FormField label="Nom" icon="fa-user" v-model="profileForm.nom" type="text" required />
                    <FormField label="Email" icon="fa-envelope" v-model="profileForm.email" type="email" />
                    <FormField label="Téléphone" icon="fa-phone" v-model="profileForm.telephone" type="tel" required />
                    <FormField label="Ville" icon="fa-city" v-model="profileForm.ville" type="text" required />
                    <button type="submit"
                        class="bg-[var(--espace-or)] text-[var(--espace-vert)] font-semibold px-4 py-2 rounded-lg hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] transition">
                        Mettre à jour le profil
                    </button>
                </form>
            </section>

            <!-- Section Sécurité -->
            <section class="bg-[var(--espace-blanc)] rounded-lg shadow-md p-6 mb-6">
                <h2 class="text-xl font-semibold text-[var(--espace-vert)] mb-4">Sécurité</h2>
                <form @submit.prevent="updatePassword" class="space-y-4">
                    <FormField label="Mot de passe actuel" icon="fa-lock" v-model="passwordForm.current_password"
                        type="password" required />
                    <FormField label="Nouveau mot de passe" icon="fa-lock" v-model="passwordForm.new_password"
                        type="password" required />
                    <FormField label="Confirmer le nouveau mot de passe" icon="fa-lock"
                        v-model="passwordForm.confirm_password" type="password" required />
                    <button type="submit"
                        class="bg-[var(--espace-or)] text-[var(--espace-vert)] font-semibold px-4 py-2 rounded-lg hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] transition">
                        Changer le mot de passe
                    </button>
                </form>
            </section>

            <!-- Section Notifications -->
            <!-- <section class="bg-[var(--espace-blanc)] rounded-lg shadow-md p-6 mb-6">
                <h2 class="text-xl font-semibold text-[var(--espace-vert)] mb-4">Notifications</h2>
                <div class="space-y-4">
                    <label class="flex items-center gap-2">
                        <input v-model="notifications.email_notifications" type="checkbox"
                            class="h-5 w-5 text-[var(--espace-vert)] rounded focus:ring-[var(--espace-vert)]" />
                        <span class="text-sm text-[var(--espace-gris)]">Recevoir les notifications par email</span>
                    </label>
                    <label class="flex items-center gap-2">
                        <input v-model="notifications.sms_notifications" type="checkbox"
                            class="h-5 w-5 text-[var(--espace-vert)] rounded focus:ring-[var(--espace-vert)]" />
                        <span class="text-sm text-[var(--espace-gris)]">Recevoir les notifications par SMS</span>
                    </label>
                    <button @click="updateNotifications"
                        class="bg-[var(--espace-or)] text-[var(--espace-vert)] font-semibold px-4 py-2 rounded-lg hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] transition">
                        Mettre à jour les notifications
                    </button>
                </div>
            </section> -->

            <!-- Section Liens -->
            <section class="bg-[var(--espace-blanc)] rounded-lg shadow-md p-6 mb-6">
                <h2 class="text-xl font-semibold text-[var(--espace-vert)] mb-4">Autres options</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <RouterLink v-for="link in settingsLinks" :key="link.to" :to="link.to"
                        class="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] transition">
                        <i class="fas" :class="link.icon"></i>
                        <div>
                            <h3 class="text-base font-medium">{{ link.label }}</h3>
                            <p class="text-sm text-[var(--espace-gris)]">{{ link.description }}</p>
                        </div>
                    </RouterLink>
                </div>
            </section>

            <!-- Section Déconnexion -->
            <section class="bg-[var(--espace-blanc)] rounded-lg shadow-md p-6">
                <h2 class="text-xl font-semibold text-[var(--espace-vert)] mb-4">Déconnexion</h2>
                <button @click="logout"
                    class="w-full bg-red-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-600 transition">
                    <i class="fas fa-sign-out-alt mr-2"></i> Se déconnecter
                </button>
            </section>
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