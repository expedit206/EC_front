<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/Auth';

const authStore = useAuthStore();
const router = useRouter();
const user = authStore.user;

const navLinks = [
    { to: '/', label: 'Accueil', icon: 'fa-home', badge: 0 },
    ...(user
        ? [
            { to: '/profil', label: 'Profil', icon: 'fa-user', badge: 0 },
            ...(user.commercant
                ? [{ to: '/commercant', label: 'Espace Commerçant', icon: 'fa-store-alt', badge: 0 }]
                : []),
            { to: '/parrainage', label: 'Parrainage', icon: 'fa-users', badge: 0 },
            { to: '/commandes', label: 'Commandes', icon: 'fa-shopping-cart', badge: 0 },
            { to: '/abonnements', label: 'Abonnements', icon: 'fa-star', badge: 0 },
        ]
        : [
            { to: '/login', label: 'Connexion', icon: 'fa-sign-in-alt', badge: 0 },
            { to: '/register', label: 'Inscription', icon: 'fa-user-plus', badge: 0 },
        ]),
];

const logout = () => {
    authStore.logout();
    router.push({ name: 'login' });
};
</script>

<template>
    <header class="bg-[var(--espace-vert)] text-[var(--espace-blanc)] fixed top-0 left-0 w-full z-50 shadow-md">
        <div class="container px-4 sm:px-6 py-2 flex justify-between items-center">
            <!-- Logo et titre -->
            <div class="flex items-center justify-between gap-10 sm:gap-6 w-full">
                <!-- <div> -->
                <span class="flex items-center  gap-2 sm:gap-6">

                    <RouterLink to="/" aria-label="Retour à l'accueil">
                        <div class="bg-[var(--espace-blanc)] rounded-full p-1">
                            <img src="/src/assets/images/logo.png" alt="Logo Espace Cameroun"
                                class="h-8 w-8 sm:h-10 sm:w-10 object-contain transition-transform duration-300 hover:scale-105" />
                        </div>
                    </RouterLink>
                    <h1 class="text-lg sm:text-xl font-bold font-poppins text-[var(--espace-blanc)]">
                        Espace Cameroun
                    </h1>
                </span>
                <!-- </div> -->
                <RouterLink to="/parametres" aria-label="Paramètres"
                    class="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 text-[var(--espace-blanc)] hover:text-[var(--espace-or)] transition-colors duration-300">
                    <i class="fas fa-cog text-base sm:text-lg"></i>
                </RouterLink>
            </div>

            <!-- Navigation Desktop -->
            <nav class="hidden sm:flex items-center space-x-4 sm:space-x-6 font-poppins text-sm sm:text-base">
                <RouterLink v-for="link in navLinks" :key="link.to" :to="link.to"
                    class="hover:text-[var(--espace-or)] flex items-center gap-1 sm:gap-2 transition-colors duration-300"
                    active-class="text-[var(--espace-or)]">
                    <i class="fas" :class="link.icon"></i>
                    {{ link.label }}
                </RouterLink>
                <button v-if="user" @click="logout"
                    class="hover:text-[var(--espace-or)] flex items-center gap-1 sm:gap-2 transition-colors duration-300">
                    <i class="fas fa-sign-out-alt"></i>
                    Déconnexion
                </button>
            </nav>
        </div>
    </header>

    <!-- Navigation Mobile (barre inférieure, icônes uniquement) -->
    <nav
        class="sm:hidden fixed bottom-0 w-full left-0 bg-[var(--espace-vert)] text-[var(--espace-blanc)] shadow-md z-50">
        <div class="flex justify-around items-center py-1">
            <router-link v-for="link in navLinks" :key="link.to" :to="link.to" :aria-label="link.label"
                class="relative flex items-center justify-center w-10 h-10 hover:text-[var(--espace-or)] transition-colors duration-300"
                active-class="text-[var(--espace-or)]">
                <i class="fas text-xl" :class="link.icon"></i>
                <span v-if="link.badge > 0"
                    class="absolute top-0 right-0 bg-[var(--espace-or)] text-[var(--espace-vert)] text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {{ link.badge }}
                </span>
            </router-link>
            <button v-if="user" @click="logout" :aria-label="'Déconnexion'"
                class="relative flex items-center justify-center w-10 h-10 hover:text-[var(--espace-or)] transition-colors duration-300">
                <i class="fas fa-sign-out-alt text-xl"></i>
            </button>
        </div>
    </nav>
</template>

<style scoped>
:root {
    --espace-vert: #14532d;
    --espace-or: #facc15;
    --espace-blanc: #ffffff;
}

.font-poppins {
    font-family: 'Poppins', sans-serif;
}
</style>