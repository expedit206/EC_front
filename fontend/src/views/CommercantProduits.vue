<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '../stores/Auth';
import apiClient from '../api';

const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();

const produits = ref<any[]>([]);
const categories = ref<any[]>([]);
const showAddModal = ref(false);
const showEditModal = ref(false);
const currentProduit = ref<any>(null);

const form = ref({
    nom: '',
    description: '',
    prix: 0,
    stock: 0,
    photo_url: '',
    category_id: '',
    collaboratif: false,
    marge_min: null as number | null,
});

const fetchProduits = async () => {
    try {
        const response = await apiClient.get('/commercant/produits');
        produits.value = response.data.produits;
        console.log(response.data);
        
    } catch (error) {
        toast.error('Erreur lors du chargement des produits');
    }
};

const fetchCategories = async () => {
    try {
        const response = await apiClient.get('/categories');
        categories.value = response.data.categories;
    } catch (error) {
        toast.error('Erreur lors du chargement des catégories');
    }
};

const openAddModal = () => {
    form.value = {
        nom: '',
        description: '',
        prix: 0,
        stock: 0,
        photo_url: '',
        category_id: '',
        collaboratif: false,
        marge_min: null,
    };
    showAddModal.value = true;
};

const deleteProduit = async (produitId: string) => {
    if (!confirm('Voulez-vous vraiment supprimer ce produit ?')) return;
    try {
        await apiClient.delete(`/commercant/produits/${produitId}`);
        produits.value = produits.value.filter(p => p.id !== produitId);
        toast.success('Produit supprimé');
    } catch (error) {
        toast.error('Erreur lors de la suppression');
    }
};

const openEditModal = (produit: any) => {
    currentProduit.value = produit;
    form.value = {
        nom: produit.nom,
        description: produit.description || '',
        prix: produit.prix,
        stock: produit.stock,
        photo_url: produit.photo_url || '',
        category_id: produit.category_id,
        collaboratif: produit.collaboratif,
        marge_min: produit.marge_min || null,
    };
    showEditModal.value = true;
};

const submitProduit = async () => {
    try {
        const data = {
            ...form.value,
            prix: Number(form.value.prix),
            stock: Number(form.value.stock),
            marge_min: form.value.collaboratif ? Number(form.value.marge_min) : null,
        };
        if (showAddModal.value) {
            await apiClient.post('/commercant/produits', data);
            toast.success('Produit ajouté avec succès');
            await fetchProduits();
        } else {
            await apiClient.put(`/commercant/produits/${currentProduit.value.id}`, data);
            toast.success('Produit modifié avec succès');
            await fetchProduits();
        }
        showAddModal.value = false;
        showEditModal.value = false;
        currentProduit.value = null;
    } catch (error: any) {
        toast.error(error.response?.data.message || 'Erreur lors de la sauvegarde du produit');
    }
};

const closeModal = () => {
    showAddModal.value = false;
    showEditModal.value = false;
    currentProduit.value = null;
};

onMounted(() => {
    if (!authStore.user?.commercant) {
        toast.error('Accès réservé aux commerçants');
        router.push('/');
        return;
    }
    fetchProduits();
    fetchCategories();
});
</script>

<template>
    <div class="min-h-screen bg-gray-100 pt-16 pb-20 px-4 sm:px-6">
        <div class="container mx-auto max-w-4xl">
            <h1 class="text-2xl sm:text-3xl font-bold text-[var(--espace-vert)] mb-6 font-poppins">
                <i class="fas fa-box-open mr-2 text-[var(--espace-or)]"></i> Mes Produits
            </h1>
            <button @click="openAddModal"
                class="mb-4 bg-[var(--espace-or)] text-[var(--espace-vert)] font-semibold px-4 py-2 rounded hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] transition"
                aria-label="Ajouter un produit">
                <i class="fas fa-plus mr-2"></i> Ajouter un produit
            </button>
            <div v-if="produits.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div v-for="produit in produits" :key="produit.id"
                    class="bg-[var(--espace-blanc)] rounded-lg shadow-md p-4 hover:shadow-lg transition">
                    <img :src="produit.photo_url || 'https://via.placeholder.com/150'" :alt="`Image de ${produit.nom}`"
                        class="w-full h-32 object-cover rounded mb-2" />
                    <h2 class="text-lg font-semibold text-[var(--espace-vert)] truncate font-poppins">{{ produit.nom }}
                    </h2>
                    <p class="text-sm text-[var(--espace-gris)] truncate">{{ produit.description || 'Aucune description'
                        }}</p>
                    <p class="text-md font-bold text-[var(--espace-or)]">{{ produit.prix }} FCFA</p>
                    <p class="text-sm text-[var(--espace-gris)]">Stock: {{ produit.stock }}</p>
                    <button @click="openEditModal(produit)"
                        class="mt-2 w-full bg-[var(--espace-vert)] text-[var(--espace-blanc)] font-semibold px-3 py-1.5 rounded hover:bg-[var(--espace-or)] transition"
                        aria-label="Modifier le produit">
                        <i class="fas fa-edit mr-2"></i> Modifier
                    </button>
                    <button @click.stop="deleteProduit(produit.id)"
                        class="mt-2 w-full bg-red-500 text-white font-semibold px-3 py-1.5 rounded hover:bg-red-600 transition"
                        aria-label="Supprimer le produit">
                        <i class="fas fa-trash mr-2"></i> Supprimer
                    </button>
                </div>
            </div>
            <p v-else class="text-center text-[var(--espace-gris)]">Aucun produit pour le moment.</p>
        </div>

        <!-- Modale Ajout/Modification -->
        <Transition name="fade">
            <div v-if="showAddModal || showEditModal"
                class="fixed overflow-scroll pt-12 inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                @click.self="closeModal" role="dialog" aria-modal="true"
                :aria-label="showAddModal ? 'Ajouter un produit' : 'Modifier un produit'">
                <div class="bg-[var(--espace-blanc)] rounded-lg p-6 sm:p-8 w-full max-w-md mx-4 shadow-lg mt-28">
                    <h2 class="text-lg sm:text-xl font-semibold text-[var(--espace-vert)] mb-4 font-poppins">
                        {{ showAddModal ? 'Ajouter un produit' : 'Modifier le produit' }}
                    </h2>
                    <form @submit.prevent="submitProduit" class="space-y-4">
                        <div>
                            <label for="nom" class="text-sm text-[var(--espace-vert)]">Nom</label>
                            <input id="nom" v-model="form.nom" type="text"
                                class="w-full h-10 p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--espace-vert)] transition"
                                aria-label="Nom du produit" required />
                        </div>
                        <div>
                            <label for="description" class="text-sm text-[var(--espace-vert)]">Description</label>
                            <textarea id="description" v-model="form.description"
                                class="w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--espace-vert)] transition"
                                rows="4" aria-label="Description du produit"></textarea>
                        </div>
                        <div>
                            <label for="prix" class="text-sm text-[var(--espace-vert)]">Prix (FCFA)</label>
                            <input id="prix" v-model.number="form.prix" type="number" min="0"
                                class="w-full h-10 p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--espace-vert)] transition"
                                aria-label="Prix du produit" required />
                        </div>
                        <div>
                            <label for="stock" class="text-sm text-[var(--espace-vert)]">Stock</label>
                            <input id="stock" v-model.number="form.stock" type="number" min="0"
                                class="w-full h-10 p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--espace-vert)] transition"
                                aria-label="Stock du produit" required />
                        </div>
                        <div>
                            <label for="photo_url" class="text-sm text-[var(--espace-vert)]">URL de la photo</label>
                            <input id="photo_url" v-model="form.photo_url" type="url"
                                class="w-full h-10 p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--espace-vert)] transition"
                                aria-label="URL de la photo du produit" />
                        </div>
                        <div>
                            <label for="category_id" class="text-sm text-[var(--espace-vert)]">Catégorie</label>
                            <select id="category_id" v-model="form.category_id"
                                class="w-full h-10 p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--espace-vert)] transition"
                                aria-label="Catégorie du produit" required>
                                <option value="">Sélectionner une catégorie</option>
                                <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.nom }}</option>
                            </select>
                        </div>
                        <div class="flex items-center gap-2">
                            <input id="collaboratif" v-model="form.collaboratif" type="checkbox"
                                class="h-4 w-4 text-[var(--espace-vert)] focus:ring-[var(--espace-vert)]"
                                aria-label="Produit collaboratif" />
                            <label for="collaboratif" class="text-sm text-[var(--espace-vert)]">Collaboratif</label>
                        </div>
                        <div v-if="form.collaboratif">
                            <label for="marge_min" class="text-sm text-[var(--espace-vert)]">Marge minimum
                                (FCFA)</label>
                            <input id="marge_min" v-model.number="form.marge_min" type="number" min="0"
                                class="w-full h-10 p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--espace-vert)] transition"
                                aria-label="Marge minimum pour la collaboration" required />
                        </div>
                        <div class="flex gap-4">
                            <button type="submit"
                                class="flex-1 bg-[var(--espace-or)] text-[var(--espace-vert)] font-semibold px-4 py-2 rounded hover:bg-[var(--espace-vert)] hover:text-[var(--espace-blanc)] transition"
                                :aria-label="showAddModal ? 'Ajouter le produit' : 'Modifier le produit'">
                                {{ showAddModal ? 'Ajouter' : 'Modifier' }}
                            </button>
                            <button type="button" @click="closeModal"
                                class="flex-1 bg-[var(--espace-gris)] text-[var(--espace-blanc)] font-semibold px-4 py-2 rounded hover:bg-gray-700 transition"
                                aria-label="Annuler">
                                Annuler
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Transition>
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
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>