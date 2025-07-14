<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useToast } from 'vue-toastification';
import ProductCard from '../components/ProductCard.vue';
import AppHeader from '../components/AppHeader.vue';
import apiClient from '../api';

const products = ref<any[]>([]);
const currentPage = ref(1);
const lastPage = ref(1);
const isLoading = ref(false);
const showFilters = ref(false);
const categories = ref<any[]>([]);
const toast = useToast();

const filterForm = ref({
    search: '', // Nouveau champ de recherche
    category: '',
    prix_min: '',
    prix_max: '',
    ville: '',
    collaboratif: '',
});

const villes = ref(['Douala', 'Yaoundé', 'Bamenda', 'Buea', 'Garoua']);

const fetchCategories = async () => {
    try {
        const response = await apiClient.get('/categories');
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
            search: filterForm.value.search || undefined, // Ajout du paramètre de recherche
            category: filterForm.value.category || undefined,
            prix_min: filterForm.value.prix_min || undefined,
            prix_max: filterForm.value.prix_max || undefined,
            ville: filterForm.value.ville || undefined,
            collaboratif: filterForm.value.collaboratif || undefined,
        };
        const response = await apiClient.get('/produits', { params });
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
    fetchProducts(true);
    showFilters.value = false;
};

const resetFilters = () => {
    filterForm.value = { search: '', category: '', prix_min: '', prix_max: '', ville: '', collaboratif: '' };
    fetchProducts(true);
};

// Compter les filtres actifs (exclut les champs vides)
const activeFiltersCount = () => {
    return Object.values(filterForm.value).filter(val => val !== '').length;
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
    <div class="min-h-screen bg-gray-100" 
    >
        <AppHeader />

        <div class="container mx-auto px-4 sm:px-6 py-4">
            <!-- Bouton toggle pour les filtres (mobile) avec badge -->
            <div class="flex justify-between items-center mb-3 sm:mb-4">
                <h1 class="text-xl sm:text-2xl font-bold text-[var(--espace-vert)] flex items-center gap-2 select-none">
                    <i class="fas fa-box"></i> Nos Produits
                </h1>
                <button @click="showFilters = !showFilters"
                    class="sm:hidden relative flex items-center justify-center w-8 h-8 bg-[var(--espace-or)] text-[var(--espace-vert)] rounded-lg hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] transition"
                    :aria-label="showFilters ? 'Masquer les filtres' : 'Afficher les filtres'"
                    :aria-expanded="showFilters">
                    <i class="fas fa-filter text-base"></i>
                    <span v-if="activeFiltersCount() > 0"
                        class="absolute -top-1 -right-1 bg-[var(--espace-vert)] text-[var(--espace-blanc)] text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {{ activeFiltersCount() }}
                    </span>
                </button>
            </div>

            <!-- Filtres (horizontal sur desktop, coulissant depuis le bas sur mobile) -->
            <Transition name="slide-up">
                <div v-if="showFilters"
                    class="sm:flex bg-[rgba(255,255,255,0.85)] rounded-xl shadow-md p-3 sm:p-4 mb-4 sm:items-center sm:gap-2 sm:flex-wrap relative"
                    :class="{ 'fixed bottom-0 left-0 right-0 z-50 sm:static': showFilters }">
                    <!-- Badge pour filtres actifs (desktop) -->
                    <span v-if="activeFiltersCount() > 0"
                        class="sm:block hidden absolute -top-2 -right-2 bg-[var(--espace-vert)] text-[var(--espace-blanc)] text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {{ activeFiltersCount() }}
                    </span>
                    <form @submit.prevent="applyFilters" class="flex flex-col sm:flex-row gap-2 sm:gap-3">
                        <div class="flex-1 min-w-[120px]">
                            <input v-model="filterForm.search" id="search" type="text"
                                class="w-full h-8 p-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--espace-vert)] transition"
                                placeholder="Rechercher..." aria-label="Rechercher un produit" />
                        </div>
                        <div class="flex-1 min-w-[120px]">
                            <select v-model="filterForm.category" id="category"
                                class="w-full h-8 p-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--espace-vert)] transition">
                                <option value="">Catégorie</option>
                                <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.nom }}</option>
                            </select>
                        </div>
                        <div class="flex-1 min-w-[100px]">
                            <input v-model="filterForm.prix_min" id="prix_min" type="number" min="0"
                                class="w-full h-8 p-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--espace-vert)] transition"
                                placeholder="Prix min" aria-label="Prix minimum" />
                        </div>
                        <div class="flex-1 min-w-[100px]">
                            <input v-model="filterForm.prix_max" id="prix_max" type="number" min="0"
                                class="w-full h-8 p-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--espace-vert)] transition"
                                placeholder="Prix max" aria-label="Prix maximum" />
                        </div>
                        <div class="flex-1 min-w-[120px]">
                            <select v-model="filterForm.ville" id="ville"
                                class="w-full h-8 p-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--espace-vert)] transition">
                                <option value="">Ville</option>
                                <option v-for="ville in villes" :key="ville" :value="ville">{{ ville }}</option>
                            </select>
                        </div>
                        <div class="flex-1 min-w-[100px]">
                            <select v-model="filterForm.collaboratif" id="collaboratif"
                                class="w-full h-8 p-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--espace-vert)] transition">
                                <option value="">Collaboratif</option>
                                <option value="true">Oui</option>
                                <option value="false">Non</option>
                            </select>
                        </div>
                        <div class="flex gap-2 sm:gap-3">
                            <button type="submit"
                                class="w-8 h-8 bg-[var(--espace-or)] text-[var(--espace-vert)] rounded-lg hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] transition flex items-center justify-center"
                                aria-label="Appliquer les filtres">
                                <i class="fas fa-check text-base"></i>
                            </button>
                            <button @click="resetFilters" type="button"
                                class="w-8 h-8 bg-[var(--espace-gris)] text-[var(--espace-blanc)] rounded-lg hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] transition flex items-center justify-center"
                                aria-label="Réinitialiser les filtres">
                                <i class="fas fa-times text-base"></i>
                            </button>
                        </div>
                    </form>
                </div>
            </Transition>

            <!-- Liste des produits avec animation de fondu -->
            <TransitionGroup name="fade" tag="div"
                class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                <ProductCard v-for="produit in products" :key="produit.id" :produit="produit" />
            </TransitionGroup>
            <div ref="loadMoreTrigger" class="h-10 flex items-center justify-center" aria-live="polite"
                aria-busy="isLoading">
                <div v-if="isLoading" class="flex items-center gap-2 text-[var(--espace-vert)]">
                    <i class="fas fa-spinner animate-spin text-lg"></i>
                    <span class="text-sm font-poppins">Chargement...</span>
                </div>
                <p v-else-if="currentPage > lastPage" class="text-[var(--espace-gris)] text-sm font-poppins">
                    Aucun produit supplémentaire
                </p>
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

.slide-up-enter-active,
.slide-up-leave-active {
    transition: transform 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
    transform: translateY(100%);
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>