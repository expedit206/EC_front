<template>
  <div class="space-y-6 pb-16">
    <!-- Personal Information -->
    <section class="bg-white rounded-lg shadow-md p-4 sm:p-6 space-y-4">
      <h2 class="text-lg sm:text-xl font-semibold text-[var(--espace-vert)]">Informations personnelles</h2>
      <div v-if="!editProfile" class="space-y-2 text-[var(--espace-gris)]">
        <p><strong>Nom :</strong> {{ user?.nom }}</p>
        <p><strong>Téléphone :</strong> {{ user?.telephone }}</p>
        <p><strong>Email :</strong> {{ user?.email || 'Non défini' }}</p>
        <p><strong>Ville :</strong> {{ user?.ville }}</p>
        <p><strong>Statut Premium :</strong> {{ user?.premium ? 'Actif' : 'Inactif' }}</p>
        <button @click="editProfile = true"
          class="mt-2 w-full sm:w-auto bg-[var(--espace-or)] text-[var(--espace-vert)] font-medium px-4 py-2 rounded-md hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] transition-colors"
          aria-label="Modifier le profil">
          Modifier
        </button>
      </div>
      <form v-else @submit.prevent="updateProfile" class="space-y-4">
        <div>
          <label class="block text-[var(--espace-gris)] text-sm font-medium" for="nom">Nom</label>
          <input v-model="profileForm.nom" id="nom" type="text" required
            class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--espace-vert)]"
            placeholder="Votre nom" />
        </div>
        <div>
          <label class="block text-[var(--espace-gris)] text-sm font-medium" for="telephone">Téléphone</label>
          <input v-model="profileForm.telephone" id="telephone" type="tel" required
            class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--espace-vert)]"
            placeholder="Votre téléphone" />
        </div>
        <div>
          <label class="block text-[var(--espace-gris)] text-sm font-medium" for="email">Email</label>
          <input v-model="profileForm.email" id="email" type="email"
            class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--espace-vert)]"
            placeholder="Votre email (optionnel)" />
        </div>
        <div>
          <label class="block text-[var(--espace-gris)] text-sm font-medium" for="ville">Ville</label>
          <input v-model="profileForm.ville" id="ville" type="text" required
            class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--espace-vert)]"
            placeholder="Votre ville" />
        </div>
        <div class="flex gap-2">
          <button type="submit" :disabled="loadingProfile" :class="[
            'w-full sm:w-auto bg-[var(--espace-or)] text-[var(--espace-vert)] font-medium px-4 py-2 rounded-md transition-colors',
            loadingProfile ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)]'
          ]" aria-label="Enregistrer les modifications">
            <i v-if="loadingProfile" class="fas fa-spinner fa-spin mr-2"></i>
            Enregistrer
          </button>
          <button @click="editProfile = false"
            class="w-full sm:w-auto bg-gray-300 text-[var(--espace-vert)] font-medium px-4 py-2 rounded-md hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] transition-colors"
            aria-label="Annuler">
            Annuler
          </button>
        </div>
      </form>
    </section>

    <!-- Merchant Information -->
    <section v-if="user?.commercant" class="bg-white rounded-lg shadow-md p-4 sm:p-6 space-y-4">
      <h2 class="text-lg sm:text-xl font-semibold text-[var(--espace-vert)]">Informations du Commerce</h2>
      <div v-if="!editCommerce" class="space-y-2 text-[var(--espace-gris)]">
        <div v-if="user.commercant.logo" class="w-24 h-24">
          <img :src="`http://localhost:8000/storage/${user.commercant.logo}`" alt="Logo du commerce"
            class="w-full h-full object-cover rounded-md shadow" />
        </div>
        <p><strong>Nom du commerce :</strong> {{ user.commercant.nom }}</p>
        <p><strong>Description :</strong> {{ user.commercant.description || 'Non définie' }}</p>
        <p><strong>Email :</strong> {{ user.commercant.email || 'Non défini' }}</p>
        <p><strong>Téléphone :</strong> {{ user.commercant.telephone }}</p>
        <p><strong>Ville :</strong> {{ user.commercant.ville }}</p>
        <!-- <p><strong>Produits actifs :</strong> {{ user.commercant.active_products || 0 }}</p> -->
        <button @click="editCommerce = true"
          class="mt-2 w-full sm:w-auto bg-[var(--espace-or)] text-[var(--espace-vert)] font-medium px-4 py-2 rounded-md hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] transition-colors">
          Modifier
        </button>
      </div>
      <form v-else @submit.prevent="updateCommerce" class=" space-y-4">
        <div>
          <label class="block text-[var(--espace-gris)] text-sm font-medium" for="nom_commerce">Nom du commerce</label>
          <input v-model="commerceForm.nom" id="nom_commerce" type="text" required
            class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--espace-vert)]"
            placeholder="Nom du commerce" />
        </div>
        <div>
          <label class="block text-[var(--espace-gris)] text-sm font-medium"
            for="description_commerce">Description</label>
          <textarea v-model="commerceForm.description" id="description_commerce" required
            class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--espace-vert)]"
            placeholder="Description du commerce" rows="3"></textarea>
        </div>
        <div>
          <label class="block text-[var(--espace-gris)] text-sm font-medium" for="email_commerce">Email</label>
          <input v-model="commerceForm.email" id="email_commerce" type="email"
            class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--espace-vert)]"
            placeholder="Email du commerce (optionnel)" />
        </div>
        <div>
          <label class="block text-[var(--espace-gris)] text-sm font-medium" for="telephone_commerce">Téléphone</label>
          <input v-model="commerceForm.telephone" id="telephone_commerce" type="tel" required
            class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--espace-vert)]"
            placeholder="Téléphone du commerce" />
        </div>
        <div>
          <label class="block text-[var(--espace-gris)] text-sm font-medium" for="ville_commerce">Ville</label>
          <input v-model="commerceForm.ville" id="ville_commerce" type="text" required
            class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--espace-vert)]"
            placeholder="Ville du commerce" />
        </div>
        <div>
          <label class="block text-[var(--espace-gris)] text-sm font-medium" for="logo_commerce">Logo</label>
          <input id="logo_commerce" type="file" accept="image/*" @change="handleLogoUpload"
            class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--espace-vert)]" />
          <div v-if="commerceForm.logoPreview" class="mt-2 w-24 h-24">
            <img :src="commerceForm.logoPreview" alt="Aperçu logo"
              class="w-full h-full object-cover rounded-md shadow" />
          </div>
        </div>
        <div class="flex gap-2">
          <button type="submit" :disabled="loadingCommerce" :class="[
            'w-full sm:w-auto bg-[var(--espace-or)] text-[var(--espace-vert)] font-medium px-4 py-2 rounded-md transition-colors',
            loadingCommerce ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)]'
          ]" aria-label="Enregistrer les modifications">
            <i v-if="loadingCommerce" class="fas fa-spinner fa-spin mr-2"></i>
            Enregistrer
          </button>
          <button @click="editCommerce = false" type="button"
            class="w-full sm:w-auto bg-gray-300 text-[var(--espace-vert)] font-medium px-4 py-2 rounded-md hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] transition-colors"
            aria-label="Annuler">
            Annuler
          </button>
        </div>
      </form>
    </section>

  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '../stores/Auth';
import apiClient from '../api/index';
import { User } from "../components/types/index";
import { useRouter } from 'vue-router';
const router = useRouter();

const props = defineProps({
  user: Object as () => User | null,
});

const authStore = useAuthStore();
const toast = useToast();
const editProfile = ref(false);
const user = ref<User | null>(authStore.user);
const loadingProfile = ref(false); // Nouvel état pour le chargement du profil
const loadingCommerce = ref(false); // Nouvel état pour le chargement du commerce

const profileForm = ref({
  nom: user.value?.nom || '',
  telephone: user.value?.telephone || '',
  email: user.value?.email || '',
  ville: user.value?.ville || '',
});

const editCommerce = ref(false);

const commerceForm = ref({
  nom: user.value?.commercant?.nom || '',
  description: user.value?.commercant?.description || '',
  email: user.value?.commercant?.email || '',
  telephone: user.value?.commercant?.telephone || '',
  ville: user.value?.commercant?.ville || '',
  logo: null as File | null,
  logoPreview: user.value?.commercant?.logo ? `http://localhost:8000/storage/${user.value.commercant.logo}` : null,
});
//console.log(`com ${JSON.stringify(commerceForm.value)}`);

const handleLogoUpload = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (file) {
    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image trop volumineuse (max 2Mo).');
      return;
    }
    commerceForm.value.logo = file;
    commerceForm.value.logoPreview = URL.createObjectURL(file);
  }
};

const updateProfile = async () => {
  loadingProfile.value = true; // Activer le chargement
  try {
    const response = await apiClient.post('/updateProfile', profileForm.value);
    if (user.value) {
      user.value.nom = response.data.user.nom || '';
      user.value.telephone = response.data.user.telephone || '';
      user.value.email = response.data.user.email || '';
      user.value.ville = response.data.user.ville || '';
    }
    authStore.user = response.data.user;
    editProfile.value = false;
    toast.success('Profil mis à jour avec succès.');
  } catch (error: any) {
    if (error.response?.data?.message == 'Unauthenticated.') {
      router.push('login')
    }

    toast.error(error.response?.data.message || 'Erreur lors de la mise à jour.');
  } finally {
    loadingProfile.value = false; // Désactiver le chargement, même en cas d'erreur
  }
};

const updateCommerce = async () => {
  loadingCommerce.value = true; // Activer le chargement
  try {
    const formData = new FormData();
    formData.append('nom', commerceForm.value.nom);
    formData.append('description', commerceForm.value.description);
    formData.append('email', commerceForm.value.email);
    formData.append('telephone', commerceForm.value.telephone);
    formData.append('ville', commerceForm.value.ville);
    if (commerceForm.value.logo) {
      formData.append('logo', commerceForm.value.logo);
    }

    const response = await apiClient.post('/commercant/update', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    //console.log(`com ${JSON.stringify(response.data)}`);

    if (user.value?.commercant) {
      user.value.commercant.nom = response.data.commercant.nom;
      user.value.commercant.description = response.data.commercant.description;
      user.value.commercant.email = response.data.commercant.email;
      user.value.commercant.telephone = response.data.commercant.telephone;
      user.value.commercant.ville = response.data.commercant.ville;
      user.value.commercant.logo = response.data.commercant.logo;
    }
    authStore.user = user.value;
    commerceForm.value.logoPreview = response.data.commercant.logo ? `http://localhost:8000/storage/${response.data.commercant.logo}` : null;
    editCommerce.value = false;
    toast.success('Commerce mis à jour avec succès.');
  } catch (error: any) {
    if (error.response?.data?.message == 'Unauthenticated.') {
      router.push('login')
    }

    toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour du commerce.');
  } finally {
    loadingCommerce.value = false; // Désactiver le chargement, même en cas d'erreur
  }
};

watch(() => authStore.user, (newUser) => {
  user.value = newUser || null;
  profileForm.value = {
    nom: newUser?.nom || '',
    telephone: newUser?.telephone || '',
    email: newUser?.email || '',
    ville: newUser?.ville || '',
  };
  commerceForm.value = {
    nom: newUser?.commercant?.nom || '',
    description: newUser?.commercant?.description || '',
    email: newUser?.commercant?.email || '',
    telephone: newUser?.commercant?.telephone || '',
    ville: newUser?.commercant?.ville || '',
    logo: null,
    logoPreview: newUser?.commercant?.logo ? `http://localhost:8000/storage/${newUser.commercant.logo}` : null,
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