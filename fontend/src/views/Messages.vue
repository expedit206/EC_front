<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted, nextTick, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/Auth';
import { useToast } from 'vue-toastification';
import { useUserStateStore } from '../stores/userState';
import { Message, Product, User } from '../components/types/index';
import apiClient from '../api/index';

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

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const toast = useToast();
const userStateStore = useUserStateStore();

const conversations = ref<any[]>([]);
const messages = ref<Message[]>([]);
const selectedConversation = ref<any>(null);
const newMessage = ref('');
const isSidebarOpen = ref(true);
const offset = ref(0);
const hasMore = ref(false);
const isLoading = ref(false);
const messagesContainer = ref<HTMLElement | null>(null);
const product = ref<Product | null>(null);
const isMobile = ref(window.innerWidth < 768);

// Référence pour suivre le canal Echo actuel
let currentChannel: any = null;

const scrollToBottom = () => {
    nextTick(() => {
        messagesContainer.value?.scrollTo({
            top: messagesContainer.value.scrollHeight,
            behavior: 'smooth',
        });
    });
};

const clearProductTag = () => {
    product.value = null;
    localStorage.removeItem('chatProduct');
};

const fetchConversations = async () => {
    try {
        const res = await apiClient.get('/conversations');
        conversations.value = res.data.conversations;
        //console.log(res.data);
    } catch (e: any) {
        if (e.response?.data?.message == 'Unauthenticated.') {
            router.push('login')
        }

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
        // //console.log(res.data);

        hasMore.value = res.data.hasMore;

        const storedProduct = localStorage.getItem('chatProduct');
        const conversation = conversations.value.find(c => c.user_id === receiverId);

        // Priorité au commerçant si is_commercant est vrai
        let name = '';
        let profilePhoto = '/default-avatar.png';
        if (conversation) {
            name = conversation.is_commercant ? conversation.name : (res.data.user?.nom || '');
            profilePhoto = conversation.profile_photo || '/default-avatar.png';
        } else if (storedProduct) {
            const productData = JSON.parse(storedProduct);
            name = productData.commercant_name || res.data.user?.nom || '';
            profilePhoto = conversation?.profile_photo || '/default-avatar.png';
        } else {
            name = res.data.user?.nom || '';
        }

        selectedConversation.value = {
            user_id: receiverId,
            name: name,
            is_commercant: conversation?.is_commercant || false,
            profile_photo: profilePhoto,
        };

        if (storedProduct) {
            product.value = JSON.parse(storedProduct);
        }

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
    const tempMessage: Message = {
        id: -Date.now(),
        sender_id: authStore.user?.id,
        receiver_id: selectedConversation.value.user_id,
        content,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_read: false,
        product_id: product.value?.id || null,
        sender: {
            id: authStore.user?.id ?? 0,
            nom: authStore.user?.nom ?? "",
            email: authStore.user?.email ?? "",
            telephone: authStore.user?.telephone ?? "",
            ville: authStore.user?.ville ?? "",
            premium: authStore.user?.premium ?? false,
            parrain_id: authStore.user?.parrain_id ?? 0,
        },
        receiver: {
            id: selectedConversation.value.user_id,
            nom: selectedConversation.value.name,
            email: null,
            telephone: null,
            ville: null,
            premium: false,
            parrain_id: null,
        },
        product: product.value || null,
    };

    messages.value.push(tempMessage);
    newMessage.value = '';
    scrollToBottom();

    try {
        const res = await apiClient.post(`/chat/${selectedConversation.value.user_id}`, {
            content,
            product_id: product.value?.id,
        });
        //console.log(res.data);

        if (product.value) {
            clearProductTag();
        }
    } catch (e: any) {

        if (e.response?.data?.message == 'Unauthenticated.') {
            router.push('login')
        }
        

        toast.error('Échec d\'envoi');
        console.error(e);
        messages.value = messages.value.filter(m => m.id !== tempMessage.id);
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
    isSidebarOpen.value = window.innerWidth >= 768;
};

const markAllMessagesAsRead = async (receiverId: number) => {
    try {
        const response = await apiClient.put('/messages/mark-all-as-read');
        userStateStore.saveUnreadMessagesToLocalStorage(response.data.unread_messages);
    } catch (error :any) {
        if (error.response?.data?.message == 'Unauthenticated.') {
            router.push('login')
        }

        console.error('Erreur lors du marquage des messages comme lus:', error);
        toast.error('Erreur lors de la mise à jour des messages lus');
    }
};

const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
};

const viewProfile = (userId: number, isCommercant: boolean) => {
    const profileRoute = isCommercant ? `/commercants/${userId}` : `/users/${userId}`;
    router.push(profileRoute);
};

// Gestion de la connexion au canal Echo
const subscribeToChannel = (receiverId: number) => {
    if (currentChannel) {
        currentChannel.stopListening('MessageSent'); // Déconnexion du canal précédent
        window.Echo.leave(`chat.${currentChannel.params.receiverId}`);
    }
    if (receiverId && authStore.user?.id) {
        //console.log("🔔 Abonnement au canal chat." + receiverId);
        currentChannel = window.Echo.channel(`public-channel`)
            .listen('message.sent', (event: any) => {
                //console.log("📩 Nouveau message reçu :", event.message);
                if (selectedConversation.value?.user_id === receiverId && event.sender_id !== authStore.user?.id) {
                    const newMessage: Message = {
                        id: event.message.id,
                        sender_id: event.sender_id,
                        receiver_id: event.receiver_id,
                        content: event.message.content,
                        created_at: event.message.created_at,
                        updated_at: event.message.updated_at,
                        is_read: event.message.is_read,
                        product_id: event.message.product_id || null,
                        sender: event.sender,
                        receiver: event.receiver,
                        product: event.message.product || null,
                    };
                    messages.value.push(newMessage);
                    scrollToBottom();
                    userStateStore.saveUnreadMessagesToLocalStorage(event.unread_messages);
                }
            });
        currentChannel.params = { receiverId }; // Stocker l'ID pour la déconnexion
    }
};

onMounted(() => {
    fetchConversations();
    if (route.params.receiverId) {
        fetchMessages(parseInt(route.params.receiverId as string));
    }
    window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
    if (currentChannel) {
        currentChannel.stopListening('MessageSent');
        window.Echo.leave(`chat.${currentChannel.params.receiverId}`);
    }
    window.removeEventListener('resize', handleResize);
});

watch(() => selectedConversation.value?.user_id, (newReceiverId) => {
    if (newReceiverId) {
        subscribeToChannel(newReceiverId);
    }
});

watch(() => route.params.receiverId, async (receiverId) => {
    if (receiverId) {
        await fetchMessages(parseInt(receiverId as string));
    }
});
</script>

<template>
    <div class="w-full flex relative px-0">
        <transition name="slide-fade">
            <div v-if="isSidebarOpen || !isMobile" class="bg-white pt-8 shadow-md p-4 overflow-y-auto transition-all"
                :class="isMobile ? 'absolute top-0 left-0 h-full z-30 w-full' : 'w-[400px]'">
                <h2 class="text-lg font-semibold text-[var(--espace-vert)] mb-4">Conversations</h2>

                <div v-for="conv in conversations" :key="conv.user_id" @click="selectConversation(conv.user_id)"
                    class="p-2 hover:bg-gray-100 cursor-pointer rounded flex items-center justify-between transition-colors">
                    <div class="flex items-center">
                        <div @click.stop="viewProfile(conv.user_id, conv.is_commercant)"
                            class="w-10 h-10 bg-[var(--espace-or)] rounded-full mr-2 flex items-center justify-center overflow-hidden cursor-pointer">
                            <img v-if="conv.profile_photo" :src="storageUrl + conv.profile_photo" alt="Photo de profil"
                                class="w-full h-full object-cover">
                            <i v-else class="fas fa-user-circle text-2xl text-gray-500"></i>
                        </div>
                        <div class="min-w-0">
                            <p class="font-semibold text-[var(--espace-vert)] truncate">{{ conv.name }}</p>
                            <p class="text-xs text-[var(--espace-gris)] truncate">{{ conv.last_message }}</p>
                        </div>
                    </div>
                    <div class="flex items-center">
                        <div v-if="conv.unread_count > 0"
                            class="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mr-2">
                            {{ conv.unread_count }}
                        </div>
                        <div class="text-xs text-[var(--espace-gris)] ml-2 whitespace-nowrap">
                            {{ new Date(conv.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            }}
                        </div>
                    </div>
                </div>
            </div>
        </transition>

        <div class="w-full grid grid-rows-[10%_86%]">
            <div class="flex border-b">
                <button v-if="!isSidebarOpen && isMobile && selectedConversation" @click="toggleSidebar"
                    class="text-green-900 p-2 rounded-full hover:bg-[var(--espace-or)] transition text-start">
                    <i class="fas fa-arrow-left text-2xl"></i>
                </button>
                <h2 v-if="selectedConversation" class="text-xl h-[10%] font-semibold text-[var(--espace-vert)] p-4">
                    {{ selectedConversation.name }}
                </h2>
            </div>

            <div :class="[
                'bg-white shadow-md transition-all duration-300 flex flex-col flex-1 h-full overflow-hidden w-full',
                isSidebarOpen && !isMobile ? '' : 'rounded-r-lg'
            ]" @scroll="handleScroll">
                <div v-if="selectedConversation" class="h-full flex flex-col">
                    <div ref="messagesContainer"
                        class="h-full flex-1 overflow-y-auto p-2 md:p-4 space-y-3 bg-gray-50 messages-container">
                        <div v-for="message in messages" :key="message.id" class="p-3 rounded-full break-words" :class="{
                            'bg-blue-200 ml-auto max-w-[85%] md:max-w-[70%]': message.sender_id === authStore.user?.id,
                            'bg-gray-200 max-w-[85%] md:max-w-[70%]': message.sender_id !== authStore.user?.id
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
                            <p class="text-xs text-[var(--espace-gris)] text-right mr-2">
                                {{ new Date(message.created_at).toLocaleTimeString() }}
                            </p>
                        </div>
                        <div v-if="isLoading" class="text-center text-[var(--espace-gris)]">Chargement...</div>
                    </div>

                    <div class="px-2 md:px-4 z-20">
                        <div
                            class="bg-white shadow-lg rounded-full flex items-center flex-wrap p-2 border max-w-3xl mx-auto gap-2">
                            <span v-if="product?.id"
                                class="bg-yellow-200 text-yellow-800 text-xs px-3 py-1 rounded-full flex items-center gap-2 ml-4">
                                Produit {{ product?.nom }}
                                <button @click="clearProductTag"
                                    class="ml-2 text-yellow-800 hover:text-red-600 font-bold" title="Retirer le tag">
                                    &times;
                                </button>
                            </span>
                            <input v-model="newMessage" @keyup.enter="sendMessage" type="text"
                                placeholder="Écrivez votre message..."
                                class="flex-1 px-4 py-2 rounded-full focus:outline-none text-gray-700 text-sm placeholder-gray-400 min-w-[100px] md:min-w[200px]" />
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

.slide-fade-enter-from,
.slide-fade-leave-from {
    opacity: 0;
    transform: translateX(-100%);
}

.slide-fade-enter-to,
.slide-fade-leave-to {
    opacity: 1;
    transform: translateX(0);
}

button:active {
    transform: scale(0.95);
    transition: transform 0.1s ease-in-out;
}
</style>