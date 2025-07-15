<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/Auth';

const authStore = useAuthStore();
const router = useRouter();
const user = authStore.user;
const isSettingsMenuOpen = ref(false);

const navLinks = computed(() => [
    { to: '/', label: 'Accueil', icon: 'fa-home', badge: 0 },
    ...(user
        ? [
            { to: '/profil', label: 'Profil', icon: 'fa-user', badge: 0 },
            ...(user.commercant
                ? [{ to: '/commercant/produits', label: 'Mes Produits', icon: 'fa-box-open', badge: 0 }]
                : []),
            { to: '/commandes', label: 'Commandes', icon: 'fa-shopping-cart', badge: 0 },
        ]
        : [
            { to: '/login', label: 'Connexion', icon: 'fa-sign-in-alt', badge: 0 },
            { to: '/register', label: 'Inscription', icon: 'fa-user-plus', badge: 0 },
        ]),
]);

const settingsLinks = computed(() => [
    ...(user
        ? [
            ...(user.commercant
                ? [{ to: '/commercant', label: 'Espace Commerçant', icon: 'fa-store-alt', badge: 0 }]
                : []),
            { to: '/parrainage', label: 'Parrainage', icon: 'fa-users', badge: 0 },
            { to: '/abonnements', label: 'Abonnements', icon: 'fa-star', badge: 0 },
            { to: '/parametres', label: 'Paramètres', icon: 'fa-cog', badge: 0 },
        ]
        : []),
]);

const toggleSettingsMenu = () => {
    isSettingsMenuOpen.value = !isSettingsMenuOpen.value;
};

const logout = () => {
    authStore.logout();
    isSettingsMenuOpen.value = false;
    router.push({ name: 'login' });
};
</script>

<template>
    <header class="bg-[var(--espace-vert)] text-[var(--espace-blanc)] fixed top-0 left-0 w-full z-50 shadow-md">
        <div class="container mx-auto px-4 sm:px-6 py-2 flex justify-between items-center gap-4">
            <!-- Logo et titre -->
            <div class="flex items-center gap-2 sm:gap-3">
                <RouterLink to="/" aria-label="Retour à l'accueil">
                    <div class="bg-[var(--espace-blanc)] rounded-full p-1">
                        <img src="/src/assets/images/logo.png" alt="Logo Espace Cameroun"
                            class="h-8 w-8 sm:h-10 sm:w-10 object-contain transition-transform duration-300 hover:scale-105 shadow-sm hover:shadow-md" />
                    </div>
                </RouterLink>
                <h1 class="text-lg sm:text-xl font-bold font-poppins text-[var(--espace-blanc)]">
                    Espace Cameroun
                </h1>
            </div>

            <!-- Navigation Desktop -->
            <nav class="hidden sm:flex items-center space-x-4 sm:space-x-6 font-poppins text-sm sm:text-base">
                <RouterLink v-for="link in navLinks" :key="link.to" :to="link.to"
                    class="hover:text-[var(--espace-or)] flex items-center gap-1 sm:gap-2 transition-colors duration-300"
                    active-class="text-[var(--espace-or)]">
                    <i class="fas" :class="link.icon"></i>
                    {{ link.label }}
                </RouterLink>
                <div v-if="user" class="relative">
                    <button @click="toggleSettingsMenu" aria-label="Menu Paramètres"
                        class="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 hover:text-[var(--espace-or)] transition-colors duration-300">
                        <i class="fas fa-cog text-base sm:text-lg"></i>
                    </button>
                    <Transition name="fade">
                        <div v-if="isSettingsMenuOpen"
                            class="absolute right-0 mt-2 w-48 bg-[var(--espace-blanc)] text-[var(--espace-vert)] rounded-lg shadow-lg z-50">
                            <RouterLink v-for="link in settingsLinks" :key="link.to" :to="link.to"
                                class="block px-4 py-2 hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] transition-colors duration-200"
                                @click="isSettingsMenuOpen = false">
                                <i class="fas mr-2" :class="link.icon"></i>
                                {{ link.label }}
                            </RouterLink>
                            <button @click="logout"
                                class="w-full text-left px-4 py-2 hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] transition-colors duration-200">
                                <i class="fas fa-sign-out-alt mr-2"></i>
                                Déconnexion
                            </button>
                        </div>
                    </Transition>
                </div>
            </nav>
        </div>
    </header>

    <!-- Navigation Mobile (barre inférieure, icônes uniquement) -->
    <Transition name="slide-up">
        <nav
            class="sm:hidden fixed bottom-0 left-0 w-full bg-[var(--espace-vert)] text-[var(--espace-blanc)] shadow-md z-50">
            <div class="flex justify-around items-center py-2">
                <RouterLink v-for="link in navLinks" :key="link.to" :to="link.to" :aria-label="link.label"
                    class="relative flex items-center justify-center w-10 h-10 hover:text-[var(--espace-or)] transition-colors duration-300"
                    active-class="text-[var(--espace-or)]">
                    <i class="fas text-lg" :class="link.icon"></i>
                    <span v-if="link.badge > 0"
                        class="absolute top-0 right-0 bg-[var(--espace-or)] text-[var(--espace-vert)] text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {{ link.badge }}
                    </span>
                </RouterLink>
                <div v-if="user" class="relative">
                    <button @click="toggleSettingsMenu" aria-label="Menu Paramètres"
                        class="flex items-center justify-center w-10 h-10 hover:text-[var(--espace-or)] transition-colors duration-300">
                        <i class="fas fa-cog text-lg"></i>
                    </button>
                    <Transition name="slide-up">
                        <div v-if="isSettingsMenuOpen"
                            class="absolute bottom-12 left-0 w-full bg-[var(--espace-blanc)] text-[var(--espace-vert)] shadow-lg z-50">
                            <RouterLink v-for="link in settingsLinks" :key="link.to" :to="link.to"
                                class="block px-4 py-2 hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] transition-colors duration-200"
                                @click="isSettingsMenuOpen = false">
                                <i class="fas mr-2" :class="link.icon"></i>
                                {{ link.label }}
                            </RouterLink>
                            <button @click="logout"
                                class="w-full text-left px-4 py-2 hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] transition-colors duration-200">
                                <i class="fas fa-sign-out-alt mr-2"></i>
                                Déconnexion
                            </button>
                        </div>
                    </Transition>
                </div>
            </div>
        </nav>
    </Transition>
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

.slide-up-enter-active,
.slide-up-leave-active {
    transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
    transform: translateY(100%);
    opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>