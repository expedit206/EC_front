<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useToast } from 'vue-toastification';
import axios from 'axios';
import ProductCard from '../components/ProductCard.vue';
import AppHeader from '../components/AppHeader.vue';

const products = ref<any[]>([]);
const currentPage = ref(1);
const lastPage = ref(1);
const isLoading = ref(false);
const showFilters = ref(false);
const categories = ref<any[]>([]);
const toast = useToast();

const filterForm = ref({
    category: '',
    prix_min: '',
    prix_max: '',
    ville: '',
    collaboratif: '',
});

const villes = ref(['Douala', 'Yaoundé', 'Bamenda', 'Buea', 'Garoua']); // Liste statique, peut être dynamique

const fetchCategories = async () => {
    try {
        const response = await axios.get('http://localhost:8000/api/categories');
        categories.value = response.data.categories;
    } catch (error) {
        toast.error('Erreur lors du chargement des catégories.');
    }
};

const fetchProducts = async (reset = false) => {
    if (isLoading.value || (!reset && currentPage.value > lastPage.value)) return;

    isLoading.value = true;
    if (reset) {
        products.value = [];
        currentPage.value = 1;
        lastPage.value = 1;
    }

    try {
        const params = {
            page: currentPage.value,
            category: filterForm.value.category || undefined,
            prix_min: filterForm.value.prix_min || undefined,
            prix_max: filterForm.value.prix_max || undefined,
            ville: filterForm.value.ville || undefined,
            collaboratif: filterForm.value.collaboratif || undefined,
        };
        const response = await axios.get('http://localhost:8000/api/produits', { params });
        products.value = reset ? response.data.data : [...products.value, ...response.data.data];
        currentPage.value = response.data.current_page + 1;
        lastPage.value = response.data.last_page;
    } catch (error) {
        toast.error('Erreur lors du chargement des produits.');
    } finally {
        isLoading.value = false;
    }
};

const applyFilters = () => {
    if (filterForm.value.prix_min && filterForm.value.prix_max) {
        if (parseFloat(filterForm.value.prix_min) > parseFloat(filterForm.value.prix_max)) {
            toast.error('Le prix minimum doit être inférieur au prix maximum.');
            return;
        }
    }
    fetchProducts(true); // Réinitialiser les produits
    showFilters.value = false; // Fermer les filtres sur mobile
};

const resetFilters = () => {
    filterForm.value = { category: '', prix_min: '', prix_max: '', ville: '', collaboratif: '' };
    fetchProducts(true);
};

const observer = ref<IntersectionObserver | null>(null);
const loadMoreTrigger = ref<HTMLElement | null>(null);

onMounted(() => {
    fetchCategories();
    fetchProducts();

    observer.value = new IntersectionObserver(
        (entries) => {
            if (entries[0].isIntersecting && !isLoading.value && currentPage.value <= lastPage.value) {
                fetchProducts();
            }
        },
        { threshold: 0.1 }
    );

    if (loadMoreTrigger.value) {
        observer.value.observe(loadMoreTrigger.value);
    }
});

onUnmounted(() => {
    if (observer.value && loadMoreTrigger.value) {
        observer.value.unobserve(loadMoreTrigger.value);
    }
});
</script>

<template>
    <div class="min-h-screen bg-gray-100" :style="{ background: 'url(/src/assets/images/bginsc.jpg) center/cover' }">
        <AppHeader />

        <div class="container mx-auto px-4 sm:px-6 py-6">
            <!-- Bouton toggle pour les filtres (mobile) -->
            <div class="flex justify-between items-center mb-4 sm:hidden">
                <h1
                    class="text-2xl sm:text-3xl font-bold text-[var(--espace-vert)] flex items-center gap-2 select-none">
                    <i class="fas fa-box"></i> Nos Produits
                </h1>
                <button @click="showFilters = !showFilters"
                    class="flex items-center justify-center w-10 h-10 bg-[var(--espace-or)] text-[var(--espace-vert)] rounded-lg hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] transition"
                    :aria-label="showFilters ? 'Masquer les filtres' : 'Afficher les filtres'"
                    :aria-expanded="showFilters">
                    <i class="fas fa-filter text-xl"></i>
                </button>
            </div>

            <div class="flex flex-col sm:flex-row gap-4">
                <!-- Filtres (barre latérale sur desktop, collapsible sur mobile) -->
                <Transition name="slide">
                    <aside v-if="showFilters || !isMobile"
                        class="sm:w-64 bg-[rgba(255,255,255,0.95)] rounded-2xl shadow-lg p-4 sm:p-6 sm:sticky sm:top-20"
                        :class="{ 'fixed inset-0 z-50 sm:static': showFilters }">
                        <h2
                            class="text-lg sm:text-xl font-semibold text-[var(--espace-vert)] flex items-center gap-2 mb-4 select-none">
                            <i class="fas fa-filter"></i> Filtres
                        </h2>
                        <form @submit.prevent="applyFilters" class="space-y-4">
                            <div>
                                <label class="block text-[var(--espace-gris)] text-sm font-medium mb-1 select-none"
                                    for="category">
                                    Catégorie
                                </label>
                                <select v-model="filterForm.category" id="category"
                                    class="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--espace-vert)] transition">
                                    <option value="">Toutes</option>
                                    <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.nom }}
                                    </option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-[var(--espace-gris)] text-sm font-medium mb-1 select-none"
                                    for="prix_min">
                                    Prix minimum (FCFA)
                                </label>
                                <input v-model="filterForm.prix_min" id="prix_min" type="number" min="0"
                                    class="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--espace-vert)] transition"
                                    placeholder="Ex: 1000" />
                            </div>
                            <div>
                                <label class="block text-[var(--espace-gris)] text-sm font-medium mb-1 select-none"
                                    for="prix_max">
                                    Prix maximum (FCFA)
                                </label>
                                <input v-model="filterForm.prix_max" id="prix_max" type="number" min="0"
                                    class="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--espace-vert)] transition"
                                    placeholder="Ex: 50000" />
                            </div>
                            <div>
                                <label class="block text-[var(--espace-gris)] text-sm font-medium mb-1 select-none"
                                    for="ville">
                                    Ville
                                </label>
                                <select v-model="filterForm.ville" id="ville"
                                    class="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--espace-vert)] transition">
                                    <option value="">Toutes</option>
                                    <option v-for="ville in villes" :key="ville" :value="ville">{{ ville }}</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-[var(--espace-gris)] text-sm font-medium mb-1 select-none"
                                    for="collaboratif">
                                    Collaboratif
                                </label>
                                <select v-model="filterForm.collaboratif" id="collaboratif"
                                    class="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--espace-vert)] transition">
                                    <option value="">Tous</option>
                                    <option value="true">Oui</option>
                                    <option value="false">Non</option>
                                </select>
                            </div>
                            <div class="flex gap-2">
                                <button type="submit"
                                    class="w-full bg-[var(--espace-or)] text-[var(--espace-vert)] font-semibold p-2 sm:p-3 rounded-lg hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] transition flex items-center justify-center gap-2 text-sm"
                                    aria-label="Appliquer les filtres">
                                    <i class="fas fa-check"></i>
                                    <span class="hidden sm:inline">Appliquer</span>
                                </button>
                                <button @click="resetFilters" type="button"
                                    class="w-full bg-[var(--espace-gris)] text-[var(--espace-blanc)] font-semibold p-2 sm:p-3 rounded-lg hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] transition flex items-center justify-center gap-2 text-sm"
                                    aria-label="Réinitialiser les filtres">
                                    <i class="fas fa-times"></i>
                                    <span class="hidden sm:inline">Réinitialiser</span>
                                </button>
                            </div>
                        </form>
                    </aside>
                </Transition>

                <!-- Liste des produits -->
                <div class="flex-1">
                    <h1
                        class="text-2xl sm:text-3xl font-bold text-[var(--espace-vert)] flex items-center gap-2 mb-4 select-none hidden sm:flex">
                        <i class="fas fa-box"></i> Nos Produits
                    </h1>
                    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        <ProductCard v-for="produit in products" :key="produit.id" :produit="produit" />
                    </div>
                    <div ref="loadMoreTrigger" class="h-10 flex items-center justify-center" aria-live="polite"
                        aria-busy="isLoading">
                        <div v-if="isLoading" class="flex items-center gap-2 text-[var(--espace-vert)]">
                            <i class="fas fa-spinner animate-spin text-2xl"></i>
                            <span class="text-sm font-poppins">Chargement...</span>
                        </div>
                        <p v-else-if="currentPage > lastPage" class="text-[var(--espace-gris)] text-sm font-poppins">
                            Aucun produit supplémentaire
                        </p>
                    </div>
                </div>
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

.slide-enter-active,
.slide-leave-active {
    transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
    transform: translateX(-100%);
}
</style>