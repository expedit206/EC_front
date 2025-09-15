<!-- src/components/ProductCardSkeleton.vue -->
<template>
  <div
    class="bg-[var(--espace-blanc)] border border-gray-200 rounded-lg p-3 shadow-sm animate-pulse"
  >
    <!-- Placeholder pour l'image -->
    <div class="w-full h-32 bg-gray-300 rounded-lg mb-2"></div>
    <!-- Placeholders pour le texte -->
    <div class="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
    <div class="h-3 bg-gray-300 rounded w-1/2 mb-2"></div>
    <div class="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
    <!-- Placeholder pour les stats -->
    <div class="flex justify-between mt-2">
      <div class="h-3 bg-gray-300 rounded w-1/4"></div>
      <div class="h-3 bg-gray-300 rounded w-1/4"></div>
    </div>
  </div>
</template>

<style scoped>
.animate-pulse {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
}
</style>