<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/Auth';
import { useUserStateStore } from '../stores/userState';
import apiClient from '../api';
import { ref } from 'vue';

const authStore = useAuthStore();
const userStateStore = useUserStateStore();
const router = useRouter();
const animateCartBadge = ref(false);
const animateCollaborationBadge = ref(false);
const animateOrdersBadge = ref(false);

const navLinks = computed(() => {
    return [
        { to: '/', label: 'Accueil', icon: 'fa-home', badge: 0 },
        ...(authStore.user
            ? [
                { to: '/profil', label: 'Profil', icon: 'fa-user', badge: 0 },
                ...(authStore.user.commercant
                    ? [{ to: '/commercant/produits', label: 'Mes Produits', icon: 'fa-box-open', badge: 0 }]
                    : []),
                { to: '/collaborations', label: 'Collaborations', icon: 'fa-handshake', badge: userStateStore.collaborationsPending },
                { to: '/parrainage', label: 'Mon Parrainage', icon: 'fa-users', badge: 0 }, // Nouveau lien
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
        console.error('Erreur lors du chargement des badges');
    }
};

// Réagir aux changements de l'état de connexion
watch(
    () => authStore.user,
    (newUser) => {
        if (newUser) {
            fetchBadges(); // Mettre à jour les badges lorsque l'utilisateur se connecte
            userStateStore.initializeState(); // Réinitialiser l'état si nécessaire
        }
    },
    { immediate: true } // Exécuter immédiatement au montage
);

// Animation pour le badge du panier
watch(
    () => userStateStore.cartCount,
    () => {
        if (userStateStore.cartCount > 0) {
            animateCartBadge.value = true;
            setTimeout(() => (animateCartBadge.value = false), 300);
        }
    }
);

// Animation pour le badge de collaboration
watch(
    () => userStateStore.collaborationsPending,
    () => {
        if (userStateStore.collaborationsPending > 0) {
            animateCollaborationBadge.value = true;
            setTimeout(() => (animateCollaborationBadge.value = false), 300);
        }
    }
);

// Animation pour le badge des commandes
watch(
    () => userStateStore.ordersPending,
    () => {
        if (userStateStore.ordersPending > 0) {
            animateOrdersBadge.value = true;
            setTimeout(() => (animateOrdersBadge.value = false), 300);
        }
    }
);

onMounted(() => {
    if (authStore.user) {
        fetchBadges();
        userStateStore.initializeState();
    }
});
</script>

<template>
    <header class="bg-[var(--espace-vert)] text-[var(--espace-blanc)] fixed top-0 left-0 w-full z-50 shadow-md">
        <div class="container mx-auto px-4 sm:px-6 py-2 flex justify-between items-center gap-4">
            <div class="flex items-center gap-2 sm:gap-3">
                <RouterLink to="/" aria-label="Retour à l'accueil">
                    <div class="bg-[var(--espace-blanc)] rounded-full p-1">
                        <img src="/src/assets/images/logo.png" alt="Logo Espace Cameroun"
                            class="h-8 w-8 sm:h-10 sm:w-10 object-contain transition-transform duration-300 hover:scale-105 shadow-sm hover:shadow-md" />
                    </div>
                </RouterLink>
                <h1 class="text-lg sm:text-xl font-bold font-poppins text-[var(--espace-blanc)]">
                    Espace Cameroun
                </h1>
                <RouterLink v-if="authStore.user" to="/parametres" aria-label="Paramètres"
                    class="flex items-center justify-center w-10 h-10 hover:text-[var(--espace-or)] transition-colors duration-300">
                    <i class="fas fa-cog text-lg"></i>
                </RouterLink>
            </div>

            <nav class=" hidden lg:flex items-center space-x-4 sm:space-x-6 font-poppins text-sm sm:text-base">
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
        </div>
    </header>

    <Transition name="slide-up">
        <nav
            class="lg:hidden fixed bottom-0 left-0 w-full bg-[var(--espace-vert)] text-[var(--espace-blanc)] shadow-md z-50">
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