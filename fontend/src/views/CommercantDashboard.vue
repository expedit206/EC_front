<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import apiClient from '../api';
import AppHeader from '../components/AppHeader.vue';
import ProductCard from '../components/ProductCard.vue';

const toast = useToast();
const products = ref<any[]>([]);
const categories = ref<any[]>([]);
const commerçant = ref<any>(null);
const isLoading = ref(false);

// Formulaire pour ajouter un produit
const productForm = ref({
    nom: '',
    description: '',
    prix: '',
    photo_url: '',
    category_id: '',
    collaboratif: false,
    marge_min: '',
    stock: '',
    ville: '',
});

// Formulaire pour le profil
const profileForm = ref({
    nom: '',
    description: '',
    ville: '',
});

const villes = ref(['Douala', 'Yaoundé', 'Bamenda', 'Buea', 'Garoua']);

// Charger les données
const fetchCommercantData = async () => {
    isLoading.value = true;
    try {
        const [productsResponse, categoriesResponse, commercantResponse] = await Promise.all([
            apiClient.get('/commercant/produits'),
            apiClient.get('/categories'),
            apiClient.get('/commercant/profil'),
        ]);
        isLoading.value = false;
        console.log('Produits:', productsResponse.data);
        
        products.value = productsResponse.data.produits;
        categories.value = categoriesResponse.data.categories;
        commerçant.value = commercantResponse.data.commercant;
        profileForm.value = {
            nom: commerçant.value.nom,
            description: commerçant.value.description || '',
            ville: commerçant.value.ville || '',
        };
    } catch (error) {
        toast.error('Erreur lors du chargement des données.');
    } finally {
        isLoading.value = false;
    }
};

// Ajouter un produit
const addProduct = async () => {
    try {
        const res = await apiClient.post('/commercant/produits', productForm.value);
        console.log('Produit ajouté:', res.data);
        toast.success('Produit ajouté avec succès.');
        fetchCommercantData();
        productForm.value = { nom: '', description: '', prix: '', photo_url: '', category_id: '', collaboratif: false, marge_min: '', stock: '', ville: '' };
    } catch (error) {
        toast.error('Erreur lors de l’ajout du produit.');
    }
};

// Supprimer un produit
const deleteProduct = async (productId: string) => {
    if (!confirm('Voulez-vous supprimer ce produit ?')) return;
    try {
        await apiClient.delete(`/commercant/produits/${productId}`);
        toast.success('Produit supprimé avec succès.');
        fetchCommercantData();
    } catch (error) {
        toast.error('Erreur lors de la suppression du produit.');
    }
};

// Mettre à jour le profil
const updateProfile = async () => {
    try {
        await apiClient.put('/commercant/profil', profileForm.value);
        toast.success('Profil mis à jour avec succès.');
        fetchCommercantData();
    } catch (error) {
        toast.error('Erreur lors de la mise à jour du profil.');
    }
};

onMounted(() => {
    fetchCommercantData();
});
</script>

<template>
    <div class="min-h-screen bg-gray-100" :style="{ background: 'url(/src/assets/images/bginsc.jpg) center/cover' }">
        <AppHeader />

        <div class="container mx-auto px-4 sm:px-6 py-4">
            <!-- Titre -->
            <h1 class="text-xl sm:text-2xl font-bold text-[var(--espace-vert)] flex items-center gap-2 mb-4">
                <i class="fas fa-store"></i> Espace Commerçant
            </h1>

            <!-- Aperçu des revenus -->
            <div class="bg-[rgba(255,255,255,0.85)] rounded-xl shadow-md p-4 mb-4">
                <h2 class="text-lg font-semibold text-[var(--espace-vert)]">Statistiques</h2>
                <p v-if="commerçant" class="text-sm sm:text-base">
                    Revenus : {{ commerçant.revenus }} FCFA
                    <br />
                    Produits vendus : {{ commerçant.produits_vendus }}
                </p>
                <p v-else class="text-sm text-[var(--espace-gris)]">Chargement...</p>
            </div>

            <!-- Formulaire de profil -->
            <div class="bg-[rgba(255,255,255,0.85)] rounded-xl shadow-md p-4 mb-4">
                <h2 class="text-lg font-semibold text-[var(--espace-vert)] mb-2">Profil Commerçant</h2>
                <form @submit.prevent="updateProfile" class="flex flex-col gap-2">
                    <input v-model="profileForm.nom" type="text" placeholder="Nom du commerçant"
                        class="h-8 p-1.5 text-sm border border-gray-300 rounded-lg" required />
                    <textarea v-model="profileForm.description" placeholder="Description"
                        class="h-20 p-1.5 text-sm border border-gray-300 rounded-lg"></textarea>
                    <select v-model="profileForm.ville" class="h-8 p-1.5 text-sm border border-gray-300 rounded-lg">
                        <option value="">Ville</option>
                        <option v-for="ville in villes" :key="ville" :value="ville">{{ ville }}</option>
                    </select>
                    <button type="submit"
                        class="w-8 h-8 bg-[var(--espace-or)] text-[var(--espace-vert)] rounded-lg hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] transition">
                        <i class="fas fa-check"></i>
                    </button>
                </form>
            </div>

            <!-- Formulaire d’ajout de produit -->
            <div class="bg-[rgba(255,255,255,0.85)] rounded-xl shadow-md p-4 mb-4">
                <h2 class="text-lg font-semibold text-[var(--espace-vert)] mb-2">Ajouter un produit</h2>
                <form @submit.prevent="addProduct" class="flex flex-col gap-2">
                    <input v-model="productForm.nom" type="text" placeholder="Nom du produit"
                        class="h-8 p-1.5 text-sm border border-gray-300 rounded-lg" required />
                    <textarea v-model="productForm.description" placeholder="Description"
                        class="h-20 p-1.5 text-sm border border-gray-300 rounded-lg"></textarea>
                    <input v-model="productForm.prix" type="number" placeholder="Prix" min="0"
                        class="h-8 p-1.5 text-sm border border-gray-300 rounded-lg" required />
                    <input v-model="productForm.photo_url" type="text" placeholder="URL de la photo"
                        class="h-8 p-1.5 text-sm border border-gray-300 rounded-lg" />
                    <select v-model="productForm.category_id"
                        class="h-8 p-1.5 text-sm border border-gray-300 rounded-lg" required>
                        <option value="">Catégorie</option>
                        <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.nom }}</option>
                    </select>
                    <label class="flex items-center gap-2 text-sm">
                        <input v-model="productForm.collaboratif" type="checkbox" />
                        Collaboratif
                    </label>
                    <input v-model="productForm.marge_min" type="number" placeholder="Marge minimum" min="0"
                        class="h-8 p-1.5 text-sm border border-gray-300 rounded-lg" />
                    <input v-model="productForm.stock" type="number" placeholder="Stock" min="0"
                        class="h-8 p-1.5 text-sm border border-gray-300 rounded-lg" required />
                    <select v-model="productForm.ville" class="h-8 p-1.5 text-sm border border-gray-300 rounded-lg"
                        required>
                        <option value="">Ville</option>
                        <option v-for="ville in villes" :key="ville" :value="ville">{{ ville }}</option>
                    </select>
                    <button type="submit"
                        class="w-8 h-8 bg-[var(--espace-or)] text-[var(--espace-vert)] rounded-lg hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] transition">
                        <i class="fas fa-plus"></i>
                    </button>
                </form>
            </div>

            <!-- Liste des produits -->
            <div class="bg-[rgba(255,255,255,0.85)] rounded-xl shadow-md p-4">
                <h2 class="text-lg font-semibold text-[var(--espace-vert)] mb-2">Mes Produits</h2>
                <div v-if="isLoading" class="flex items-center gap-2 text-[var(--espace-vert)]">
                    <i class="fas fa-spinner animate-spin text-lg"></i>
                    <span class="text-sm font-poppins">Chargement...</span>
                </div>
                <div v-else-if="products.length === 0" class="text-sm text-[var(--espace-gris)]">
                    Aucun produit disponible.
                </div>
                <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div v-for="produit in products" :key="produit.id" class="relative">
                        <ProductCard :produit="produit" />
                        <button @click="deleteProduct(produit.id)"
                            class="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                            aria-label="Supprimer le produit">
                            <i class="fas fa-trash"></i>
                        </button>
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
</style>