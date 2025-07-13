<template>
    <header class="bg-[var(--espace-vert)] text-[var(--espace-blanc)] shadow-md">

        <div class="  container mx-auto px-4 py-3 flex justify-between items-center">
            <!-- Logo -->
            <h1 class="text-xl font-bold flex items-center gap-2">
                <i class="fas fa-store"></i> Espace Cameroun
            </h1>

            <!-- Bouton menu mobile -->
            <button class="sm:hidden text-[var(--espace-blanc)] focus:outline-none" @click="menuOpen = !menuOpen">
                <i class="fas" :class="menuOpen ? 'fa-times' : 'fa-bars'"></i>
            </button>

            <!-- Navigation -->
            <nav class="hidden sm:flex items-center space-x-4">
                <router-link to="/" class="hover:text-[var(--espace-or)] flex items-center gap-1">
                    <i class="fas fa-home"></i> Accueil
                </router-link>
                <router-link v-if="user" to="/profil" class="hover:text-[var(--espace-or)] flex items-center gap-1">
                    <i class="fas fa-user"></i> Profil
                </router-link>
                <router-link v-if="user" to="/parrainage" class="hover:text-[var(--espace-or)] flex items-center gap-1">
                    <i class="fas fa-users"></i> Parrainage
                </router-link>
                <router-link v-if="user" to="/commandes" class="hover:text-[var(--espace-or)] flex items-center gap-1">
                    <i class="fas fa-shopping-cart"></i> Commandes
                </router-link>
                <router-link v-if="user" to="/abonnements"
                    class="hover:text-[var(--espace-or)] flex items-center gap-1">
                    <i class="fas fa-star"></i> Abonnements
                </router-link>
                <button v-if="user" @click="logout" class="hover:text-[var(--espace-or)] flex items-center gap-1">
                    <i class="fas fa-sign-out-alt"></i> Déconnexion
                </button>
                <template v-else>
                    <router-link to="/login" class="hover:text-[var(--espace-or)] flex items-center gap-1">
                        <i class="fas fa-sign-in-alt"></i> Connexion
                    </router-link>
                    <router-link to="/register" class="hover:text-[var(--espace-or)] flex items-center gap-1">
                        <i class="fas fa-user-plus"></i> Inscription
                    </router-link>
                </template>
            </nav>
        </div>

        <!-- Menu Mobile -->
        <div v-if="menuOpen"
            class=" px-4 pb-4 flex flex-col space-y-2 bg-[var(--espace-vert)] text-[var(--espace-blanc)] transition-all">
            <router-link to="/" class="hover:text-[var(--espace-or)] flex items-center gap-2">
                <i class="fas fa-home"></i> Accueil
            </router-link>
            <router-link v-if="user" to="/profil" class="hover:text-[var(--espace-or)] flex items-center gap-2">
                <i class="fas fa-user"></i> Profil
            </router-link>
            <router-link v-if="user" to="/parrainage" class="hover:text-[var(--espace-or)] flex items-center gap-2">
                <i class="fas fa-users"></i> Parrainage
            </router-link>
            <router-link v-if="user" to="/commandes" class="hover:text-[var(--espace-or)] flex items-center gap-2">
                <i class="fas fa-shopping-cart"></i> Commandes
            </router-link>
            <router-link v-if="user" to="/abonnements" class="hover:text-[var(--espace-or)] flex items-center gap-2">
                <i class="fas fa-star"></i> Abonnements
            </router-link>
            <button v-if="user" @click="logout" class="hover:text-[var(--espace-or)] flex items-center gap-2">
                <i class="fas fa-sign-out-alt"></i> Déconnexion
            </button>
            <template v-else>
                <router-link to="/login" class="hover:text-[var(--espace-or)] flex items-center gap-2">
                    <i class="fas fa-sign-in-alt"></i> Connexion
                </router-link>
                <router-link to="/register" class="hover:text-[var(--espace-or)] flex items-center gap-2">
                    <i class="fas fa-user-plus"></i> Inscription
                </router-link>
            </template>
        </div>
    </header>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/Auth'

import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const user = authStore.user
const menuOpen = ref(false)

const logout = () => {
    authStore.logout()
    router.push({ name: 'login' })
    menuOpen.value = false
}
</script>
