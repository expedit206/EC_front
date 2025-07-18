<!-- src/components/ProductList.vue -->
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useProductStore } from '../stores/product';
import { useToast } from 'vue-toastification';
import Loader from './Loader.vue';

const store = useProductStore();
const toast = useToast();
const observer = ref(null);

onMounted(async () => {
    await store.fetchProducts();
    setupIntersectionObserver();
});

onUnmounted(() => {
    if (observer.value) observer.value.disconnect();
});

const setupIntersectionObserver = () => {
    const target = document.querySelector('#load-more');
    if (!target) return;

    observer.value = new IntersectionObserver(
        (entries) => {
            if (entries[0].isIntersecting && store.hasMore && !store.isLoading) {
                store.fetchProducts(true);
            }
        },
        { threshold: 0.1 }
    );
    observer.value.observe(target);
};

const toggleFavorite = async (productId) => {
    try {
        const message = await store.toggleFavorite(productId);
        toast.success(message, { timeout: 3000 });
    } catch (error) {
        toast.error(error, { timeout: 3000 });
    }
};

const changeSort = (sort) => {
    store.setSort(sort);
};
</script>

<template>
    <div class="min-h-screen bg-[var(--espace-blanc)] p-4">
        <!-- Tri -->
        <div class="flex overflow-x-auto space-x-2 mb-4 snap-x snap-mandatory lg:justify-center">
            <button v-for="option in [
                { id: 'random', label: 'Aléatoire', icon: 'fa-random' },
                { id: 'popular', label: 'Populaire', icon: 'fa-fire' },
                { id: 'favorites', label: 'Favoris', icon: 'fa-heart' },
            ]" :key="option.id" @click="changeSort(option.id)"
                class="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium font-poppins snap-center shrink-0 transition-all duration-200"
                :class="{
                    'bg-[var(--espace-vert)] text-[var(--espace-blanc)]': store.sort === option.id,
                    'bg-gray-100 text-[var(--espace-vert)] hover:bg-[var(--espace-or)] hover:text-[var(--espace-vert)]': store.sort !== option.id,
                }" :aria-label="`Trier par ${option.label}`">
                <i class="fas" :class="option.icon"></i>
                {{ option.label }}
            </button>
        </div>

        <!-- Liste des produits -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <TransitionGroup name="fade">
                <div v-for="product in store.products" :key="product.id"
                    class="bg-[var(--espace-blanc)] border border-gray-200 rounded-md p-4 shadow-sm hover:shadow-md transition-all duration-200">
                    <router-link :to="`/products/${product.id}`" class="block">
                        <img :src="product.image_url || 'https://via.placeholder.com/150'" alt="Image du produit"
                            class="w-full h-40 object-cover rounded-md mb-2" />
                        <h3 class="text-sm font-semibold text-[var(--espace-vert)] font-poppins">
                            {{ product.name }}
                        </h3>
                        <p class="text-xs text-[var(--espace-gris)] truncate">{{ product.description }}</p>
                        <p class="text-sm font-medium text-[var(--espace-or)]">{{ product.price }} FCFA</p>
                    </router-link>
                    <div class="flex items-center justify-between mt-2">
                        <div class="flex items-center gap-2 text-xs text-[var(--espace-gris)]">
                            <i class="fas fa-eye"></i>
                            <span>{{ product.view_count }} vues</span>
                        </div>
                        <div class="flex items-center gap-2 text-xs text-[var(--espace-gris)]">
                            <i class="fas fa-heart"></i>
                            <span>{{ product.favorite_count }} favoris</span>
                        </div>
                        <button @click="toggleFavorite(product.id)"
                            class="text-[var(--espace-vert)] hover:text-[var(--espace-or)] transition"
                            :aria-label="product.is_favorited_by ? 'Retirer des favoris' : 'Ajouter aux favoris'">
                            <i class="fas fa-heart" :class="{ 'text-[var(--espace-or)]': product.is_favorited_by }"></i>
                        </button>
                    </div>
                </div>
            </TransitionGroup>
        </div>

        <!-- Défilement infini -->
        <div v-if="store.hasMore" id="load-more" class="h-10 flex justify-center items-center">
            <Loader :isLoading="store.isLoading" />
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

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(10px);
}

.overflow-x-auto {
    scrollbar-width: none;
    -ms-overflow-style: none;
}

.overflow-x-auto::-webkit-scrollbar {
    display: none;
}

.snap-x>button {
    scroll-snap-align: center;
}
</style>