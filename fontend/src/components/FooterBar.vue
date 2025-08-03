<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/Auth';
import { useUserStateStore } from '../stores/userState';

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
</script>

<template>
    <div class='relative bg-yelow-800'>
    <Transition name="slide-up">

            <nav
                class="lg:hidden absolute bottom-0 left-0 w-full bg-[var(--espace-vert)] text-[var(--espace-blanc)] shadow-md z-40">
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
    </div>
</template>

<style scoped>
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