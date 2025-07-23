<!-- src/components/BoutiqueCard.vue -->
<template>
    <div class="border rounded-lg p-4 shadow-md hover:shadow-lg transition bg-[var(--espace-blanc)]">
        <img :src="boutique.logo || 'https://via.placeholder.com/150'" alt="Boutique"
            class="w-full h-48 object-cover rounded mb-4" />
        <h3 class="text-lg font-semibold text-[var(--espace-vert)]">{{ boutique.nom }}</h3>
        <p class="text-[var(--espace-gris)] text-sm">{{ boutique.description || 'Aucune description' }}</p>
        <p class="text-[var(--espace-or)] font-bold">{{ boutique.ville }}</p>
        <router-link :to="{ name: 'boutique', params: { id: boutique.id } }"
            class="mt-2 inline-block bg-[var(--espace-or)] text-[var(--espace-vert)] px-4 py-2 rounded hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] flex items-center">
            <i class="fas fa-store mr-2"></i> Voir la boutique
        </router-link>
    </div>
</template>

<script setup>
defineProps({
    boutique: Object,
})
</script>