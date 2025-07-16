<script setup lang="ts">
import { defineProps } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/Auth';

const props = defineProps<{
  produit: {
    id: string;
    nom: string;
    description?: string;
    prix: number;
    photo_url?: string;
    collaboratif: boolean;
    marge_min?: number;
  };
}>();

const router = useRouter();
const authStore = useAuthStore();
const user = authStore.user;

const viewProduit = () => {
  console.log(props.produit.id);
  router.push({ path: `/produits/${props.produit.id}` });
};
console.log(props.produit.collaboratif);


</script>

<template>
  <div @click="viewProduit"
    class="border rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md transition bg-[var(--espace-blanc)] max-w-xs w-full cursor-pointer relative"
    :aria-label="`Voir les détails de ${props.produit.nom}`" role="button" tabindex="0" @keydown.enter="viewProduit">
    <!-- Indicateur collaboratif -->

    <img src='/src/assets/images/selphie.jpg' :alt=" `Image de
      ${props.produit.nom}`" class="w-full h-32 sm:h-36 object-cover rounded mb-2" />
    <h3 class="text-base sm:text-lg flex justify-between font-semibold text-[var(--espace-vert)] truncate font-poppins">
      {{ props.produit.nom }}
      <span v-if="props.produit.collaboratif" class=" top-2 right-2 text-[var(--espace-or)]"
        :title="user?.commercant?.id === props.produit.commercant_id ? 'Vous ne pouvez pas collaborer sur votre produit' : 'Produit ouvert à la collaboration'"
        aria-label="Produit collaboratif">
        <i class="fas fa-handshake text-lg"></i>
      </span>
    </h3>
    <p class="text-[var(--espace-gris)] text-xs sm:text-sm truncate">
      {{ props.produit.description || 'Aucune description' }}
    </p>
    <p class="text-[var(--espace-or)] font-bold text-sm sm:text-base">{{ props.produit.prix }} FCFA</p>
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