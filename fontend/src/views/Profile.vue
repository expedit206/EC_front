<template>
  <div class="overflow-y-auto min-h-screen relative bg-gray-100 py-8  sm:px-6">
    <!-- Header Profil -->
    <div class="  flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
      <div class="flex items-center space-x-4 relative w-full gap-1 px-3">
        <!-- Photo utilisateur -->
        <div class="relative ">
          <img v-if="user.photo" :src="`http://localhost:8000/storage/${user.photo}`" alt="Photo de profil"
            class="w-16 h-16 rounded-full object-cover border-2 border-[var(--espace-vert)]" />
          <div v-else class="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
            <i class="fas fa-user-circle text-4xl"></i>
          </div>

          <!-- Couronne -->
          <i v-if="user.premium"
            class="fas fa-crown text-yellow-400 absolute -top-2 -right-2 text-lg p-1 rounded-full "></i>

          <!-- Bouton modifier -->
          <button @click="showEditMenu = !showEditMenu"
            class="absolute bottom-0 right-0 w-6 h-6 bg-[var(--espace-or)] text-[var(--espace-vert)] rounded-full flex items-center justify-center hover:bg-[var(--espace-vert)] hover:text-white">
            <i class="fas fa-pencil-alt text-xs"></i>
          </button>

          <!-- Menu édition -->
          <div v-if="showEditMenu"
            class="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-36 bg-white border rounded-md shadow z-10">
            <button @click="openCamera" class="w-full text-left px-4 py-2 hover:bg-gray-100">Caméra</button>
            <button @click="openGallery" class="w-full text-left px-4 py-2 hover:bg-gray-100">Galerie</button>
          </div>
        </div>

        <!-- Input caché galerie -->
        <input ref="galleryInput" type="file" accept="image/*" class="hidden" @change="handleFileChange" />

        <!-- Infos utilisateur -->
        <div class="space-y-1">
          <h1 class="text-2xl sm:text-3xl font-bold text-[var(--espace-vert)] flex items-center gap-2">
            Mon Profil
            <span v-if="user.premium"
              class="bg-yellow-400 text-yellow-900 text-xs px-3 py-1 rounded-full uppercase font-bold">Premium</span>
          </h1>
          <span v-if="user.subscription_ends_at" class="text-sm text-gray-500">
            Jusqu'au {{ new Date(user.subscription_ends_at).toLocaleDateString() }}
          </span>
        </div>

        <!-- Preview et confirmation -->
        <div v-if="previewUrl" class="ml-4 flex items-center gap-2">
          <img :src="previewUrl" alt="Preview" class="w-12 h-12 rounded-full object-cover" />
          <button @click="uploadProfilePicture" :disabled="uploading"
            class="bg-[var(--espace-vert)] text-white px-3 py-1 rounded hover:bg-[var(--espace-or)] hover:text-[var(--espace-vert)]"
            :class="{ 'opacity-50 cursor-not-allowed': uploading }">
            {{ uploading ? 'Upload...' : 'Confirmer' }}
          </button>
          <button @click="cancelUpload" class="text-red-500 hover:text-red-700">Annuler</button>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row gap-2 items-center">
        <button v-if="user.commercant" @click="isMerchantProfile = !isMerchantProfile"
          class="text-[var(--espace-or)] hover:text-[var(--espace-vert)] font-medium flex items-center gap-1">
          <i class="fas fa-store"></i> Compte Commerçant
        </button>
        <button v-else @click="router.push('/commercant/create')"
          class="bg-[var(--espace-or)] text-[var(--espace-vert)] px-4 py-2 rounded-md font-semibold hover:bg-[var(--espace-vert)] hover:text-white">
          Devenir commerçant
        </button>
        <button v-if="!user.premium" @click="showSubscriptionModal = true"
          class="bg-[var(--espace-vert)] text-white px-4 py-2 rounded-md font-semibold hover:bg-[var(--espace-or)] hover:text-[var(--espace-vert)]">
          Passer Premium
        </button>
      </div>
    </div>

    <!-- Composant dynamique -->
    <div class="container mx-auto max-w-4xl">
      <component :is="currentProfileComponent" />
    </div>

    <!-- Modal abonnement -->
    <SubscriptionModal v-if="showSubscriptionModal" :is-open="showSubscriptionModal"
      @close="showSubscriptionModal = false" @upgraded="handleUpgraded" />

    <!-- Zone vidéo caméra (si ouverte) -->
    <div v-if="showCameraModal" class="fixed inset-0 bg-black  bg-opacity-0 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-4 relative w-full max-w-md">
        <video ref="videoRef" autoplay playsinline class="rounded w-full" />
        <div class="mt-2 flex justify-between">
          <button @click="capturePhoto"
            class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Capturer</button>
          <button @click="closeCamera" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Annuler</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '../stores/Auth';
import apiClient from '../api';
import SubscriptionModal from '../components/SubscriptionModal.vue';
import UserProfile from './UserProfile.vue';
import MerchantProfile from './MerchantProfile.vue';

const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();

const user = ref(authStore.user || {});
const showEditMenu = ref(false);
const uploading = ref(false);
const previewUrl = ref<string | null>(null);
const selectedFile = ref<File | null>(null);
const showSubscriptionModal = ref(false);
const isMerchantProfile = ref(false);

const currentProfileComponent = computed(() =>
  isMerchantProfile.value ? MerchantProfile : UserProfile
);

// Refs pour input et camera
const galleryInput = ref<HTMLInputElement | null>(null);
const videoRef = ref<HTMLVideoElement | null>(null);
const showCameraModal = ref(false);
let cameraStream: MediaStream | null = null;

// === Gestion Galerie ===
const openGallery = () => {
  galleryInput.value?.click();
  showEditMenu.value = false;
};

const handleFileChange = (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image trop volumineuse (max 2Mo).');
      return;
    }
    selectedFile.value = file;
    previewUrl.value = URL.createObjectURL(file);
  }
};

// === Gestion Caméra ===
const openCamera = async () => {
  try {
    cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
    showCameraModal.value = true;
    showEditMenu.value = false;
    // 🟢 On affiche d'abord la modale

    // ⏳ Laisse un court délai pour que la vidéo soit rendue dans le DOM
    setTimeout(() => {
      if (videoRef.value) {
        videoRef.value.srcObject = cameraStream;
      }
    }, 100); // Petit délai pour s'assurer que videoRef existe
  } catch (err) {
    toast.error("Impossible d'accéder à la caméra.");
    console.error(err);
  }
};

const capturePhoto = () => {
  if (!videoRef.value) return;
  const video = videoRef.value;
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  canvas.toBlob((blob) => {
    if (blob) {
      selectedFile.value = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
      previewUrl.value = URL.createObjectURL(selectedFile.value);
      closeCamera();
    }
  }, 'image/jpeg');
};

const closeCamera = () => {
  if (cameraStream) {
    cameraStream.getTracks().forEach((track) => track.stop());
    cameraStream = null;
  }
  showCameraModal.value = false;
};

// === Upload ===
const cancelUpload = () => {
  selectedFile.value = null;
  previewUrl.value = null;
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
    if (response.data.photo) {
      user.value.photo = response.data.photo;
      authStore.user = user.value;
      toast.success('Photo mise à jour.');
      cancelUpload();
    }
  } catch (err: any) {
    toast.error(err.response?.data?.message || "Erreur lors de l'envoi.");
  } finally {
    uploading.value = false;
  }
};


const handleUpgraded = async () => {
  showSubscriptionModal.value = false;
};

watch(() => authStore.user, (newUser) => {
  user.value = newUser || {};
}, { immediate: true });

onMounted(() => {
});

onUnmounted(() => {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
  if (cameraStream) cameraStream.getTracks().forEach(track => track.stop());
});
</script>

<style scoped>
:root {
  --espace-vert: #14532d;
  --espace-or: #facc15;
  --espace-blanc: #ffffff;
  --espace-gris: #6b7280;
}
</style>
