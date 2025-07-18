<!-- src/components/ProductCard.vue -->
<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { useToast } from 'vue-toastification';
import { useProductStore } from '../stores/product';

const produit = defineProps({
  id: {
    type: String,
    required: true,
  },
  nom: String,
  description: String,
  prix: Number,
  photo_url: String,
  view_count: Number,
  favorites_count: Number,
  is_favorited_by: Boolean,
  quantite: Number,
});

const emit = defineEmits(['toggle-favorite']);
const toast = useToast();
const productStore = useProductStore();

const handleFavorite = async () => {
  console.log(produit);
  try {
    
    await productStore.toggleFavorite(produit.id);
    emit('toggle-favorite');
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour des favoris.');
  }
};
</script>

<template>
  <div
    class="bg-[var(--espace-blanc)] border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-200">
    <router-link :to="`/produits/${produit.id}`" class="block">
      <img :src="produit.photo_url || 'https://via.placeholder.com/150'" :alt="`Image de ${produit.nom}`"
        class="w-full h-32 object-cover rounded-lg mb-2" />
      <h3 class="text-sm font-semibold text-[var(--espace-vert)] font-poppins truncate">
        {{ produit.nom }}
      </h3>
      <p class="text-xs text-[var(--espace-gris)] truncate">{{ produit.description || 'Aucune description' }}</p>
      <p class="text-sm font-medium text-[var(--espace-or)]">{{ produit.prix }} XAF</p>
    </router-link>
    <div class="flex items-center justify-between mt-2 text-xs text-[var(--espace-gris)]">
      <div class="flex items-center gap-1">
        <i class="fas fa-eye text-[10px]"></i>
        <span>{{ produit.view_count }} vues</span>
      </div>
      <div class="flex items-center gap-1">
        <i class="fas fa-heart text-[10px]"></i>
        <span>{{ produit.favorites_count }} favoris</span>
      </div>
      <button @click="handleFavorite"
        class="text-[var(--espace-vert)] hover:text-[var(--espace-or)] transition active:scale-95"
        :aria-label="produit.is_favorited_by ? 'Retirer des favoris' : 'Ajouter aux favoris'">
        <i class="fas fa-heart text-sm" :class="{ 'text-[var(--espace-or)]': produit.is_favorited_by }"></i>
      </button>
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