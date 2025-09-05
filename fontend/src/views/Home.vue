<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useToast } from 'vue-toastification';
import ProductCard from '../components/ProductCard.vue';
import AppHeader from '../components/AppHeader.vue';
import Loader from '../components/Loader.vue';
import apiClient from '../api/index';
import { useProductStore } from '../stores/product';
import { useAuthStore } from '../stores/Auth';

const productStore = useProductStore();
const authStore = useAuthStore();
const categories = ref<any[]>([]);
const toast = useToast();
const showFilters = ref(false);
const filterForm = ref({
    search: '',
    category: '',
    prix_min: '',
    prix_max: '',
    ville: '',
    collaboratif: '',
});
const villes = ref(['Douala', 'Yaoundé', 'Bamenda', 'Buea', 'Garoua']);
const observer = ref<IntersectionObserver | null>(null);
const loadMoreTrigger = ref<HTMLElement | null>(null);


const fetchCategories = async () => {
    try {
        const response = await apiClient.get('/categories');
        categories.value = response.data.categories;
    } catch (error:any) {
        console.error('Erreur lors du chargement des catégories:', error);
        toast.error('Erreur lors du chargement des catégories.');
    }
};

const applyFilters = () => {
    if (filterForm.value.prix_min && filterForm.value.prix_max) {
        if (parseFloat(filterForm.value.prix_min) > parseFloat(filterForm.value.prix_max)) {
            toast.error('Le prix minimum doit être inférieur au prix maximum.');
            return;
        }
    }
    productStore.fetchProducts(filterForm.value, true);
    showFilters.value = false;
};

const resetFilters = () => {
    filterForm.value = { search: '', category: '', prix_min: '', prix_max: '', ville: '', collaboratif: '' };
    productStore.fetchProducts({}, true);
};

const changeSort = (newSort: string) => {
    productStore.setSort(newSort);
};

const activeFiltersCount = () => {
    return Object.values(filterForm.value).filter(val => val !== '').length;
};

const handleMouseOver = (productId: string) => {
    recordView(productId);
};

const handleTouchStart = (productId: string) => {
    recordView(productId);
};

const recordView = async (productId: string) => {
    const userId = authStore.user?.id;
    // if (!userId?? null) {
    //     // toast.error('Connexion requise pour enregistrer la vue.');
    //     return;
    // }

    // Récupérer les vues stockées
    const viewedProducts = JSON.parse(localStorage.getItem('viewedProducts') || '{}');
    const today = new Date().toISOString().split('T')[0]; // Date au format YYYY-MM-DD
    const lastResetDate = localStorage.getItem('lastResetDate');

    // Vider les vues si c'est un nouveau jour
    if (!lastResetDate || lastResetDate !== today) {
        localStorage.removeItem('viewedProducts');
        localStorage.setItem('lastResetDate', today);
    }

    // Vérifier si le produit est déjà dans les vues du jour
    if (await viewedProducts[productId]) {

        return; // Pas d'appel API si déjà vu aujourd'hui
    }

    // console.log(viewedProducts);
    try {
        setTimeout(async () => {

            const response = await apiClient.post(`/record_view`, {
                product_id: productId,
                user_id: userId?? null,
            });
            toast.success(response.data.message);
        }, 1000);


        // Mettre à jour localStorage avec le produit vu
        viewedProducts[productId] = true;
        localStorage.setItem('viewedProducts', JSON.stringify(viewedProducts));
    } catch (error: any) {
        console.error('Erreur lors de l\'enregistrement de la vue:', error);
        toast.error(error.response?.data?.message || 'Erreur lors de l\'enregistrement de la vue.');
    }
};

onMounted(async () => {
    try {
        await productStore.fetchProducts();
        await fetchCategories();
    } catch (error:any) {
        console.error('Erreur lors du chargement des produits ou catégories:', error);
        toast.error('Erreur lors du chargement des produits. Veuillez réessayer.');
    }

    observer.value = new IntersectionObserver(
        (entries) => {
            if (entries[0].isIntersecting && !productStore.isLoading && productStore.hasMore) {
                productStore.fetchProducts(filterForm.value);
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
    <!-- Template inchangé -->
    <div class="pt-4 bg-[var(--espace-blanc)]  max-h-full relative">
        <Loader :isLoading="productStore.isLoading" />
        <div class="relative  overflow-y-scroll mx-auto px-4 sm:px-6 py-4 max-h-full ">
            <!-- Tri -->
            <div class="fixed flex items-center overflow-x-auto space-x-2 mb-3 snap-x snap-mandatory z-5">
                <button v-for="option in [
                    { id: 'popular', label: 'Populaire', icon: 'fa-fire' },
                    { id: 'favorites', label: 'Favoris', icon: 'fa-heart' },
                ]" :key="option.id" @click="changeSort(option.id)"
                    class="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium font-poppins snap-center shrink-0 transition-all duration-200"
                    :class="{
                        'bg-[var(--espace-vert)] text-[var(--espace-blanc)]': productStore.sort === option.id,
                        'bg-gray-100 text-[var(--espace-vert)] hover:bg-[var(--espace-or)] hover:text-[var(--espace-vert)]': productStore.sort !== option.id,
                    }" :aria-label="`Trier par ${option.label}`"
                    :aria-current="productStore.sort === option.id ? 'true' : undefined">
                    <i class="fas" :class="option.icon"></i>
                    {{ option.label }}
                </button>
            </div>

            <!-- Bouton toggle filtres -->
            <div class=" fixed  right-10 z-5 flex justify-end items-center mb-3">
                <button @click="showFilters = !showFilters"
                    class="relative flex items-center justify-center w-10 h-10 bg-[var(--espace-or)] text-[var(--espace-vert)] rounded-full hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] transition active:scale-95"
                    :aria-label="showFilters ? 'Masquer les filtres' : 'Afficher les filtres'"
                    :aria-expanded="showFilters">
                    <i class="fas fa-filter text-sm"></i>
                    <span v-if="activeFiltersCount() > 0"
                        class="absolute -top-1 -right-1 bg-[var(--espace-vert)] text-[var(--espace-blanc)] text-[10px] rounded-full h-5 w-5 flex items-center justify-center">
                        {{ activeFiltersCount() }}
                    </span>
                </button>
            </div>

            <!-- Filtres -->
            <Transition name="slide-up">
                <div v-if="showFilters"
                    class="bg-[var(--espace-blanc)] rounded-xl shadow-md p-4 mb-4 fixed top-0 left-0 right-0 z-50 sm:static sm:flex sm:items-center sm:gap-3 sm:flex-wrap">
                    <form @submit.prevent="applyFilters" class="grid grid-cols-2 gap-3 sm:flex sm:flex-row sm:gap-3">
                        <div class="flex-1 min-w-[120px]">
                            <input v-model="filterForm.search" id="search" type="text"
                                class="w-full h-10 pl-3 pr-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--espace-or)] transition bg-[var(--espace-blanc)]"
                                placeholder="Rechercher..." aria-label="Rechercher un produit" />
                        </div>
                        <div class="flex-1 min-w-[120px]">
                            <select v-model="filterForm.category" id="category"
                                class="w-full h-10 pl-3 pr-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--espace-or)] transition bg-[var(--espace-blanc)]">
                                <option value="">Catégorie</option>
                                <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.nom }}</option>
                            </select>
                        </div>
                        <div class="flex-1 min-w-[100px]">
                            <input v-model="filterForm.prix_min" id="prix_min" type="number" min="0"
                                class="w-full h-10 pl-3 pr-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--espace-or)] transition bg-[var(--espace-blanc)]"
                                placeholder="Prix min" aria-label="Prix minimum" />
                        </div>
                        <div class="flex-1 min-w-[100px]">
                            <input v-model="filterForm.prix_max" id="prix_max" type="number" min="0"
                                class="w-full h-10 pl-3 pr-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--espace-or)] transition bg-[var(--espace-blanc)]"
                                placeholder="Prix max" aria-label="Prix maximum" />
                        </div>
                        <div class="flex-1 min-w-[120px]">
                            <select v-model="filterForm.ville" id="ville"
                                class="w-full h-10 pl-3 pr-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--espace-or)] transition bg-[var(--espace-blanc)]">
                                <option value="">Ville</option>
                                <option v-for="ville in villes" :key="ville" :value="ville">{{ ville }}</option>
                            </select>
                        </div>
                        <div class="flex-1 min-w-[100px]">
                            <select v-model="filterForm.collaboratif" id="collaboratif"
                                class="w-full h-10 pl-3 pr-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--espace-or)] transition bg-[var(--espace-blanc)]">
                                <option value="">Collaboratif</option>
                                <option value="true">Oui</option>
                                <option value="false">Non</option>
                            </select>
                        </div>
                        <div class="flex gap-2 col-span-2 sm:col-span-1">
                            <button type="submit"
                                class="w-10 h-10 bg-[var(--espace-or)] text-[var(--espace-vert)] rounded-lg hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] transition flex items-center justify-center active:scale-95"
                                aria-label="Appliquer les filtres">
                                <i class="fas fa-check text-sm"></i>
                            </button>
                            <button @click="resetFilters" type="button"
                                class="w-10 h-10 bg-[var(--espace-gris)] text-[var(--espace-blanc)] rounded-lg hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] transition flex items-center justify-center active:scale-95"
                                aria-label="Réinitialiser les filtres">
                                <i class="fas fa-times text-sm"></i>
                            </button>
                        </div>
                    </form>
                </div>
            </Transition>

            <!-- Liste des produits -->
            <TransitionGroup name="fade" tag="div"
                class="  grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-12 ">
                <ProductCard v-for="produit in productStore.products" :key="produit.id" :produit="produit"
                    @mouseover="handleMouseOver(produit.id)" @touchstart="handleTouchStart(produit.id)" />
            </TransitionGroup>
            <div ref="loadMoreTrigger" class="h-10 flex items-center justify-center" aria-live="polite"
                :aria-busy="productStore.isLoading">
                <p v-if="!productStore.hasMore" class="text-[var(--espace-gris)] text-xs font-poppins">
                    Aucun produit supplémentaire
                </p>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Styles existants inchangés */
</style>