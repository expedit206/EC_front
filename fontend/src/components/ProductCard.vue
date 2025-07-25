<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { useToast } from 'vue-toastification';
import { useProductStore } from '../stores/product';

const props = defineProps<{
  produit: {
    id: string;
    nom: string;
    description: string;
    prix: number;
    photo_url: string;
    views_count: number; // Correction de "view_count" à "views_count" pour cohérence
    favorites_count: number;
    is_favorited_by: boolean;
    collaboratif: boolean; // Ajout pour indiquer si le produit est collaboratif
    boosted_until: string | null; // Ajout pour gérer les boosts
  };
}>();

const emit = defineEmits(['toggle-favorite', 'handleToggleFavorite']);
const toast = useToast();
const productStore = useProductStore();
console.log(props.produit);

const handleFavorite = async () => {
  try {
    await productStore.toggleFavorite(props.produit.id);
    emit('toggle-favorite', props.produit.id); // Émettre l'événement si nécessaire
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour des favoris.');
  }
};
</script>

<template>
  <div 
    class="bg-[var(--espace-blanc)] border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-200">
    <router-link :to="`/produits/${produit.id}`" class="block relative">
      <img :src="produit.photo_url || 'https://via.placeholder.com/150'" :alt="`Image de ${produit.nom}`"
        class="w-full h-32 object-cover rounded-lg mb-2" />
      <!-- Badge Collaboratif -->
      <span v-if="produit.collaboratif"
        class="absolute top-2 left-2 bg-[var(--espace-or)] text-[var(--espace-vert)] text-[10px] font-semibold px-2 py-1 rounded-full font-poppins"
        aria-label="Produit collaboratif">
        Collaboratif
      </span>
      <!-- Badge Boosté -->
      <span v-if="produit.boosted_until && new Date(produit.boosted_until) > new Date()"
        class="absolute top-2 right-2 bg-[var(--espace-or)] text-[var(--espace-vert)] text-[10px] font-semibold px-2 py-1 rounded-full font-poppins"
        aria-label="Produit boosté">
        Boosté
      </span>
      <h3 class="text-sm font-semibold text-[var(--espace-vert)] font-poppins truncate">
        {{ produit.nom }}
      </h3>
      <p class="text-xs text-[var(--espace-gris)] truncate">{{ produit.description || 'Aucune description' }}</p>
      <p class="text-sm font-medium text-[var(--espace-or)]">{{ produit.prix }} XAF</p>
    </router-link>
    <div class="flex items-center justify-between mt-2 text-xs text-[var(--espace-gris)]">
      <div class="flex items-center gap-1">
        <i class="fas fa-eye text-[10px]"></i>
        <span>{{ produit.raw_views_count }} vues</span>
      </div>
      <div class="flex items-center gap-1">
        <button @click="handleFavorite"
          class="text-[var(--espace-vert)] hover:text-[var(--espace-or)] transition active:scale-95 focus:outline-none"
          :aria-label="produit.is_favorited_by ? 'Retirer des favoris' : 'Ajouter aux favoris'">
          <i class="fas fa-bookmark text-sm" :class="{ 'text-[var(--espace-or)]': produit.is_favorited_by }"></i>
        </button>
        <span>{{ produit.favorites_count }} favoris</span>
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
</style>