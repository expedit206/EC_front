<!-- src/components/AppHeader.vue -->
<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/Auth';
import { useUserStateStore } from '../stores/userState';
import apiClient from '../api/index';
import { useProductStore } from '../stores/product';
import SoldeUser from './SoldeUser.vue';

// Fonction pour générer l'URL de base du stockage dynamiquement
const getStorageBaseUrl = () => {
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1") {
        return "http://localhost:8000/storage/";
    }
    return "https://espacecameroun.devfack.com/storage/"; // URL de production (à ajuster selon votre domaine)
};

// Computed property pour l'URL du stockage
const storageUrl = computed(() => getStorageBaseUrl());

const authStore = useAuthStore();
const userStateStore = useUserStateStore();
const router = useRouter();

const user = computed(() => authStore.user); // Utilisation de computed pour garantir la réactivité
const route = useRoute();
const animateCollaborationBadge = ref(false);
const animateMessagesBadge = ref(false);
const searchQuery = ref('');
const productStore = useProductStore();
const showSearch = ref(false);
const searchOverlayRef = ref<HTMLElement | null>(null);
const ignoreNextClick = ref(false);

const navLinks = computed(() => {
    return [
        ...(user.value
            ? [
                { to: '/', label: 'Accueil', icon: 'fa-home', badge: 0 },
                { to: '/messages', label: 'Chat', icon: 'fa-comment-dots', badge: userStateStore.unreadMessages },
                ...(user.value.commercant
                    ? [{ to: '/commercant/produits', label: 'Produits', icon: 'fa-box-open', badge: 0 }]
                    : []),
                { to: '/collaborations', label: 'Collaborations', icon: 'fa-handshake', badge: userStateStore.collaborationsPending },
                { to: '/parrainage', label: 'equipe', icon: 'fa-users', badge: 0 },
                { to: '/parametres', label: 'Parametres', icon: 'fa-cog' },
            ]
            : [
                { to: '/login', label: 'Connexion', icon: 'fa-sign-in-alt', badge: 0 },
                { to: '/register', label: 'Inscription', icon: 'fa-user-plus', badge: 0 },
            ]),
    ];
});

const fetchBadges = async () => {
    if (!user.value) return;
    try {
        await userStateStore.syncCollaborationsWithBackend(); // Synchronisation des collaborations
        // Pas besoin d'appeler initializeState ici si déjà fait au montage
    } catch (error) {
        console.error('Erreur lors du chargement des badges:', error);
    }
};

const initializeUserData = async () => {
    if (!user.value && authStore.token) {
        try {
            await authStore.checkAuth(); // Forcer la récupération de l'utilisateur si le token existe
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'utilisateur:', error);
            authStore.logout(); // Déconnexion en cas d'échec
        }
    }
    if (user.value) {
        await fetchBadges();
    }
};

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

onMounted(async () => {
    await initializeUserData(); // Initialisation des données utilisateur au montage
    document.addEventListener('click', handleClickOutside);
    if (authStore.user?.id) {
        window.Echo.channel(`chat.${authStore.user.id}`)
            .listen('MessageSent', (event: any) => {
                //console.log("📩 header e reçu :", event.message);
                if (authStore.user?.id === event.receiver_id) {
                    //console.log("📩 header e reçu :", event.message);
                    userStateStore.saveUnreadMessagesToLocalStorage(event.unread_messages);
                }
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
    <div class="relative bg-[var(--espace-vert)] w-full h-full">
        <header class="bg-[var(--espace-vert)] text-[var(--espace-blanc)] top-0 left-0  z-50 shadow-md h-full">
            <!-- <a href="../views/Doc.vue">docu</a> -->
            <div class="  px-2 w-full sm:px-3 py-2 flex justify-between items-center gap-4 mb-4">
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
                        <span v-if="link?.badge && link.badge > -1"
                            class="cart-badge bg-[var(--espace-or)] text-[var(--espace-vert)] text-xs rounded-full h-5 w-5 flex items-center justify-center"
                            :class="{
                                'animate-scale': (link.to === '/collaborations' && animateCollaborationBadge) || (link.to === '/messages' && animateMessagesBadge),
                            }" :aria-label="link.to === '/collaborations'
                                ? 'Collaborations en attente'
                                : link.to === '/messages'
                                    ? 'Messages non lus'
                                    : ''">
                            {{ link.badge }}
                        </span>
                    </RouterLink>
                </nav>
                <SoldeUser />
                <div class="flex items-center gap-2 ">
                    <!-- <button v-if="user" @click="toggleSearch"
                        class="text-[var(--espace-blanc)] hover:text-[var(--espace-or)] transition-colors duration-300"
                        aria-label="Ouvrir la recherche">
                        <i class="fas fa-search text-2xl"></i>
                    </button> -->
                    <!-- Séparer la logique pour profil et messages -->

                    <RouterLink v-if="user" :to="'/messages'" class="relative flex items-center justify-center"
                        aria-label="Messages">
                        <div class="w-10 h-10 rounded-full  flex items-center justify-center text-[var(--espace-gris)]">
                            <i class="fas fa-comment-dots text-2xl text-white"></i>
                        </div>
                        <span v-if="userStateStore.unreadMessages > -1"
                            class="cart-badge absolute top-0 right-0 bg-[var(--espace-or)] text-[var(--espace-vert)] text-xs rounded-full h-5 w-5 flex items-center justify-center"
                            :class="{ 'animate-scale': animateMessagesBadge }" aria-label="Messages non lus">
                            {{ userStateStore.unreadMessages }}
                        </span>
                    </RouterLink>

                    <RouterLink v-if="user" :to="'/profil'" class="relative flex items-center justify-center"
                        aria-label="Profil">
                        <img v-if="user?.photo" :src="storageUrl + user.photo" alt="Photo de profil"
                            class="w-10 h-10 rounded-full object-cover border-2 border-[var(--espace-vert)]" />
                        <div v-else
                            class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-[var(--espace-gris)]">
                            <i class="fas fa-user-circle text-2xl text-gray-500"></i>
                        </div>
                    </RouterLink>
                </div>


                <router-link v-if="user" to="/jetonMarket" aria-label="Aller au marché" class="fixed  bottom-17 z-10 right-5 w-12 h-12 rounded-full
                flex items-center justify-center
                bg-[var(--espace-vert)] text-yellow-300
                shadow-lg hover:scale-110 active:scale-95 transition-all
                ring-2 ring-yellow-400/60">
                    <i class="fas fa-coins text-xl "></i>
                </router-link>

                <div class="fixed bottom-30 right-6 z-50 bg-blue-300 w-10 h-10 rounded-full flex items-center justify-center
                hover:bg-blue-400 active:scale-95 transition-all shadow-lg">
                    <router-link to="/doc"
                        class="text-[var(--espace-vert)] text-3xl hover:text-[var(--espace-or)] transition-transform transform hover:scale-110">
                        ?
                    </router-link>
                </div>

            </div>
            <!-- Search Overlay -->


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