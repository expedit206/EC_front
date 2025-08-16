<!-- src/components/MessageComponent.vue (ou équivalent) -->
<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted, nextTick, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/Auth';
import apiClient from '../api';
import { useToast } from 'vue-toastification';
import { useUserStateStore } from '../stores/userState'; // Importer le store

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const toast = useToast();
const userStateStore = useUserStateStore(); // Utiliser le store

const conversations = ref<any[]>([]);
const messages = ref<any[]>([]);
const selectedConversation = ref<any>(null);
const newMessage = ref('');
const isSidebarOpen = ref(true);
const offset = ref(0);
const hasMore = ref(false);
const isLoading = ref(false);
const messagesContainer = ref<HTMLElement | null>(null);
const productId = ref<number | null>(null);

const isMobile = ref(window.innerWidth < 768);

const scrollToBottom = () => {
    nextTick(() => {
        messagesContainer.value?.scrollTo({
            top: messagesContainer.value.scrollHeight,
            behavior: 'smooth'
        });
    });
};

const fetchConversations = async () => {
    try {
        const res = await apiClient.get('/conversations');
        conversations.value = res.data.conversations;
    } catch (e) {
        toast.error('Erreur lors de la récupération des conversations');
        console.error(e);
    }
};

const fetchMessages = async (receiverId: number, resetOffset = true) => {
    if (isLoading.value) return;
    isLoading.value = true;

    try {
        if (resetOffset) {
            offset.value = 0;
            messages.value = [];
        }

        isSidebarOpen.value = false;
        const res = await apiClient.get(`/chat/${receiverId}?offset=${offset.value}`);
        messages.value = [...res.data.messages];
        hasMore.value = res.data.hasMore;

        selectedConversation.value = conversations.value.find(c => c.user_id === receiverId) || {
            user_id: receiverId,
            name: `Utilisateur #${receiverId}`,
        };

        const storedProductId = localStorage.getItem('chatProductId');
        if (storedProductId) {
            productId.value = parseInt(storedProductId);
        }

        // Marquer tous les messages comme lus pour cette conversation
        await markAllMessagesAsRead(receiverId);

        scrollToBottom();
    } catch (e) {
        toast.error('Erreur lors du chargement des messages');
        console.error(e);
    } finally {
        isLoading.value = false;
    }
};

const selectConversation = (receiverId: number) => {
    router.push({ name: 'messages', params: { receiverId } });
    if (isMobile.value) {
        isSidebarOpen.value = false;
    }
};

const sendMessage = async () => {
    if (!newMessage.value.trim() || !selectedConversation.value) {
        toast.error('Veuillez sélectionner une conversation et écrire un message');
        return;
    }

    const content = newMessage.value.trim();
    const tempMessage = {
        id: -Date.now(),
        sender_id: authStore.user.id,
        receiver_id: selectedConversation.value.user_id,
        content,
        created_at: new Date().toISOString(),
        sender: { nom: authStore.user.nom || 'Moi' },
        product_id: productId.value,
    };

    messages.value.push(tempMessage);
    newMessage.value = '';
    scrollToBottom();

    try {
        await apiClient.post(`/chat/${selectedConversation.value.user_id}`, {
            content,
            product_id: productId.value,
        });

        if (productId.value) {
            localStorage.removeItem('chatProductId');
            productId.value = null;
        }

        await fetchMessages(selectedConversation.value.user_id);
    } catch (e) {
        toast.error('Échec d\'envoi');
        console.error(e);
    }
};

const handleScroll = () => {
    if (!messagesContainer.value || !hasMore.value || isLoading.value) return;
    if (messagesContainer.value.scrollTop <= 100) {
        offset.value += 30;
        fetchMessages(selectedConversation.value.user_id, false);
    }
};

const handleResize = () => {
    isMobile.value = window.innerWidth < 768;
    isSidebarOpen.value = window.innerWidth > 768;
};

const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
};

// Nouvelle méthode pour marquer tous les messages comme lus
const markAllMessagesAsRead = async (receiverId: number) => {
    try {

        console.log(receiverId)
        const response = await apiClient.put('/messages/mark-all-as-read');
        console.log(response.data)
        userStateStore.saveUnreadMessagesToLocalStorage(response.data.unread_messages);
    } catch (error) {
        console.error('Erreur lors du marquage des messages comme lus:', error);
        toast.error('Erreur lors de la mise à jour des messages lus');
    }
};

watch(() => route.params.receiverId, async (receiverId) => {
    if (receiverId) {
        await fetchMessages(parseInt(receiverId as string));
    }
});

onMounted(() => {
    fetchConversations();
    if (route.params.receiverId) {
        fetchMessages(parseInt(route.params.receiverId as string));
    }
    window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
});
</script>

<template>
    <div class="w-full flex relative px-0">
        <!-- Sidebar -->
        <transition name="slide-fade">
            <div v-if="isSidebarOpen || !isMobile" class="bg-white pt-8 shadow-md p-4 overflow-y-auto transition-all"
                :class="isMobile ? 'absolute top-0 left-0 h-full z-30 w-full' : 'w-[400px]'">
                <h2 class="text-lg font-semibold text-[var(--espace-vert)] mb-4">Conversations</h2>
                <div v-for="conv in conversations" :key="conv.user_id" @click="selectConversation(conv.user_id)"
                    class="p-2 hover:bg-gray-100 cursor-pointer rounded flex items-center transition-colors">
                    <div class="w-10 h-10 bg-[var(--espace-or)] rounded-full mr-2 flex items-center justify-center">
                        <span class="text-white font-bold">{{ conv.name.charAt(0) }}</span>
                    </div>
                    <div class="min-w-0">
                        <p class="font-semibold text-[var(--espace-vert)] truncate">{{ conv.name }}</p>
                        <p class="text-xs text-[var(--espace-gris)] truncate">{{ conv.last_message }}</p>
                    </div>
                </div>
            </div>
        </transition>

        <div class="w-full grid grid-rows-[10%_86%]">
            <div class="flex border-b">
                <!-- Bouton retour mobile -->
                <button v-if="!isSidebarOpen && isMobile && selectedConversation" @click="toggleSidebar"
                    class="text-green-900 p-2 rounded-full hover:bg-[var(--espace-or)] transition text-start md:hidden">
                    <i class="fas fa-arrow-left text-2xl"></i>
                </button>
                <h2 v-if="selectedConversation"
                    class="text-xl h-[10%] font-semibold text-[var(--espace-vert)] p-4 md:z-0">
                    {{ selectedConversation.name }}
                </h2>
            </div>

            <!-- Zone des messages -->
            <div :class="[
                'bg-white shadow-md transition-all duration-300 flex flex-col flex-1 h-full overflow-hidden w-full',
                isSidebarOpen && !isMobile ? '' : 'rounded-r-lg'
            ]" @scroll="handleScroll">
                <div v-if="selectedConversation" class="h-full flex flex-col">
                    <!-- Zone scrollable des messages -->
                    <div ref="messagesContainer"
                        class="h-full flex-1 overflow-y-auto p-2 md:p-4 space-y-3 bg-gray-50 messages-container">
                        <div v-for="message in messages" :key="message.id" class="p-3 rounded-lg break-words" :class="{
                            'bg-blue-200 ml-auto max-w-[85%] md:max-w-[70%]': message.sender_id === authStore.user.id,
                            'bg-gray-200 max-w-[85%] md:max-w-[70%]': message.sender_id !== authStore.user.id
                        }">
                            <strong class="block text-[var(--espace-vert)]">{{ message.sender.nom }} :</strong>
                            <p class="text-gray-800">
                                <router-link v-if="message.product?.id"
                                    :to="{ name: 'produit', params: { id: message.product.id } }"
                                    class="text-blue-500 underline hover:text-blue-700 ml-1">[Produit {{
                                        message.product.nom
                                    }}]</router-link>
                                {{ message.content }}
                            </p>
                            <p class="text-xs text-[var(--espace-gris)] text-right">
                                {{ new Date(message.created_at).toLocaleTimeString() }}
                            </p>
                        </div>
                        <div v-if="isLoading" class="text-center text-[var(--espace-gris)]">Chargement...</div>
                    </div>

                    <!-- Zone d’écriture -->
                    <div class="px-2 md:px-4 z-20">
                        <div
                            class="bg-white shadow-lg rounded-full flex items-center flex-wrap p-2 border max-w-3xl mx-auto gap-2">
                            <!-- Tag du produit -->
                            <span v-if="product?.id"
                                class="bg-yellow-200 text-yellow-800 text-xs px-3 py-1 rounded-full flex items-center gap-2 ml-4">
                                Produit {{ product.name }}
                                <button
                                    @click="() => { productId.value = null; localStorage.removeItem('chatProductId'); }"
                                    class="ml-2 text-yellow-800 hover:text-red-600 font-bold" title="Retirer le tag">
                                    &times;
                                </button>
                            </span>

                            <!-- Champ de texte -->
                            <input v-model="newMessage" type="text" placeholder="Écrivez votre message..."
                                class="flex-1 px-4 py-2 rounded-full focus:outline-none text-gray-700 text-sm placeholder-gray-400 min-w-[100px] md:min-w-[200px]" />

                            <!-- Bouton envoyer -->
                            <button @click="sendMessage"
                                class="ml-2 p-3 rounded-full bg-[var(--espace-vert)] text-white hover:bg-[var(--espace-or)] hover:text-[var(--espace-vert)] transition">
                                <i class="fas fa-location-arrow text-lg"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <div v-else class="flex items-center justify-center h-full">
                    <p class="text-[var(--espace-gris)] text-lg">Sélectionnez une conversation pour commencer.</p>
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

@media (max-width: 768px) {
    .container {
        padding-left: 0 !important;
        padding-right: 0 !important;
    }
}

.slide-fade-enter-active,
.slide-fade-leave-active {
    transition: all 0.4s ease;
}

.slide-fade-enter-from {
    opacity: 0;
    transform: translateX(-100%);
}

.slide-fade-enter-to {
    opacity: 1;
    transform: translateX(0);
}

.slide-fade-leave-from {
    opacity: 1;
    transform: translateX(0);
}

.slide-fade-leave-to {
    opacity: 0;
    transform: translateX(-100%);
}

button:active {
    transform: scale(0.95);
    transition: transform 0.1s ease-in-out;
}
</style>