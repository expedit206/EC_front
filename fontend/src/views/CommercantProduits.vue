<!-- src/views/CommercantProduits.vue -->
<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { useAuthStore } from "../stores/Auth";
import apiClient from "../api/index";
import Loader from "../components/Loader.vue";
import { Product } from "../components/types/index"; // Import de l'interface Parrainage
import { Category } from "../components/types/index"; // Import de l'interface Parrainage

const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();

const isLoading = ref(false);
const produits = ref<Product[]>([]);

const categories = ref<Category[]>([]);
const showAddModal = ref(false);
const showEditModal = ref(false);
const currentProduit = ref<Product | null>(null);

// Objet réactif pour suivre l'index du slide par produit
const slideIndexes = ref<{ [key: string]: number }>({});

const form = ref({
    nom: "",
    description: "",
    prix: 0,
    stock: 0,
    photos: [] as File[], // Tableau de fichiers au lieu de URLs
    category_id: "",
    collaboratif: false,
    marge_min: 0
});

const photoPreviews = ref<string[]>([]); // Pour prévisualiser les photos

const fetchProduits = async () => {
    isLoading.value = true;
    try {
        const response = await apiClient.get("/commercant/produits");
        produits.value = response.data.produits.map((p: any) => ({
            ...p,
            photo_url: p.photos && p.photos.length > 0 ? p.photos[0] : "https://via.placeholder.com/150", // Première photo comme fallback
        }));
        // Initialiser les indices des slides
        produits.value.forEach((p) => {
            if (!slideIndexes.value[p.id]) slideIndexes.value[p.id] = 0;
        });
    } catch (error) {
        toast.error("Erreur lors du chargement des produits");
    } finally {
        isLoading.value = false;
    }
};

const fetchCategories = async () => {
    isLoading.value = true;
    try {
        const response = await apiClient.get("/categories");
        categories.value = response.data.categories;
    } catch (error) {
        toast.error("Erreur lors de la chargement des catégories");
    } finally {
        isLoading.value = false;
    }
};

const openAddModal = () => {
    form.value = {
        nom: "",
        description: "",
        prix: 0,
        stock: 0,
        photos: [],
        category_id: "",
        collaboratif: false,
        marge_min: 0,
    };
    photoPreviews.value = [];
    showAddModal.value = true;
};

const openEditModal = (produit: Product) => {
    currentProduit.value = produit;
    form.value = {
        nom: produit.nom,
        description: produit.description || "",
        prix: produit.prix,
        stock: produit.quantite,
        photos: [], // Les fichiers seront uploadés à nouveau
        category_id: produit.category_id,
        collaboratif: produit.collaboratif ? true : false,
        
        marge_min: produit.marge_min || 0,
    };
    console.log(form.value)
    photoPreviews.value = produit.photos || []; // Prévisualisation des URLs existantes
    if (!slideIndexes.value[produit.id]) slideIndexes.value[produit.id] = 0; // Initialiser l'index
    showEditModal.value = true;
};

const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files) {
        const files = Array.from(target.files);
        form.value.photos = files; // Stocker les fichiers
        photoPreviews.value = files.map((file) => URL.createObjectURL(file)); // Prévisualisation
    }
};

const deleteProduit = async (produitId: string) => {
    if (!confirm("Voulez-vous vraiment supprimer ce produit ?")) return;
    isLoading.value = true;
    try {
        await apiClient.delete(`/commercant/produits/${produitId}`);
        produits.value = produits.value.filter((p) => p.id !== produitId);
        delete slideIndexes.value[produitId]; // Supprimer l'index du produit supprimé
        toast.success("Produit supprimé");
    } catch (error) {
        toast.error("Erreur lors de la suppression");
    } finally {
        isLoading.value = false;
    }
};

const submitProduit = async () => {
    isLoading.value = true;
    const formData = new FormData();
    formData.append("nom", form.value.nom);
    formData.append("description", form.value.description);
    formData.append("prix", form.value.prix.toString());
    formData.append("stock", form.value.stock.toString());
    formData.append("category_id", form.value.category_id);
    formData.append("collaboratif", form.value.collaboratif ? "1" : "0");
    if (form.value.marge_min !== null) {
        formData.append("marge_min", form.value.marge_min.toString());
    }
    form.value.photos.forEach((photo) => formData.append("photos[]", photo)); // Ajouter plusieurs fichiers
    console.log(formData)
    console.log(form.value)
    try {
        if (showAddModal.value) {
            const response = await apiClient.post("/commercant/produits", form.value, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            // form.value = null
            console.log(response.data);
            toast.success("Produit ajouté avec succès");
        } else {
            console.log(form.value)
            const response = await apiClient.post(
                `/commercant/produits/${currentProduit.value?.id}`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }


            );

            console.log(response.data)
            toast.success("Produit modifié avec succès");
        }
        await fetchProduits();
        closeModal();
    } catch (error: any) {
        toast.error(error.response?.data.message || "Erreur lors de la sauvegarde du produit");
    } finally {
        isLoading.value = false;
    }
};

const closeModal = () => {
    showAddModal.value = false;
    showEditModal.value = false;
    currentProduit.value = null;
    photoPreviews.value = [];
};

// Méthodes pour le slider
const currentSlideIndex = computed(() => (id: string) => slideIndexes.value[id] || 0);

const nextSlide = (id: string) => {
    const produit = produits.value.find((p) => p.id === id);
    const maxIndex = produit?.photos?.length ? produit.photos.length - 1 : 0;
    slideIndexes.value[id] = Math.min((slideIndexes.value[id] || 0) + 1, maxIndex);
};

const prevSlide = (id: string) => {
    slideIndexes.value[id] = Math.max((slideIndexes.value[id] || 0) - 1, 0);
};

onMounted(() => {
    if (!authStore.user?.commercant) {
        toast.error("Accès réservé aux commerçants");
        router.push("/");
        return;
    }
    fetchProduits();
    fetchCategories();
});
</script>

<template>
    <Loader :isLoading="isLoading" />

    <div class="h-full bg-gray-100 pt-5 px-4 sm:px-2">
        <div class="h-full w-full">
            <div class="flex justify-between items-center">
                <h1 class="text-1xl md:text-2xl font-bold text-[var(--espace-vert)] text-md mb-2 font-poppins">
                    <i class="fas fa-box-open mr-1 text-[var(--espace-or)] text-md!important"></i> Mes Produits
                </h1>
                <button @click="openAddModal"
                    class="mb-2 md:text-xl text-[var(--espace-vert)] font-semibold px-2 py-1 rounded hover:bg-[var(--espace-vert)] hover:text-white transition inline-flex items-center">
                    <i class="fas fa-plus mr-2"></i> Ajouter un produit
                </button>
            </div>

            <div v-if="isLoading">
                <div class="flex items-center justify-center py-10">
                    <i class="fas fa-spinner animate-spin text-2xl text-[var(--espace-vert)]"></i>
                </div>
            </div>
            <div v-else-if="produits.length"
                class="grid grid-cols-1 pt-4 pb-16 lg:pb-12 md:grid-cols-3 sm:grid-cols-2 overflow-y-scroll pt-4 h-full lg:grid-cols-4 gap-6">

                <div v-for="produit in produits" :key="produit.id"
                    class="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition relative">
                    <router-link :to="`/produits/${produit.id}`" class="block relative">
                        <div class="relative w-full h-40 overflow-hidden rounded-t-lg mb-2">
                            <div class="flex w-full h-full slider-container"
                                :style="{ transform: `translateX(-${currentSlideIndex(produit.id) * 100}%)` }">
                                <img v-for="(photo, index) in produit.photos" :key="index" :src="photo"
                                    class="h-40 object-contain flex-shrink-0 mx-auto" alt="Photo du produit" />
                            </div>
                            <!-- Flèches visibles uniquement sur desktop -->
                            <button v-if="produit.photos && produit.photos.length > 1" @click="prevSlide(produit.id)"
                                class="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-75 hidden md:block">
                                <i class="fas fa-chevron-left"></i>
                            </button>
                            <button v-if="produit.photos && produit.photos.length > 1" @click="nextSlide(produit.id)"
                                class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-75 hidden md:block">
                                <i class="fas fa-chevron-right"></i>
                            </button>
                            <!-- Points (dots) pour la navigation -->
                            <div v-if="produit.photos && produit.photos.length > 1"
                                class="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                                <span v-for="(photo, index) in produit.photos" :key="index"
                                    class="w-2 h-2 rounded-full bg-gray-400"
                                    :class="{ 'bg-[var(--espace-or)]': index === currentSlideIndex(produit.id) }"></span>
                            </div>
                        </div>
                        <div class="p-2">
                            <h2 class="text-lg font-semibold flex justify-between text-[var(--espace-vert)] truncate">
                                {{ produit.nom }}
                                <button @click="openEditModal(produit)"
                                    class="text-[var(--espace-vert)] hover:text-[var(--espace-or)] p-1 rounded-full hover:bg-gray-100 transition">
                                    <i class="fas fa-pencil text-sm"></i>
                                </button>
                            </h2>
                            <p class="text-sm text-[var(--espace-gris)] line-clamp-2">
                                {{ produit.description || "Aucune" }}
                            </p>
                            <p class="text-md font-bold text-[var(--espace-or)] mt-2">{{ produit.prix }} FCFA</p>
                            <p class="text-sm text-[var(--espace-gris)]">Stock: {{ produit.quantite }}</p>
                            <div class="text-sm text-[var(--espace-gris)] mt-2">
                                <span><i class="fas fa-eye mr-1"></i> {{ produit.raw_views_count || 0 }} vues</span>
                                <span class="ml-4"><i class="fas fa-heart mr-1"></i> {{ produit.favorites_count || 0 }}
                                    favoris</span>
                            </div>
                        </div>
                        <div class="absolute bottom-5 right-2 flex gap-2">
                            <button @click="openEditModal(produit)"
                                class="text-[var(--espace-vert)] hover:text-[var(--espace-or)] p-1 rounded-full hover:bg-gray-100 transition">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button @click.stop="deleteProduit(produit.id)"
                                class="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-gray-100 transition">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </router-link>

                </div>
            </div>
            <p v-else class="text-center text-[var(--espace-gris)]">Aucun produit pour le moment.</p>
        </div>

        <!-- MODALE AJOUT / MODIF -->
        <Transition name="fade">
            <div v-if="showAddModal || showEditModal"
                class="overflow-y-scroll fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                @click.self="closeModal">
                <div class="bg-white rounded-lg p-6 sm:p-8 w-full max-w-md mx-4 shadow-lg">
                    <h2 class="text-lg font-semibold text-[var(--espace-vert)] mb-4">
                        {{ showAddModal ? "Ajouter un produit" : "Modifier le produit" }}
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
                            <label class="text-sm text-[var(--espace-vert)]">Photos</label>
                            <input type="file" multiple @change="handleFileChange" class="input-style"
                                accept="image/*" />
                            <div v-if="photoPreviews.length" class="mt-2 flex gap-2 flex-wrap">
                                <img v-for="(preview, index) in photoPreviews" :key="index" :src="preview"
                                    class="w-16 h-16 object-cover rounded" alt="Prévisualisation" />
                            </div>
                        </div>
                        <div>
                            <label class="text-sm text-[var(--espace-vert)]">Catégorie</label>
                            <select v-model="form.category_id" required class="input-style">
                                <option value="">Sélectionner une catégorie</option>
                                <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.nom }}</option>
                            </select>
                        </div>
                        <!-- {{ form.collaboratif }} -->
                        <div class="flex items-center gap-2 " v-if="form.collaboratif || showEditModal">
                        </div>
                        <div class="flex items-center gap-2 " v-else>
                            <input id="collaboratif" type="checkbox" v-model="form.collaboratif" />
                            <label for="collaboratif" class="text-sm text-[var(--espace-vert)]">Collaboratif</label>
                        </div>

                        <div class="flex gap-4 pt-2">
                            <button type="submit"
                                class="flex-1 bg-[var(--espace-or)] text-[var(--espace-vert)] font-semibold px-4 py-2 rounded hover:bg-[var(--espace-vert)] hover:text-white transition">
                                {{ showAddModal ? "Ajouter" : "Modifier" }}
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
    font-family: "Poppins", sans-serif;
}

.input-style {
    width: 100%;
    padding: 8px;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    font-size: 14px;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.animate-spin {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

/* Styles pour le slider */
.slider-container {
    display: flex;
    transition: transform 0.3s ease;
    width: 100%;
    height: 100%;
}

.slider-button {
    z-index: 10;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .slider-button {
        display: none;
        /* Masquer les flèches sur mobile */
    }
}
</style>