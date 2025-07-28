<template>
  <div class="space-y-6">
    <!-- Personal Information -->
    <section class="bg-white rounded-lg shadow-md p-4 sm:p-6 space-y-4">
      <h2 class="text-lg sm:text-xl font-semibold text-[var(--espace-vert)]">Informations personnelles</h2>
      <div v-if="!editProfile" class="space-y-2 text-[var(--espace-gris)]">
        <p><strong>Nom :</strong> {{ user.nom }}</p>
        <p><strong>Téléphone :</strong> {{ user.telephone }}</p>
        <p><strong>Email :</strong> {{ user.email || 'Non défini' }}</p>
        <p><strong>Ville :</strong> {{ user.ville }}</p>
        <p><strong>Statut Premium :</strong> {{ user.premium ? 'Actif' : 'Inactif' }}</p>
        <button
          @click="editProfile = true"
          class="mt-2 w-full sm:w-auto bg-[var(--espace-or)] text-[var(--espace-vert)] font-medium px-4 py-2 rounded-md hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] transition-colors"
          aria-label="Modifier le profil"
        >
          Modifier
        </button>
      </div>
      <form v-else @submit.prevent="updateProfile" class="space-y-4">
        <div>
          <label class="block text-[var(--espace-gris)] text-sm font-medium" for="nom">Nom</label>
          <input
            v-model="profileForm.nom"
            id="nom"
            type="text"
            required
            class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--espace-vert)]"
            placeholder="Votre nom"
          />
        </div>
        <div>
          <label class="block text-[var(--espace-gris)] text-sm font-medium" for="telephone">Téléphone</label>
          <input
            v-model="profileForm.telephone"
            id="telephone"
            type="tel"
            required
            class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--espace-vert)]"
            placeholder="Votre téléphone"
          />
        </div>
        <div>
          <label class="block text-[var(--espace-gris)] text-sm font-medium" for="email">Email</label>
          <input
            v-model="profileForm.email"
            id="email"
            type="email"
            class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--espace-vert)]"
            placeholder="Votre email (optionnel)"
          />
        </div>
        <div>
          <label class="block text-[var(--espace-gris)] text-sm font-medium" for="ville">Ville</label>
          <input
            v-model="profileForm.ville"
            id="ville"
            type="text"
            required
            class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--espace-vert)]"
            placeholder="Votre ville"
          />
        </div>
        <div class="flex gap-2">
          <button
            type="submit"
            class="w-full sm:w-auto bg-[var(--espace-or)] text-[var(--espace-vert)] font-medium px-4 py-2 rounded-md hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] transition-colors"
            aria-label="Enregistrer les modifications"
          >
            Enregistrer
          </button>
          <button
            @click="editProfile = false"
            class="w-full sm:w-auto bg-gray-300 text-[var(--espace-vert)] font-medium px-4 py-2 rounded-md hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] transition-colors"
            aria-label="Annuler"
          >
            Annuler
          </button>
        </div>
      </form>
    </section>

    <!-- Statistics -->
    <section class="bg-white rounded-lg shadow-md p-4 sm:p-6 space-y-4">
      <h2 class="text-lg sm:text-xl font-semibold text-[var(--espace-vert)]">Statistiques</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[var(--espace-gris)]">
        <p><strong>Commandes totales :</strong> {{ stats?.commandes || 0 }}</p>
        <p><strong>Parrainages actifs :</strong> {{ stats?.parrainages || 0 }}</p>
        <p v-if="user.commercant"><strong>Revenus cumulés :</strong> {{ stats?.revenus || 0 }} FCFA</p>
        <p v-if="user.commercant"><strong>Produits vendus :</strong> {{ stats?.produits_vendus || 0 }}</p>
        <p><strong>Dernière connexion :</strong> {{ user.last_login || 'Non disponible' }}</p>
      </div>
    </section>

    <!-- Collaborations -->
    <section class="bg-white rounded-lg shadow-md p-4 sm:p-6 space-y-4">
      <h2 class="text-lg sm:text-xl font-semibold text-[var(--espace-vert)]">Mes Collaborations</h2>
      <div v-if="collaborations?.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="collab in collaborations" :key="collab.id" class="border rounded-md p-3 text-[var(--espace-gris)]">
          <p><strong>Produit :</strong> {{ collab.produit.nom }}</p>
          <p><strong>Prix :</strong> {{ collab.prix_revente }} FCFA</p>
          <p><strong>Statut :</strong> {{ collab.statut }}</p>
          <p><strong>Date :</strong> {{ new Date(collab.created_at).toLocaleDateString() }}</p>
        </div>
      </div>
      <p v-else class="text-[var(--espace-gris)]">Aucune collaboration en cours.</p>
    </section>

    <!-- Parrainage -->
    <section class="bg-white rounded-lg shadow-md p-4 sm:p-6 space-y-4">
      <h2 class="text-lg sm:text-xl font-semibold text-[var(--espace-vert)]">Mon Parrainage</h2>
      <div v-if="parrainage?.niveau" class="space-y-4">
        <p class="text-[var(--espace-gris)]">
          <strong>Niveau actuel :</strong> {{ parrainage?.niveau.emoji }} {{ parrainage?.niveau.nom }}
        </p>
        <p class="text-[var(--espace-gris)]"><strong>Jetons :</strong> {{ user.jetons }} jetons</p>
        <div>
          <p class="text-[var(--espace-gris)]"><strong>Avantages débloqués :</strong></p>
          <ul class="list-disc list-inside text-[var(--espace-gris)]">
            <li v-for="avantage in parrainage?.avantages" :key="avantage">{{ avantage }}</li>
          </ul>
        </div>
        <div>
          <p class="text-[var(--espace-gris)]">
            <strong>Progression :</strong> {{ parrainage?.filleuls_commercants }} / {{ parrainage?.prochain_seuil }} filleuls commerçants
          </p>
          <div class="w-full bg-gray-200 rounded-full h-2.5">
            <div
              class="bg-[var(--espace-or)] h-2.5 rounded-full"
              :style="{ width: `${(parrainage.filleuls_commercants / parrainage?.prochain_seuil * 100 || 0)}%` }"
            ></div>
          </div>
        </div>
      </div>
      <p v-else class="text-[var(--espace-gris)]">Vous n'avez pas encore de niveau de parrainage?.</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '../stores/Auth';
import apiClient from '../api';

 const props = defineProps({
  user: Object,
  collaborations: Array,
  stats: Object,
  parrainage: Object,
});

const authStore = useAuthStore();
const toast = useToast();
const editProfile = ref(false);
const user = authStore.user || props.user;
const profileForm = ref({
  nom: user.nom || '',
  telephone: user.telephone || '',
  email: user.email || '',
  ville: user.ville || '',
});

const updateProfile = async () => {
  try {
    const response = await apiClient.put('/profile', profileForm.value);
    user.nom = response.data.user.nom;
    user.telephone = response.data.user.telephone;
    user.email = response.data.user.email;
    user.ville = response.data.user.ville;
    authStore.user = user;
    editProfile.value = false;
    toast.success('Profil mis à jour avec succès.');
  } catch (error: any) {
    toast.error(error.response?.data.message || 'Erreur lors de la mise à jour.');
  }
};

watch(() => user, (newUser) => {
  profileForm.value = {
    nom: newUser.nom || '',
    telephone: newUser.telephone || '',
    email: newUser.email || '',
    ville: newUser.ville || '',
  };
}, { immediate: true });
</script>

<style scoped>
:root {
  --espace-vert: #14532d;
  --espace-or: #facc15;
  --espace-blanc: #ffffff;
  --espace-gris: #6b7280;
}
</style>