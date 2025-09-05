<!-- src/components/AppHeader.vue -->
<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/Auth';
import { useUserStateStore } from '../stores/userState';
import apiClient from '../api/index';
import { useProductStore } from '../stores/product';
import SoldeUser from './SoldeUser.vue';

const authStore = useAuthStore();
const userStateStore = useUserStateStore();
const router = useRouter();
const user = authStore.user;
const route = useRoute();
const animateCollaborationBadge = ref(false); // Renommé pour clarté
const animateMessagesBadge = ref(false); // Nouveau pour messages
const searchQuery = ref('');
const productStore = useProductStore();
const showSearch = ref(false);
const searchOverlayRef = ref<HTMLElement | null>(null);
const ignoreNextClick = ref(false);

const navLinks = computed(() => {
    return [
        { to: '/', label: 'Accueil', icon: 'fa-home', badge: 0 },
        ...(authStore.user
            ? [
                { to: '/profil', label: 'Profil', icon: 'fa-user-circle' },
                { to: '/messages', label: 'Messages', icon: 'fa-comment-dots', badge: userStateStore.unreadMessages },
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
        await userStateStore.syncCollaborationsWithBackend(); // Utilise la méthode unifiée
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
    () => userStateStore.collaborationsPending,
    (newValue) => {
        if (newValue > -1) {
            animateCollaborationBadge.value = true;
            setTimeout(() => (animateCollaborationBadge.value = false), 300);
        }
    }
);

watch(
    () => userStateStore.unreadMessages,
    (newValue) => {
        if (newValue > -1) {
            animateMessagesBadge.value = true;
            setTimeout(() => (animateMessagesBadge.value = false), 300);
        }
    }
);

const performSearch = async () => {
    if (searchQuery.value.trim()) {
        try {
            await productStore.fetchProducts({ search: searchQuery.value.trim() }, true);
            searchQuery.value = '';
            showSearch.value = false;
        } catch (error) {
            console.error('Erreur lors de la recherche:', error);
        }
    }
};

const handleClickOutside = (event: MouseEvent) => {
    if (ignoreNextClick.value) {
        ignoreNextClick.value = false;
        return;
    }
    if (searchOverlayRef.value && !searchOverlayRef.value.contains(event.target as Node)) {
        showSearch.value = false;
    }
};

const toggleSearch = async () => {
    showSearch.value = !showSearch.value;
    if (showSearch.value) {
        ignoreNextClick.value = true;
        await nextTick();
    }
};



onMounted(() => {


    if (authStore.user) {
        fetchBadges();
        userStateStore.initializeState();
    }

    
    document.addEventListener('click', handleClickOutside);
    if (authStore.user?.id) {
        window.Echo.channel(`chat.${authStore.user.id}`)
            .listen('MessageSent', (event: any) => {

                console.log("📩 header e reçu :", event.message);
                // Si c’est bien dans la conversation ouverte, on ajoute direct
                if (authStore.user?.id === event.receiver_id) {
                    console.log("📩 header e reçu :", event.message);
                    userStateStore.saveUnreadMessagesToLocalStorage(event.unread_messages);
                }

                // Mettre à jour les unread messages
            });
    }
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
    if (authStore.user?.id) {
        window.Echo.leave(`chat.${authStore.user.id}`);
    }
});
</script>

<template>
    <div class="relative">
        <header class="bg-[var(--espace-vert)] text-[var(--espace-blanc)] top-0 left-0 w-full z-50 shadow-md">
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
                        <span v-if=" link.badge > -1"
                            class="cart-badge bg-[var(--espace-or)] text-[var(--espace-vert)] text-xs rounded-full h-5 w-5 flex items-center justify-center"
                            :class="{
                                'animate-scale': (link.to === '/collaborations' && animateCollaborationBadge) || (link.to === '/messages' && animateMessagesBadge),
                            }" :aria-label="link.to === '/collaborations'
                                ? 'Collaborations en attente'
                                : link.to === '/messages'
                                    ? 'Messages non lus'
                                    : ''">
                            {{  link.badge }}
                        </span>
                    </RouterLink>
                </nav>
                <SoldeUser />
                <div class="flex items-center gap-2">
                    <button v-if="user" @click="toggleSearch"
                        class="text-[var(--espace-blanc)] hover:text-[var(--espace-or)] transition-colors duration-300"
                        aria-label="Ouvrir la recherche">
                        <i class="fas fa-search text-2xl"></i>
                    </button>
                    <!-- Séparer la logique pour profil et messages -->
                    <RouterLink v-if="authStore.user" :to="'/profil'" class="relative flex items-center justify-center"
                        aria-label="Profil">
                        <img v-if="user?.photo" :src="`http://localhost:8000/storage/${user.photo}`"
                            alt="Photo de profil"
                            class="w-10 h-10 rounded-full object-cover border-2 border-[var(--espace-vert)]" />
                        <div v-else
                            class="w-10 h-10 rounded-full  flex items-center justify-center text-[var(--espace-gris)]">
                            <i class="fas fa-user-circle text-2xl text-gray-100"></i>
                        </div>
                    </RouterLink>
                    <RouterLink v-if="authStore.user" :to="'/messages'"
                        class="relative flex items-center justify-center" aria-label="Messages">
                        <div class="w-10 h-10 rounded-full  flex items-center justify-center text-[var(--espace-gris)]">
                            <i class="fas fa-comment-dots text-2xl text-gray-100"></i>
                        </div>
                        <span v-if="userStateStore.unreadMessages > -1"
                            class="cart-badge absolute top-0 right-0 bg-[var(--espace-or)] text-[var(--espace-vert)] text-xs rounded-full h-5 w-5 flex items-center justify-center"
                            :class="{ 'animate-scale': animateMessagesBadge }" aria-label="Messages non lus">
                            {{ userStateStore.unreadMessages }}
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