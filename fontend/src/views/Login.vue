<!-- src/views/Login.vue -->
<template>
    <div class="container mx-auto p-4 sm:p-6 max-w-md">
        <AppHeader />
        <h1 class="text-2xl sm:text-3xl font-bold text-[var(--espace-vert)] mb-4 flex items-center">
            <i class="fas fa-sign-in-alt mr-2"></i> Connexion
        </h1>
        <form @submit.prevent="login" class="space-y-4">
            <div>
                <label class="block text-[var(--espace-gris)] text-sm sm:text-base">
                    <i class="fas fa-phone mr-1"></i> Téléphone
                </label>
                <input v-model="form.telephone" type="tel" class="w-full p-2 border rounded text-[var(--espace-gris)]"
                    required />
            </div>
            <div>
                <label class="block text-[var(--espace-gris)] text-sm sm:text-base">
                    <i class="fas fa-lock mr-1"></i> Mot de passe
                </label>
                <input v-model="form.mot_de_passe" type="password"
                    class="w-full p-2 border rounded text-[var(--espace-gris)]" required />
            </div>
            <button type="submit"
                class="w-full bg-[var(--espace-or)] text-[var(--espace-vert)] p-2 rounded hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] flex items-center justify-center">
                <i class="fas fa-sign-in-alt mr-2"></i> Se connecter
            </button>
        </form>
        <p class="mt-4 text-[var(--espace-gris)] text-sm sm:text-base">
            Pas de compte ? <router-link to="/register"
                class="text-[var(--espace-or)] hover:underline">S'inscrire</router-link>
        </p>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '../store'
import AppHeader from '../components/AppHeader.vue'

const form = ref({
    telephone: '',
    mot_de_passe: '',
})

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()

const login = async () => {
    try {
        await authStore.login(form.value)
        toast.success('Connexion réussie !')
        router.push({ name: 'profil' })
    } catch (error) {
        toast.error(error.message || 'Erreur lors de la connexion')
    }
}
</script>