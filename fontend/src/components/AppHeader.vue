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
    <header class="bg-[var(--espace-vert)] left-0  text-[var(--espace-blanc)] fixed top-0 w-full z-50 shadow-md">
        <div class="container mx-auto px-4 py-2 flex justify-between items-center">
            <!-- Logo et icône de paramètres -->
            <div class="flex items-center gap-6">
                <h1 class="text-2xl font-bold font-poppins flex items-center gap-2">
                    <i class="fas fa-store text-[var(--espace-or)]"></i> Espace Cameroun
                </h1>
                <router-link to="/parametres" aria-label="Paramètres"
                    class="flex items-center justify-center w-10 h-10 hover:text-[var(--espace-or)] transition-colors duration-300">
                    <i class="fas fa-cog text-xl"></i>
                </router-link>
            </div>

            <!-- Navigation Desktop -->
            <nav class="hidden sm:flex items-center space-x-6 font-poppins">
                <router-link v-for="link in navLinks" :key="link.to" :to="link.to"
                    class="hover:text-[var(--espace-or)] flex items-center gap-2 transition-colors duration-300"
                    active-class="text-[var(--espace-or)]">
                    <i class="fas" :class="link.icon"></i> {{ link.label }}
                </router-link>
                <button v-if="user" @click="logout"
                    class="hover:text-[var(--espace-or)] flex items-center gap-2 transition-colors duration-300">
                    <i class="fas fa-sign-out-alt"></i> Déconnexion
                </button>
            </nav>
        </div>
    </header>

    <!-- Navigation Mobile (barre inférieure, icônes uniquement) -->
    <nav
        class="sm:hidden fixed bottom-0 w-full left-0 bg-[var(--espace-vert)] text-[var(--espace-blanc)] shadow-md z-50">
        <div class="flex justify-around items-center py-1">
            <router-link v-for="link in navLinks" :key="link.to" :to="link.to" :aria-label="link.label"
                class="relative flex items-center justify-center w-12 h-12 hover:text-[var(--espace-or)] transition-colors duration-300"
                active-class="text-[var(--espace-or)]">
                <i class="fas text-xl" :class="link.icon"></i>
                <span v-if="link.badge > 0"
                    class="absolute top-0 right-0 bg-[var(--espace-or)] text-[var(--espace-vert)] text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {{ link.badge }}
                </span>
            </router-link>
            <button v-if="user" @click="logout" :aria-label="'Déconnexion'"
                class="relative flex items-center justify-center w-12 h-12 hover:text-[var(--espace-or)] transition-colors duration-300">
                <i class="fas fa-sign-out-alt text-2xl"></i>
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