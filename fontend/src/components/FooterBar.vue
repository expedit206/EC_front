<!-- src/components/FooterNav.vue -->
<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/Auth';
import { useUserStateStore } from '../stores/userState';

const authStore = useAuthStore();
const userStateStore = useUserStateStore();
const router = useRouter();
const animateCollaborationBadge = ref(false); // Badge pour collaborations
const animateMessagesBadge = ref(false); // Badge pour messages (facultatif)

const navLinks = computed(() => {
    return [
        ...(authStore.user
            ? [
                { to: '/', label: 'Accueil', icon: 'fa-home' },

            ...(authStore.user.commercant
                ? [{ to: '/commercant/produits', label: 'Mes Produits', icon: 'fa-box-open' },

                { to: '/collaborations', label: 'Collaborations', icon: 'fa-handshake', badge: userStateStore.collaborationsPending },
                
            ]
            : []),
                { to: '/parrainage', label: 'Mon Parrainage', icon: 'fa-users' },
                // Ajout optionnel pour messages
                { to: '/parametres', label: 'Parametres', icon: 'fa-cog' },

                // { to: '/messages', label: 'Messages', icon: 'fa-comment-dots', badge: userStateStore.unreadMessages },
            ]
            : [
                { to: '/login', label: 'Connexion', icon: 'fa-sign-in-alt' },
                { to: '/register', label: 'Inscription', icon: 'fa-user-plus' },
            ]),
    ];
});

// Watchers pour animer les badges
watch(
    () => userStateStore.collaborationsPending,
    (newValue) => {
        if (newValue > 0) {
            animateCollaborationBadge.value = true;
            setTimeout(() => (animateCollaborationBadge.value = false), 300);
        }
    }
);

watch(
    () => userStateStore.unreadMessages,
    (newValue) => {
        if (newValue > 0) {
            animateMessagesBadge.value = true;
            setTimeout(() => (animateMessagesBadge.value = false), 300);
        }
    }
);
</script>

<template>
    <div class="relative">
        <Transition name="slide-up">
            <nav
                class="lg:hidden fixed bottom-0 left-0 w-full bg-[var(--espace-vert)] text-[var(--espace-blanc)] shadow-md z-40">
                <div class="flex justify-around items-center py-2">
                    <RouterLink v-for="link in navLinks" :key="link.to" :to="link.to" :aria-label="link.label"
                        class="relative flex items-center justify-center w-10 h-10 hover:text-[var(--espace-or)] transition-colors duration-300"
                        active-class="text-[var(--espace-or)]">
                        <i class="fas text-lg" :class="link.icon"></i>
                        <span v-if="link?.badge ? link.badge  > -1 : false"
                            class="cart-badge absolute top-0 right-0 bg-[var(--espace-or)] text-[var(--espace-vert)] text-xs rounded-full h-5 w-5 flex items-center justify-center"
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







                </div>
            </nav>
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