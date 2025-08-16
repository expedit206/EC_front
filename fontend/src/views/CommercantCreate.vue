<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import apiClient from '../api';

const router = useRouter();
const toast = useToast();

// Données du formulaire
const commerçant = ref({
    nom: '',
    ville: '',
    email: '',
    telephone: '',
    photo: null as File | null,
});
const isLoading = ref(false);
const errors = ref<{ [key: string]: string }>({});

// Gestion de l'upload de la photo
const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
        commerçant.value.photo = target.files[0];
    }
};

// Soumettre le formulaire
const submitForm = async () => {
    isLoading.value = true;
    errors.value = {};

    try {
        const formData = new FormData();
        formData.append('nom', commerçant.value.nom);
        formData.append('ville', commerçant.value.ville);
        formData.append('email', commerçant.value.email);
        formData.append('telephone', commerçant.value.telephone);
        if (commerçant.value.photo) {
            formData.append('photo', commerçant.value.photo);
        }

        const response = await apiClient.post('/commercants', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
console.log(response.data.message)
        toast.success('Commerçant créé avec succès !');
        router.push('/profil')  ; // Rediriger vers la liste des commerçants
    } catch (error: any) {
        if (error.response?.data?.errors) {
            errors.value = error.response.data.errors;
        } else {
            toast.error('Erreur lors de la création du commerçant');
        }
        console.error(error);
    } finally {
        isLoading.value = false;
    }
};
</script>

<template>
    <div class="overflow-y-scroll bg-gray-100 pt-16 pb-20 px-4 sm:px-6">
        <div class="container mx-auto max-w-2xl">
            <!-- Titre -->
            <h1 class="text-2xl sm:text-3xl font-bold text-[var(--espace-vert)] mb-6 font-poppins">
                <i class="fas fa-store mr-2 text-[var(--espace-or)]"></i> Créer un Commerçant
            </h1>

            <!-- Formulaire -->
            <div class="bg-white rounded-lg shadow-md p-6">
                <form @submit.prevent="submitForm" class="space-y-6">
                    <!-- Nom -->
                    <div>
                        <label for="nom" class="block text-sm font-medium text-[var(--espace-vert)]">Nom *</label>
                        <input v-model="commerçant.nom" id="nom" type="text"
                            class="mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[var(--espace-vert)]"
                            placeholder="Nom du commerçant" required />
                        <span v-if="errors.nom" class="text-red-500 text-xs">{{ errors.nom }}</span>
                    </div>

                    <!-- Ville -->
                    <div>
                        <label for="ville" class="block text-sm font-medium text-[var(--espace-vert)]">Ville *</label>
                        <input v-model="commerçant.ville" id="ville" type="text"
                            class="mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[var(--espace-vert)]"
                            placeholder="Ville" required />
                        <span v-if="errors.ville" class="text-red-500 text-xs">{{ errors.ville }}</span>
                    </div>

                    <!-- Email -->
                    <div>
                        <label for="email" class="block text-sm font-medium text-[var(--espace-vert)]">Email</label>
                        <input v-model="commerçant.email" id="email" type="email"
                            class="mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[var(--espace-vert)]"
                            placeholder="email@exemple.com" />
                        <span v-if="errors.email" class="text-red-500 text-xs">{{ errors.email }}</span>
                    </div>

                    <!-- Téléphone -->
                    <div>
                        <label for="telephone"
                            class="block text-sm font-medium text-[var(--espace-vert)]">Téléphone</label>
                        <input v-model="commerçant.telephone" id="telephone" type="tel"
                            class="mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[var(--espace-vert)]"
                            placeholder="+237 6XX XX XX XX" />
                        <span v-if="errors.telephone" class="text-red-500 text-xs">{{ errors.telephone }}</span>
                    </div>

                    <!-- Photo -->
                    <div>
                        <label for="photo" class="block text-sm font-medium text-[var(--espace-vert)]">Photo
                            (optionnel)</label>
                        <input id="photo" type="file" @change="handleFileChange"
                            class="mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[var(--espace-vert)]"
                            accept="image/*" />
                        <span v-if="errors.photo" class="text-red-500 text-xs">{{ errors.photo }}</span>
                    </div>

                    <!-- Bouton de soumission -->
                    <div>
                        <button type="submit" :disabled="isLoading"
                            class="w-full bg-[var(--espace-or)] text-[var(--espace-vert)] px-4 py-2 rounded hover:bg-[var(--espace-vert)] hover:text-white transition disabled:opacity-50">
                            <span v-if="isLoading">
                                <i class="fas fa-spinner animate-spin mr-2"></i> Création en cours...
                            </span>
                            <span v-else>
                                <i class="fas fa-plus mr-2"></i> Créer le commerçant
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

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

.animate-spin {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

@media (max-width: 640px) {
    .container {
        padding: 0 1rem;
    }
}
</style>