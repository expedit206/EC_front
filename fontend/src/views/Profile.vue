<template>
  <div class="min-h-screen bg-gray-100 py-6 px-4 sm:px-6">
    <!-- Header avec Photo de Profil et Bascule -->
    <div class="container mx-auto max-w-4xl flex items-center justify-between mb-6">
      <div class="flex items-center space-x-4">
        <div class="relative">
          <img v-if="user.photo" :src="`http://localhost:8000/storage/${user.photo}`" alt="Photo de profil"
            class="w-16 h-16 rounded-full object-cover border-2 border-[var(--espace-vert)] transition-opacity duration-300" />
          <div v-else
            class="w-16 h-16 rounded-full flex items-center justify-center bg-gray-200 text-[var(--espace-gris)]">
            <i class="fas fa-user-circle text-4xl text-gray-500"></i>
          </div>
          <button @click="showEditMenu = !showEditMenu"
            class="absolute bottom-0 right-0 w-6 h-6 bg-[var(--espace-or)] text-[var(--espace-vert)] rounded-full flex items-center justify-center hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] transition-colors focus:outline-none"
            aria-label="Modifier la photo de profil">
            <i class="fas fa-pencil-alt text-xs"></i>
          </button>
          <div v-if="showEditMenu"
            class="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-36 bg-white border border-gray-200 rounded-md shadow-lg z-10">
            <button @click="toggleCamera(true)"
              class="w-full text-left px-4 py-2 text-[var(--espace-gris)] hover:bg-gray-100 rounded-t-md transition-colors"
              aria-label="Utiliser la caméra">
              Caméra
            </button>
            <button @click="openFileInput"
              class="w-full text-left px-4 py-2 text-[var(--espace-gris)] hover:bg-gray-100 rounded-b-md transition-colors"
              aria-label="Ouvrir la galerie">
              Galerie
            </button>
          </div>
          <input ref="fileInput" type="file" accept="image/*" @change="handleFileChange" class="hidden" />
        </div>
        <h1 class="text-2xl sm:text-3xl font-bold text-[var(--espace-vert)]">Mon Profil</h1>
      </div><!-- Si l'utilisateur est commerçant -->
      <div v-if="user.commercant" class="flex items-center space-x-2">
        <i class="fas fa-store text-[var(--espace-or)] text-xl"></i>
        <button @click="isMerchantProfile = !isMerchantProfile"
          class="text-[var(--espace-or)] hover:text-[var(--espace-vert)] transition-colors"
          aria-label="Basculer vers le compte commerçant">
          Compte Commerçant
        </button>
      </div>

      <!-- Sinon proposer la création -->
      <div v-else>
        <button @click="router.push('/commercant/create')"
          class="bg-[var(--espace-or)] text-[var(--espace-vert)] px-4 py-2 rounded-md font-medium hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] transition-colors"
          aria-label="Créer un compte commerçant">
          Devenir commerçant
        </button>
      </div>

    </div>

    <!-- Contenu du Profil -->
    <div class="container mx-auto max-w-4xl">
      <component :is="currentProfileComponent" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '../stores/Auth';
import apiClient from '../api';
import UserProfile from './UserProfile.vue';
import MerchantProfile from './MerchantProfile.vue';
const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();
const user = ref(authStore.user || {});
const showEditMenu = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File | null>(null);
const previewUrl = ref<string | null>(null);
const uploading = ref(false);
const isMerchantProfile = ref(false);

const currentProfileComponent = computed(() => (isMerchantProfile.value ? MerchantProfile : UserProfile));

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    if (file.size > 2 * 1024 * 1024) {
      toast.error('La photo doit être inférieure à 2 Mo.');
      return;
    }
    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner un fichier image.');
      return;
    }
    selectedFile.value = file;
    previewUrl.value = URL.createObjectURL(file);
    showEditMenu.value = false;
  }
};

const openFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click();
    showEditMenu.value = false;
  }
};

const uploadProfilePicture = async () => {
  if (!selectedFile.value) return;
  uploading.value = true;
  try {
    const formData = new FormData();
    formData.append('photo', selectedFile.value);
    const response = await apiClient.post('/profile/photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    user.value.photo = response.data.photo;
    authStore.user = user.value;
    toast.success('Photo de profil mise à jour avec succès.');
    selectedFile.value = null;
    previewUrl.value = null;
  } catch (error: any) {
    toast.error(error.response?.data.message || 'Erreur lors de la mise à jour de la photo.');
  } finally {
    uploading.value = false;
  }
};

watch(() => authStore.user, (newUser) => {
  user.value = newUser || {};
}, { immediate: true });

onMounted(() => {
  // Logique de montage si nécessaire
});

onUnmounted(() => {
  // Nettoyage si nécessaire
});
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

.fas {
  /* font-size: 4rem; */
}

input[type="file"] {
  display: none;
}
</style>