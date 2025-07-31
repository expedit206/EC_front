<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch, ref, nextTick } from 'vue'; // Added nextTick
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/Auth';
import { useUserStateStore } from '../stores/userState';
import apiClient from '../api';
import { useProductStore } from '../stores/product';
// /soldeUser/
import SoldeUser from './SoldeUser.vue';


const authStore = useAuthStore();
const userStateStore = useUserStateStore();
const router = useRouter();
const user = authStore.user
const route = useRoute();
const animateCartBadge = ref(false);
const animateCollaborationBadge = ref(false);
const animateOrdersBadge = ref(false);
const searchQuery = ref('');
const productStore = useProductStore();
const showSearch = ref(false); // Toggle for search bar visibility
const searchOverlayRef = ref<HTMLElement | null>(null); // Ref for the overlay element
const ignoreNextClick = ref(false); // Flag to ignore the initial click



const navLinks = computed(() => {
    return [
        { to: '/', label: 'Accueil', icon: 'fa-home', badge: 0 },
        ...(authStore.user
            ? [
                { to: '/profil', label: 'Profil', icon: 'fa-user-circle', badge: 0 },
                ...(authStore.user.commercant
                    ? [{ to: '/commercant/produits', label: 'Mes Produits', icon: 'fa-box-open', badge: 0 }]
                    : []),
                { to: '/collaborations', label: 'Collaborations', icon: 'fa-handshake', badge: userStateStore.collaborationsPending },
                { to: '/parrainage', label: 'Mon Parrainage', icon: 'fa-users', badge: 0 },
            ]
            : [
                { to: '/login', label: 'Connexion', icon: 'fa-sign-in-alt', badge: 0 },
                { to: '/register', label: 'Inscription', icon: 'fa-user-plus', badge: 0 },
            ]),
    ];
});

const fetchBadges = async () => {
    if (!authStore.user) return;
    try {
        const response = await apiClient.get('/user/badges');
        userStateStore.saveCollaborationsToLocalStorage(
            response.data.collaborations_pending.map((item: any) => ({
                produit_id: item.produit_id,
                prix_revente: item.prix_revente,
                status: item.status,
                created_at: item.created_at,
            }))
        );
        userStateStore.saveOrdersToLocalStorage(
            response.data.orders_pending.map((order: any) => ({
                id: order.id,
                items: order.items,
                status: order.status,
                created_at: order.created_at,
                total: order.total,
            }))
        );
    } catch (error) {
        console.error('Erreur lors du chargement des badges:', error);
    }
};

watch(
    () => authStore.user,
    (newUser) => {
        if (newUser) {
            fetchBadges();
            userStateStore.initializeState();
        }
    },
    { immediate: true }
);

watch(
    () => userStateStore.cartCount,
    () => {
        if (userStateStore.cartCount > 0) {
            animateCartBadge.value = true;
            setTimeout(() => (animateCartBadge.value = false), 300);
        }
    }
);

watch(
    () => userStateStore.collaborationsPending,
    () => {
        if (userStateStore.collaborationsPending > 0) {
            animateCollaborationBadge.value = true;
            setTimeout(() => (animateCollaborationBadge.value = false), 300);
        }
    }
);

watch(
    () => userStateStore.ordersPending,
    () => {
        if (userStateStore.ordersPending > 0) {
            animateOrdersBadge.value = true;
            setTimeout(() => (animateOrdersBadge.value = false), 300);
        }
    }
);

// Call products API with search query
const performSearch = async () => {
    if (searchQuery.value.trim()) {
        try {
            await productStore.fetchProducts({ search: searchQuery.value.trim() }, true);
            searchQuery.value = ''; // Clear input after search
            showSearch.value = false; // Hide search bar
        } catch (error) {
            console.error('Erreur lors de la recherche:', error);
        }
    }
};

// Handle clicks outside the search overlay
const handleClickOutside = (event: MouseEvent) => {
    if (ignoreNextClick.value) {
        ignoreNextClick.value = false; // Reset flag after ignoring the first click
        return;
    }
    if (searchOverlayRef.value && !searchOverlayRef.value.contains(event.target as Node)) {
        showSearch.value = false;
    }
};

const toggleSearch = async () => {
    showSearch.value = !showSearch.value;
    if (showSearch.value) {
        ignoreNextClick.value = true; // Set flag to ignore the next click
        await nextTick(); // Wait for DOM to update
    }
};
const goToMessages = () => {
    router.push('/messages');
};
onMounted(() => {
    if (authStore.user) {
        fetchBadges();
        userStateStore.initializeState();
    }
    document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
    <!-- <SoldeUser /> -->
    <header class="bg-[var(--espace-vert)] text-[var(--espace-blanc)] fixed top-0 left-0 w-full z-50 shadow-md">

        <div class="container mx-auto px-2 sm:px-3 py-2 flex justify-between items-center gap-4">
            <div class="flex items-center gap-1 sm:gap-3">
                <RouterLink to="/" aria-label="Retour à l'accueil">
                    <div class="rounded-full pb-1 pt-1">
                        <img src="/src/assets/images/logo/logoOrangeweb.webp" alt="Logo Espace Cameroun"
                            class="h-10 w-10 object-contain transition-transform duration-300 hover:scale-105 shadow-sm hover:shadow-md" />
                    </div>
                </RouterLink>
                <h1 class="text-lg sm:text-xl font-bold font-poppins text-[var(--espace-blanc)]">
                    Espace Cameroun
                </h1>
            </div>


            <nav class="hidden lg:flex items-center space-x-4 sm:space-x-6 font-poppins text-sm sm:text-base">
                <RouterLink v-for="link in navLinks" :key="link.to" :to="link.to"
                    class="hover:text-[var(--espace-or)] flex items-center gap-1 sm:gap-2 transition-colors duration-300"
                    active-class="text-[var(--espace-or)]">
                    <i class="fas" :class="link.icon"></i>
                    {{ link.label }}
                    <span v-if="(typeof link.badge === 'object' ? link.badge.value : link.badge) > 0"
                        class="cart-badge bg-[var(--espace-or)] text-[var(--espace-vert)] text-xs rounded-full h-5 w-5 flex items-center justify-center"
                        :class="{
                            'animate-scale':
                                (link.to === '/panier' && animateCartBadge) ||
                                (link.to === '/collaborations' && animateCollaborationBadge) ||
                                (link.to === '/commandes' && animateOrdersBadge),
                        }" :aria-label="link.to === '/panier'
                            ? 'Nombre d\'articles dans le panier'
                            : link.to === '/collaborations'
                                ? 'Collaborations en attente'
                                : 'Commandes en attente'
                            ">
                        {{ typeof link.badge === 'object' ? link.badge.value : link.badge }}
                    </span>
                </RouterLink>
            </nav>
            <SoldeUser />


            <div class="flex items-center gap-2">

                <button @click="toggleSearch"
                    class="text-[var(--espace-blanc)] hover:text-[var(--espace-or)] transition-colors duration-300"
                    aria-label="Ouvrir la recherche">
                    <i class="fas fa-search text-2xl"></i>
                </button>
                <button @click="goToMessages"
                    class=" text-[var(--espace-white)] px-1 rounded hover:bg-white transition">
                    <i class="fas fa-comment-dots text-2xl"></i>

                </button>
                <!-- //parametre -->
                <!-- <RouterLink v-if="authStore.user" to="/parametres" aria-label="Paramètres"
                    class="text-[var(--espace-blanc)] hover:text-[var(--espace-or)] transition-colors duration-300">
                    <i class="fas fa-cog text-2xl"></i>
                </RouterLink> -->
                <!-- </button> -->

                <RouterLink
                    v-for="link in navLinks.filter(link => authStore.user ? link.to === '/profil' : ['/login', '/register'].includes(link.to))"
                    :key="link.to" :to="link.to" class="relative flex items-center justify-center"
                    :aria-label="link.label">
                    <!-- {{ user.photo }} -->
                    <img v-if="user?.photo" :src="`http://localhost:8000/storage/${user.photo}`" alt="Photo de profil"
                        class="w-10 h-10 rounded-full object-cover border-2 border-[var(--espace-vert)]" />
                    <div v-else
                        class="w-10 h-10 rounded-full  flex items-center justify-center text-[var(--espace-gris)]">
                        <!-- Pas de photo -->
                        <i :class="`fas ${link.icon}`" class="text-2xl text-gray-100"></i>
                    </div>
                    <span
                        v-if="(typeof link.badge === 'object' ? link.badge.value : link.badge) > 0 && link.to === '/collaborations'"
                        class="cart-badge absolute top-0 right-0 bg-[var(--espace-or)] text-[var(--espace-vert)] text-xs rounded-full h-5 w-5 flex items-center justify-center"
                        :class="{ 'animate-scale': link.to === '/collaborations' && animateCollaborationBadge }"
                        aria-label="Collaborations en attente">
                        {{ typeof link.badge === 'object' ? link.badge.value : link.badge }}
                    </span>
                </RouterLink>
            </div>
        </div>

        <!-- Search Overlay -->
        <div v-if="showSearch" ref="searchOverlayRef"
            class="fixed bg-[var(--espace-vert)] bg-opacity-50 flex items-center top-10 w-full justify-center z-50 p-4">
            <div class="relative w-full max-w-md bg-[var(--espace-blanc)] rounded-lg p-4 shadow-lg">
                <input v-model="searchQuery" type="text" placeholder="Rechercher un produit..."
                    class="w-full px-4 py-2 rounded-full text-[var(--espace-vert)] focus:outline-none focus:ring-2 focus:ring-[var(--espace-or)] text-base"
                    @keyup.enter="performSearch" />
                <button @click="performSearch"
                    class="absolute right-6 top-1/2 transform -translate-y-1/2 text-[var(--espace-vert)] hover:text-[var(--espace-or)]">
                    <i class="fas fa-search text-lg"></i>
                </button>
                <button @click="showSearch = false"
                    class="absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--espace-vert)] hover:text-[var(--espace-or)]"
                    aria-label="Fermer la recherche">
                    <i class="fas fa-times text-lg"></i>
                </button>
            </div>
        </div>
    </header>

    <Transition name="slide-up">
        <nav
            class="lg:hidden fixed bottom-0 left-0 w-full bg-[var(--espace-vert)] text-[var(--espace-blanc)] shadow-md z-40">
            <div class="flex justify-around items-center py-2">
                <RouterLink v-for="link in navLinks" :key="link.to" :to="link.to" :aria-label="link.label"
                    class="relative flex items-center justify-center w-10 h-10 hover:text-[var(--espace-or)] transition-colors duration-300"
                    active-class="text-[var(--espace-or)]">
                    <i class="fas text-lg" :class="link.icon"></i>
                    <span v-if="(typeof link.badge === 'object' ? link.badge.value : link.badge) > 0"
                        class="cart-badge absolute top-0 right-0 bg-[var(--espace-or)] text-[var(--espace-vert)] text-xs rounded-full h-5 w-5 flex items-center justify-center"
                        :class="{
                            'animate-scale':
                                (link.to === '/panier' && animateCartBadge) ||
                                (link.to === '/collaborations' && animateCollaborationBadge) ||
                                (link.to === '/commandes' && animateOrdersBadge),
                        }" :aria-label="link.to === '/panier'
                            ? 'Nombre d\'articles dans le panier'
                            : link.to === '/collaborations'
                                ? 'Collaborations en attente'
                                : 'Commandes en attente'
                            ">
                        {{ typeof link.badge === 'object' ? link.badge.value : link.badge }}
                    </span>
                </RouterLink>
            </div>
        </nav>
    </Transition>
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
    transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
    transform: translateY(100%);
    opacity: 0;
}

.cart-badge {
    transition: transform 0.2s ease, background-color 0.3s ease;
}

.cart-badge.animate-scale {
    animation: scaleBadge 0.3s ease-in-out;
}

@keyframes scaleBadge {
    0% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.2);
    }

    100% {
        transform: scale(1);
    }
}
</style>