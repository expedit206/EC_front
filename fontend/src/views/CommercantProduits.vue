<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '../stores/Auth';
import apiClient from '../api';
import Loader from '../components/Loader.vue';

const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();

const isLoading = ref(false);
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
    isLoading.value = true;
    try {
        const response = await apiClient.get('/commercant/produits');
        produits.value = response.data.produits;
    } catch (error) {
        toast.error('Erreur lors du chargement des produits');
    } finally {
        isLoading.value = false;
    }
};

const fetchCategories = async () => {
    isLoading.value = true;
    try {
        const response = await apiClient.get('/categories');
        categories.value = response.data.categories;
    } catch (error) {
        toast.error('Erreur lors du chargement des catégories');
    } finally {
        isLoading.value = false;
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

const deleteProduit = async (produitId: string) => {
    if (!confirm('Voulez-vous vraiment supprimer ce produit ?')) return;
    isLoading.value = true;
    try {
        await apiClient.delete(`/commercant/produits/${produitId}`);
        produits.value = produits.value.filter(p => p.id !== produitId);
        toast.success('Produit supprimé');
    } catch (error) {
        toast.error('Erreur lors de la suppression');
    } finally {
        isLoading.value = false;
    }
};

const submitProduit = async () => {
    isLoading.value = true;
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
        } else {
            await apiClient.put(`/commercant/produits/${currentProduit.value.id}`, data);
            toast.success('Produit modifié avec succès');
        }
        await fetchProduits();
        closeModal();
    } catch (error: any) {
        toast.error(error.response?.data.message || 'Erreur lors de la sauvegarde du produit');
    } finally {
        isLoading.value = false;
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
    <Loader :isLoading="isLoading" />

    <div class="min-h-screen bg-gray-100 pt-16 pb-20 px-4 sm:px-6">
        <div class="container mx-auto max-w-4xl">
            <h1 class="text-2xl sm:text-3xl font-bold text-[var(--espace-vert)] mb-6 font-poppins">
                <i class="fas fa-box-open mr-2 text-[var(--espace-or)]"></i> Mes Produits
            </h1>

            <button @click="openAddModal"
                class="mb-4 bg-[var(--espace-or)] text-[var(--espace-vert)] font-semibold px-4 py-2 rounded hover:bg-[var(--espace-vert)] hover:text-white transition">
                <i class="fas fa-plus mr-2"></i> Ajouter un produit
            </button>
<div v-if="isLoading"></div>
            <div v-else-if="produits.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div v-for="produit in produits" :key="produit.id"
                    class="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition">
                    <img :src="produit.photo_url || 'https://via.placeholder.com/150'"
                        class="w-full h-32 object-cover rounded mb-2" />
                    <h2 class="text-lg font-semibold text-[var(--espace-vert)] truncate">{{ produit.nom }}</h2>
                    <p class="text-sm text-[var(--espace-gris)]">{{ produit.description || 'Aucune description' }}</p>
                    <p class="text-md font-bold text-[var(--espace-or)]">{{ produit.prix }} FCFA</p>
                    <p class="text-sm text-[var(--espace-gris)]">Stock: {{ produit.stock }}</p>
                    <button @click="openEditModal(produit)"
                        class="mt-2 w-full bg-[var(--espace-vert)] text-white font-semibold px-3 py-1.5 rounded hover:bg-[var(--espace-or)] transition">
                        <i class="fas fa-edit mr-2"></i> Modifier
                    </button>
                    <button @click.stop="deleteProduit(produit.id)"
                        class="mt-2 w-full bg-red-500 text-white font-semibold px-3 py-1.5 rounded hover:bg-red-600 transition">
                        <i class="fas fa-trash mr-2"></i> Supprimer
                    </button>
                </div>
            </div>

            <p v-else class="text-center text-[var(--espace-gris)]">Aucun produit pour le moment.</p>
        </div>

        <!-- MODALE AJOUT / MODIF -->
        <Transition name="fade">
            <div v-if="showAddModal || showEditModal"
                class="fixed overflow-scroll pt-12 inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                @click.self="closeModal">
                <div class="bg-white rounded-lg p-6 sm:p-8 w-full max-w-md mx-4 shadow-lg mt-28">
                    <h2 class="text-lg font-semibold text-[var(--espace-vert)] mb-4">
                        {{ showAddModal ? 'Ajouter un produit' : 'Modifier le produit' }}
                    </h2>
                    <form @submit.prevent="submitProduit" class="space-y-4">
                        <div>
                            <label class="text-sm text-[var(--espace-vert)]">Nom</label>
                            <input v-model="form.nom" type="text" required class="input-style" />
                        </div>
                        <div>
                            <label class="text-sm text-[var(--espace-vert)]">Description</label>
                            <textarea v-model="form.description" rows="3" class="input-style"></textarea>
                        </div>
                        <div>
                            <label class="text-sm text-[var(--espace-vert)]">Prix (FCFA)</label>
                            <input v-model.number="form.prix" type="number" min="0" required class="input-style" />
                        </div>
                        <div>
                            <label class="text-sm text-[var(--espace-vert)]">Stock</label>
                            <input v-model.number="form.stock" type="number" min="0" required class="input-style" />
                        </div>
                        <div>
                            <label class="text-sm text-[var(--espace-vert)]">URL de la photo</label>
                            <input v-model="form.photo_url" type="url" class="input-style" />
                        </div>
                        <div>
                            <label class="text-sm text-[var(--espace-vert)]">Catégorie</label>
                            <select v-model="form.category_id" required class="input-style">
                                <option value="">Sélectionner une catégorie</option>
                                <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.nom }}</option>
                            </select>
                        </div>
                        <div class="flex items-center gap-2">
                            <input id="collaboratif" type="checkbox" v-model="form.collaboratif" />
                            <label for="collaboratif" class="text-sm text-[var(--espace-vert)]">Collaboratif</label>
                        </div>
                        <div v-if="form.collaboratif">
                            <label class="text-sm text-[var(--espace-vert)]">Marge minimum (FCFA)</label>
                            <input v-model.number="form.marge_min" type="number" min="0" required class="input-style" />
                        </div>
                        <div class="flex gap-4 pt-2">
                            <button type="submit"
                                class="flex-1 bg-[var(--espace-or)] text-[var(--espace-vert)] font-semibold px-4 py-2 rounded hover:bg-[var(--espace-vert)] hover:text-white transition">
                                {{ showAddModal ? 'Ajouter' : 'Modifier' }}
                            </button>
                            <button type="button" @click="closeModal"
                                class="flex-1 bg-[var(--espace-gris)] text-white font-semibold px-4 py-2 rounded hover:bg-gray-700 transition">
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
