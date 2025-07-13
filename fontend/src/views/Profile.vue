<template>
<div class="container mx-auto p-4 sm:p-6 space-y-6">
    <AppHeader />

    <!-- Titre Principal -->
    <h1 class="text-3xl font-bold text-[var(--espace-vert)] flex items-center gap-2">
      <i class="fas fa-user"></i> Mon Profil
    </h1>

    <!-- Bloc Informations personnelles -->
    <div class="bg-[var(--espace-blanc)] rounded-2xl shadow-lg p-6 transition hover:shadow-xl space-y-2">
      <h2 class="text-xl font-semibold text-[var(--espace-vert)] flex items-center gap-2 mb-4">
        <i class="fas fa-info-circle"></i> Informations personnelles
      </h2>
      <p class="text-[var(--espace-gris)] text-base"><strong>Nom :</strong> {{ user.nom }}</p>
      <p class="text-[var(--espace-gris)] text-base"><strong>Téléphone :</strong> {{ user.telephone }}</p>
      <p class="text-[var(--espace-gris)] text-base"><strong>Email :</strong> {{ user.email || 'Non défini' }}</p>
      <p class="text-[var(--espace-gris)] text-base"><strong>Ville :</strong> {{ user.ville }}</p>
      <p class="text-[var(--espace-gris)] text-base">
        <strong>Statut Premium :</strong> {{ user.premium ? 'Actif' : 'Inactif' }}
      </p>
    </div>

<!-- Bloc Compte Commerçant -->
<div class="bg-[var(--espace-blanc)] rounded-2xl shadow-lg p-6 transition hover:shadow-xl space-y-4">
      <h2 class="text-xl font-semibold text-[var(--espace-vert)] flex items-center gap-2">
        <i class="fas fa-store-alt"></i> Compte Commerçant
      </h2>

      <div v-if="user.commercant" class="space-y-2">
        <p class="text-[var(--espace-gris)] text-base"><strong>Nom :</strong> {{ user.commercant.nom }}</p>
        <p class="text-[var(--espace-gris)] text-base"><strong>Ville :</strong> {{ user.commercant.ville }}</p>
        <p class="text-[var(--espace-gris)] text-base"><strong>Actif :</strong> {{ user.commercant.actif ? 'Oui' : 'Non' }}</p>
      </div>

<div v-else>
        <p class="text-[var(--espace-gris)] text-base">Aucun compte commerçant. Créez-en un !</p>
        <form @submit.prevent="createCommercant" class="space-y-4 mt-4">
          <div>
            <label class="block text-[var(--espace-gris)] text-sm sm:text-base">
              <i class="fas fa-store mr-1"></i> Nom du commerçant
            </label>
            <input
              v-model="commercantForm.nom"
              type="text"
              class="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--espace-vert)]"
              required
            />
          </div>
<div>
            <label class="block text-[var(--espace-gris)] text-sm sm:text-base">
              <i class="fas fa-city mr-1"></i> Ville
            </label>
            <input
              v-model="commercantForm.ville"
              type="text"
              class="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--espace-vert)]"
              required
            />
          </div>
<div>
            <label class="block text-[var(--espace-gris)] text-sm sm:text-base">
              <i class="fas fa-align-left mr-1"></i> Description (optionnel)
            </label>
            <textarea
              v-model="commercantForm.description"
              class="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--espace-vert)]"
            ></textarea>
          </div>
<button type="submit"
    class="w-full bg-[var(--espace-or)] text-[var(--espace-vert)] font-semibold p-3 rounded-md 
                   hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] transition duration-300 flex items-center justify-center gap-2">
            <i class="fas fa-store-alt"></i> Créer Compte Commerçant
          </button>
</form>
</div>
</div>

<!-- Bloc Mes Boutiques -->
<div class="bg-[var(--espace-blanc)] rounded-2xl shadow-lg p-6 transition hover:shadow-xl space-y-4">
      <h2 class="text-xl font-semibold text-[var(--espace-vert)] flex items-center gap-2">
        <i class="fas fa-shop"></i> Mes Boutiques
      </h2>

      <div v-if="user.commercant && boutiques.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <BoutiqueCard v-for="boutique in boutiques" :key="boutique.id" :boutique="boutique" />
      </div>

<p v-else class="text-[var(--espace-gris)] text-base">Aucune boutique. Créez-en une !</p>

<form v-if="user.commercant" @submit.prevent="createBoutique" class="space-y-4 mt-4">
        <div>
          <label class="block text-[var(--espace-gris)] text-sm sm:text-base">
            <i class="fas fa-shop mr-1"></i> Nom de la boutique
          </label>
          <input
            v-model="boutiqueForm.nom"
            type="text"
            class="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--espace-vert)]"
            required
          />
        </div>
        <div>
          <label class="block text-[var(--espace-gris)] text-sm sm:text-base">
            <i class="fas fa-city mr-1"></i> Ville
          </label>
          <input
            v-model="boutiqueForm.ville"
            type="text"
            class="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--espace-vert)]"
            required
          />
        </div>
        <div>
          <label class="block text-[var(--espace-gris)] text-sm sm:text-base">
            <i class="fas fa-align-left mr-1"></i> Description (optionnel)
          </label>
          <textarea
            v-model="boutiqueForm.description"
            class="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--espace-vert)]"
          ></textarea>
        </div>
        <button
          type="submit"
          class="w-full bg-[var(--espace-or)] text-[var(--espace-vert)] font-semibold p-3 rounded-md 
                 hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] transition duration-300 flex items-center justify-center gap-2"
        >
          <i class="fas fa-shop"></i> Créer Boutique
        </button>
      </form>
</div>
</div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '../stores/Auth'
import axios from 'axios'
import AppHeader from '../components/AppHeader.vue'
import BoutiqueCard from '../components/BoutiqueCard.vue'
import apiClient from '../api'

const authStore = useAuthStore()
const router = useRouter()
const toast = useToast()
const user = ref(authStore.user)
const boutiques = ref([])
const commercantForm = ref({ nom: '', ville: '', description: '' })
const boutiqueForm = ref({ nom: '', ville: '', description: '' })


const createCommercant = async () => {
    try {
        const response = await apiClient.post('/commercants', commercantForm.value)
        user.value.commercant = response.data.commercant
        toast.success('Compte commerçant créé !')
    } catch (error) {
        toast.error(error.response?.data.message || 'Erreur lors de la création')
    }
}

const createBoutique = async () => {
    try {
        const response = await axios.post('http://localhost:8000/api/v1/boutiques', boutiqueForm.value)
        boutiques.value.push(response.data.boutique)
        toast.success('Boutique créée !')
        boutiqueForm.value = { nom: '', ville: '', description: '' }
    } catch (error) {
        toast.error(error.response?.data.message || 'Erreur lors de la création')
    }
}
</script>