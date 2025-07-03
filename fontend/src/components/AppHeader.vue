<!-- src/components/AppHeader.vue -->
<template>
    <header class="bg-[var(--espace-vert)] text-[var(--espace-blanc)] p-4 shadow-md">
        <div class="container mx-auto flex justify-between items-center flex-col sm:flex-row">
            <h1 class="text-xl font-bold flex items-center">
                <i class="fas fa-store mr-2"></i> Espace Cameroun
            </h1>
            <nav class="mt-4 sm:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <router-link to="/" class="hover:text-[var(--espace-or)] flex items-center">
                    <i class="fas fa-home mr-1"></i> Accueil
                </router-link>
                <router-link v-if="user" to="/profil" class="hover:text-[var(--espace-or)] flex items-center">
                    <i class="fas fa-user mr-1"></i> Profil
                </router-link>
                <router-link v-if="user" to="/parrainage" class="hover:text-[var(--espace-or)] flex items-center">
                    <i class="fas fa-users mr-1"></i> Parrainage
                </router-link>
                <router-link v-if="user" to="/commandes" class="hover:text-[var(--espace-or)] flex items-center">
                    <i class="fas fa-shopping-cart mr-1"></i> Commandes
                </router-link>
                <router-link v-if="user" to="/abonnements" class="hover:text-[var(--espace-or)] flex items-center">
                    <i class="fas fa-star mr-1"></i> Abonnements
                </router-link>
                <button v-if="user" @click="logout" class="hover:text-[var(--espace-or)] flex items-center">
                    <i class="fas fa-sign-out-alt mr-1"></i> Déconnexion
                </button>
                <router-link v-else to="/login" class="hover:text-[var(--espace-or)] flex items-center">
                    <i class="fas fa-sign-in-alt mr-1"></i> Connexion
                </router-link>
                <router-link v-else to="/register" class="hover:text-[var(--espace-or)] flex items-center">
                    <i class="fas fa-user-plus mr-1"></i> Inscription
                </router-link>
            </nav>
        </div>
    </header>
</template>

<script setup>
import { useAuthStore } from '../store'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const user = authStore.user

const logout = () => {
    authStore.logout()
    router.push({ name: 'login' })
}
</script>