<template>
  <AppHeader />
  <div class="min-h-screen bg-gray-100 py-6 px-4 sm:px-6"
    >
    <div class="container mx-auto space-y-6">

      <h1 class="text-2xl sm:text-3xl font-bold text-[var(--espace-vert)] flex items-center gap-2 select-none">
        <i class="fas fa-user"></i> Mon Profil
      </h1>

      <!-- Bloc Informations personnelles -->
      <section
        class="bg-[rgba(255,255,255,0.95)] rounded-2xl shadow-lg p-4 sm:p-6 transition-shadow hover:shadow-xl space-y-4">
        <h2 class="text-lg sm:text-xl font-semibold text-[var(--espace-vert)] flex items-center gap-2 select-none">
          <i class="fas fa-info-circle"></i> Informations personnelles
        </h2>
        <div v-if="!editProfile" class="space-y-2 text-[var(--espace-gris)] text-sm sm:text-base">
          <p><strong>Nom :</strong> {{ user.nom }}</p>
          <p><strong>Téléphone :</strong> {{ user.telephone }}</p>
          <p><strong>Email :</strong> {{ user.email || 'Non défini' }}</p>
          <p><strong>Ville :</strong> {{ user.ville }}</p>
          <p><strong>Statut Premium :</strong> {{ user.premium ? 'Actif' : 'Inactif' }}</p>
          <button @click="editProfile = true"
            class="w-full sm:w-auto bg-[var(--espace-or)] text-[var(--espace-vert)] font-semibold px-3 py-1.5 rounded-lg hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] transition flex items-center justify-center gap-2 text-sm"
            aria-label="Modifier le profil">
            <i class="fas fa-edit"></i>
            <span class="hidden sm:inline">Modifier</span>
          </button>
        </div>
        <form v-else @submit.prevent="updateProfile" class="space-y-4">
          <div>
            <label class="block text-[var(--espace-gris)] text-sm font-medium mb-1 select-none" for="nom">
              <i class="fas fa-user mr-1"></i> Nom
            </label>
            <input v-model="profileForm.nom" id="nom" type="text" required
              class="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--espace-vert)] transition"
              placeholder="Votre nom" />
          </div>
          <div>
            <label class="block text-[var(--espace-gris)] text-sm font-medium mb-1 select-none" for="telephone">
              <i class="fas fa-phone mr-1"></i> Téléphone
            </label>
            <input v-model="profileForm.telephone" id="telephone" type="tel" required
              class="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--espace-vert)] transition"
              placeholder="Votre téléphone" />
          </div>
          <div>
            <label class="block text-[var(--espace-gris)] text-sm font-medium mb-1 select-none" for="email">
              <i class="fas fa-envelope mr-1"></i> Email
            </label>
            <input v-model="profileForm.email" id="email" type="email"
              class="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--espace-vert)] transition"
              placeholder="Votre email (optionnel)" />
          </div>
          <div>
            <label class="block text-[var(--espace-gris)] text-sm font-medium mb-1 select-none" for="ville">
              <i class="fas fa-city mr-1"></i> Ville
            </label>
            <input v-model="profileForm.ville" id="ville" type="text" required
              class="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--espace-vert)] transition"
              placeholder="Votre ville" />
          </div>
          <div class="flex gap-2">
            <button type="submit"
              class="w-full bg-[var(--espace-or)] text-[var(--espace-vert)] font-semibold p-2 sm:p-3 rounded-lg hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] transition flex items-center justify-center gap-2 text-sm"
              aria-label="Enregistrer les modifications">
              <i class="fas fa-save"></i>
              <span class="hidden sm:inline">Enregistrer</span>
            </button>
            <button @click="editProfile = false"
              class="w-full bg-[var(--espace-gris)] text-[var(--espace-blanc)] font-semibold p-2 sm:p-3 rounded-lg hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] transition flex items-center justify-center gap-2 text-sm"
              aria-label="Annuler">
              <i class="fas fa-times"></i>
              <span class="hidden sm:inline">Annuler</span>
            </button>
          </div>
        </form>
      </section>

      <!-- Bloc Statistiques -->
      <section
        class="bg-[rgba(255,255,255,0.95)] rounded-2xl shadow-lg p-4 sm:p-6 transition-shadow hover:shadow-xl space-y-4">
        <h2 class="text-lg sm:text-xl font-semibold text-[var(--espace-vert)] flex items-center gap-2 select-none">
          <i class="fas fa-chart-line"></i> Statistiques
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[var(--espace-gris)] text-sm sm:text-base">
          <p><strong>Commandes :</strong> {{ stats.commandes || 0 }}</p>
          <p><strong>Parrainages :</strong> {{ stats.parrainages || 0 }}</p>
          <p v-if="user.commercant"><strong>Revenus :</strong> {{ stats.revenus || 0 }} FCFA</p>
          <p v-if="user.commercant"><strong>Produits vendus :</strong> {{ stats.produits_vendus || 0 }}</p>
        </div>
      </section>

      <!-- Bloc Compte Commerçant -->
      <section
        class="bg-[rgba(255,255,255,0.95)] rounded-2xl shadow-lg p-4 sm:p-6 transition-shadow hover:shadow-xl space-y-4">
        <h2 class="text-lg sm:text-xl font-semibold text-[var(--espace-vert)] flex items-center gap-2 select-none">
          <i class="fas fa-store-alt"></i> Compte Commerçant
        </h2>
        <div v-if="user.commercant" class="space-y-2 text-[var(--espace-gris)] text-sm sm:text-base">
          <p><strong>Nom :</strong> {{ user.commercant.nom }}</p>
          <p><strong>Ville :</strong> {{ user.commercant.ville }}</p>
          <p><strong>Actif :</strong> {{ user.commercant.actif ? 'Oui' : 'Non' }}</p>
        </div>
        <div v-else>
          <p class="text-[var(--espace-gris)] text-sm sm:text-base">Aucun compte commerçant. Créez-en un !</p>
          <form @submit.prevent="createCommercant" class="space-y-4 mt-4">
            <div>
              <label class="block text-[var(--espace-gris)] text-sm font-medium mb-1 select-none" for="commercant-nom">
                <i class="fas fa-store mr-1"></i> Nom du commerçant
              </label>
              <input v-model="commercantForm.nom" id="commercant-nom" type="text" required
                class="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--espace-vert)] transition"
                placeholder="Ex: Ma Boutique" />
            </div>
            <div>
              <label class="block text-[var(--espace-gris)] text-sm font-medium mb-1 select-none"
                for="commercant-ville">
                <i class="fas fa-city mr-1"></i> Ville
              </label>
              <input v-model="commercantForm.ville" id="commercant-ville" type="text" required
                class="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--espace-vert)] transition"
                placeholder="Ex: Douala" />
            </div>
            <div>
              <label class="block text-[var(--espace-gris)] text-sm font-medium mb-1 select-none"
                for="commercant-description">
                <i class="fas fa-align-left mr-1"></i> Description (optionnel)
              </label>
              <textarea v-model="commercantForm.description" id="commercant-description" rows="3"
                class="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--espace-vert)] transition resize-none"
                placeholder="Décrivez votre commerce"></textarea>
            </div>
            <button type="submit"
              class="w-full bg-[var(--espace-or)] text-[var(--espace-vert)] font-semibold p-2 sm:p-3 rounded-lg hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] transition flex items-center justify-center gap-2 text-sm"
              aria-label="Créer compte commerçant">
              <i class="fas fa-store-alt"></i>
              <span class="hidden sm:inline">Créer Compte Commerçant</span>
            </button>
          </form>
        </div>
      </section>

      <!-- Bloc Mes Boutiques -->
      <section
        class="bg-[rgba(255,255,255,0.95)] rounded-2xl shadow-lg p-4 sm:p-6 transition-shadow hover:shadow-xl space-y-4">
        <h2 class="text-lg sm:text-xl font-semibold text-[var(--espace-vert)] flex items-center gap-2 select-none">
          <i class="fas fa-shop"></i> Mes Boutiques
        </h2>
        <div v-if="user.commercant && boutiques.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <BoutiqueCard v-for="boutique in boutiques" :key="boutique.id" :boutique="boutique" @update="updateBoutique"
            @delete="deleteBoutique" />
        </div>
        <p v-else class="text-[var(--espace-gris)] text-sm sm:text-base">
          Aucune boutique. Créez-en une !
        </p>
        <form v-if="user.commercant" @submit.prevent="createBoutique" class="space-y-4 mt-4">
          <div>
            <label class="block text-[var(--espace-gris)] text-sm font-medium mb-1 select-none" for="boutique-nom">
              <i class="fas fa-shop mr-1"></i> Nom de la boutique
            </label>
            <input v-model="boutiqueForm.nom" id="boutique-nom" type="text" required
              class="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--espace-vert)] transition"
              placeholder="Ex: Boutique du Centre" />
          </div>
          <div>
            <label class="block text-[var(--espace-gris)] text-sm font-medium mb-1 select-none" for="boutique-ville">
              <i class="fas fa-city mr-1"></i> Ville
            </label>
            <input v-model="boutiqueForm.ville" id="boutique-ville" type="text" required
              class="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--espace-vert)] transition"
              placeholder="Ex: Yaoundé" />
          </div>
          <div>
            <label class="block text-[var(--espace-gris)] text-sm font-medium mb-1 select-none"
              for="boutique-description">
              <i class="fas fa-align-left mr-1"></i> Description (optionnel)
            </label>
            <textarea v-model="boutiqueForm.description" id="boutique-description" rows="3"
              class="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--espace-vert)] transition resize-none"
              placeholder="Décrivez votre boutique"></textarea>
          </div>
          <button type="submit"
            class="w-full bg-[var(--espace-or)] text-[var(--espace-vert)] font-semibold p-2 sm:p-3 rounded-lg hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] transition flex items-center justify-center gap-2 text-sm"
            aria-label="Créer boutique">
            <i class="fas fa-shop"></i>
            <span class="hidden sm:inline">Créer Boutique</span>
          </button>
        </form>
      </section>

      <!-- Bloc Collaborations -->
      <section
        class="bg-[rgba(255,255,255,0.95)] rounded-2xl shadow-lg p-4 sm:p-6 transition-shadow hover:shadow-xl space-y-4">
        <h2 class="text-lg sm:text-xl font-semibold text-[var(--espace-vert)] flex items-center gap-2 select-none">
          <i class="fas fa-handshake"></i> Mes Collaborations
        </h2>
        <div v-if="collaborations.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="collab in collaborations" :key="collab.id"
            class="border rounded-lg p-3 text-[var(--espace-gris)] text-sm sm:text-base">
            <p><strong>Produit :</strong> {{ collab.produit.nom }}</p>
            <p><strong>Prix de revente :</strong> {{ collab.prix_revente }} FCFA</p>
            <p><strong>Statut :</strong> {{ collab.statut }}</p>
          </div>
        </div>
        <p v-else class="text-[var(--espace-gris)] text-sm sm:text-base">
          Aucune collaboration en cours.
        </p>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '../stores/Auth';
import axios from 'axios';
import AppHeader from '../components/AppHeader.vue';
import BoutiqueCard from '../components/BoutiqueCard.vue';

const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();
const user = ref(authStore.user);
const boutiques = ref([]);
const collaborations = ref([]);
const stats = ref({ commandes: 0, parrainages: 0, revenus: 0, produits_vendus: 0 });
const editProfile = ref(false);
const profileForm = ref({
  nom: user.value.nom,
  telephone: user.value.telephone,
  email: user.value.email || '',
  ville: user.value.ville,
});
const commercantForm = ref({ nom: '', ville: '', description: '' });
const boutiqueForm = ref({ nom: '', ville: '', description: '' });

const fetchData = async () => {
  try {
    const [boutiquesResponse, statsResponse, collabsResponse] = await Promise.all([
      axios.get('http://localhost:8000/api/v1/boutiques'),
      axios.get('http://localhost:8000/api/v1/stats'),
      axios.get('http://localhost:8000/api/v1/collaborations'),
    ]);
    boutiques.value = boutiquesResponse.data.boutiques;
    stats.value = statsResponse.data;
    collaborations.value = collabsResponse.data.collaborations;
  } catch (error) {
    toast.error('Erreur lors du chargement des données.');
  }
};

const updateProfile = async () => {
  try {
    const response = await axios.put('http://localhost:8000/api/v1/profile', profileForm.value);
    user.value = { ...user.value, ...response.data.user };
    authStore.user = user.value; // Mettre à jour le store
    editProfile.value = false;
    toast.success('Profil mis à jour !');
  } catch (error: any) {
    toast.error(error.response?.data.message || 'Erreur lors de la mise à jour');
  }
};

const createCommercant = async () => {
  try {
    const response = await axios.post('http://localhost:8000/api/v1/commercants', commercantForm.value);
    user.value.commercant = response.data.commercant;
    authStore.user = user.value; // Mettre à jour le store
    toast.success('Compte commerçant créé !');
    commercantForm.value = { nom: '', ville: '', description: '' };
  } catch (error: any) {
    toast.error(error.response?.data.message || 'Erreur lors de la création');
  }
};

const createBoutique = async () => {
  try {
    const response = await axios.post('http://localhost:8000/api/v1/boutiques', boutiqueForm.value);
    boutiques.value.push(response.data.boutique);
    toast.success('Boutique créée !');
    boutiqueForm.value = { nom: '', ville: '', description: '' };
  } catch (error: any) {
    toast.error(error.response?.data.message || 'Erreur lors de la création');
  }
};

const updateBoutique = async (boutique: any) => {
  try {
    const response = await axios.put(`http://localhost:8000/api/v1/boutiques/${boutique.id}`, boutique);
    boutiques.value = boutiques.value.map((b) =>
      b.id === boutique.id ? response.data.boutique : b
    );
    toast.success('Boutique mise à jour !');
  } catch (error: any) {
    toast.error(error.response?.data.message || 'Erreur lors de la mise à jour');
  }
};

const deleteBoutique = async (boutiqueId: string) => {
  try {
    await axios.delete(`http://localhost:8000/api/v1/boutiques/${boutiqueId}`);
    boutiques.value = boutiques.value.filter((b) => b.id !== boutiqueId);
    toast.success('Boutique supprimée !');
  } catch (error: any) {
    toast.error(error.response?.data.message || 'Erreur lors de la suppression');
  }
};

onMounted(fetchData);
</script>

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