<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/Auth';
import apiClient from '../api';
import { useToast } from 'vue-toastification';
import Echo from 'laravel-echo';

const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

const conversations = ref<any[]>([]);
const messages = ref<any[]>([]);
const selectedConversation = ref<any>(null);
const newMessage = ref('');
const isSidebarOpen = ref(true);
const offset = ref(0);
const hasMore = ref(false);
const isLoading = ref(false);
const messagesContainer = ref<HTMLElement | null>(null);

const scrollToBottom = () => {
    nextTick(() => {
        if (messagesContainer.value) {
            messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
        }
    });
};

// Détection mobile
const isMobile = computed(() => window.innerWidth <= 768);

const fetchConversations = async () => {
    if (!authStore.user) {
        toast.error('Veuillez vous connecter');
        router.push('/login');
        return;
    }

    try {
        const response = await apiClient.get('/conversations');
        conversations.value = response.data.conversations;
        if (conversations.value.length > 0 && isMobile.value) {
            selectConversation(conversations.value[0].user_id);
        }
    } catch (error) {
        toast.error('Erreur lors de la récupération des conversations');
        console.error(error);
    }
};

const fetchMessages = async (receiverId: number, resetOffset = false) => {
    if (isLoading.value) return;

    isLoading.value = true;
    try {
        if (resetOffset) {
            offset.value = 0;
            messages.value = [];
        }
        const response = await apiClient.get(`/chat/${receiverId}?offset=${offset.value}`);
        console.log(response.data.messages);
        
        messages.value = [ ...response.data.messages]; // Ajoute les nouveaux 
        console.log(messages.value);
        hasMore.value = response.data.hasMore;
        setTimeout(() => scrollToBottom(), 10); // Défilement après rendu
        selectedConversation.value = conversations.value.find(c => c.user_id === receiverId);
        if (isMobile.value) {
            isSidebarOpen.value = false;
        }
    } catch (error) {
        toast.error('Erreur lors de la récupération des messages');
        console.error(error);
    } finally {
        isLoading.value = false;
    }
};

const selectConversation = (receiverId: number) => {
    fetchMessages(receiverId, true); // Réinitialise l'offset
    // if (Echo && selectedConversation.value) {
        window.Echo.private(`chat.${receiverId}`)
        .listen('MessageSent', (e) => {
                console.log(`Conversation sélectionnée : ok`);
                if (e.message.sender_id !== authStore.user.id) { // Éviter les doublons
                    messages.value.push(e.message);
                    scrollToBottom();
                }
            });
};

const sendMessage = async () => {
    if (!newMessage.value.trim() || !selectedConversation.value) {
        toast.error('Veuillez sélectionner une conversation et écrire un message');
        return;
    }

    try {
        const content = newMessage.value.trim();
        const tempId = -Date.now();
        const now = new Date();
        const tempMessage = {
            id: tempId,
            sender_id: authStore.user.id,
            receiver_id: selectedConversation.value.user_id,
            content,
            created_at: now.toISOString(),
            sender: { nom: authStore.user.nom || "Moi" }
        };
        messages.value.push(tempMessage);
        newMessage.value = '';
        scrollToBottom();


        window.Echo.private(`chat.${tempMessage.receiver_id}`)
        .listen('MessageSent', (e) => {
            console.log(`Conversation sélectionnée : ok`);
            if (e.message.sender_id !== authStore.user.id) { // Éviter les doublons
                messages.value.push(e.message);
                scrollToBottom();
            }
        });



        const res = await apiClient.post(`/chat/${parseInt(selectedConversation.value.user_id)}`, { content });
        console.log(res.data);
        await fetchMessages(selectedConversation.value.user_id); // Recharge pour mettre à jour avec l'ID réel
        toast.success('Message envoyé avec succès');
    } catch (error) {
        toast.error('Erreur lors de l\'envoi du message');
        console.error(error);
    }
};

setInterval(() => {
    if (selectedConversation.value) {
        fetchMessages(selectedConversation.value.user_id);
    }
}, 2000); // Rafraîchit les messages toutes les 5 secondes

const handleScroll = () => {
    if (messagesContainer.value && !isLoading.value && hasMore.value) {
        const { scrollTop } = messagesContainer.value;
        if (scrollTop <= 100) {
            offset.value += 30;
            fetchMessages(selectedConversation.value.user_id);
        }
    }
};

const toggleSidebar = () => {
    if (isMobile.value) {
        isSidebarOpen.value = !isSidebarOpen.value;
    }
};

const handleResize = () => {
    if (window.innerWidth > 768) {
        isSidebarOpen.value = true;
    }
};

onMounted(() => {
    fetchConversations();

    
    window.addEventListener('resize', handleResize);


    // Echo.private(`chat.${tempMessage.receiver_id}`)
    //     .listen('MessageSent', (e) => {
    //         console.log(`Conversation sélectionnée : ok`);
    //         if (e.message.sender_id !== authStore.user.id) { // Éviter les doublons
    //             messages.value.push(e.message);
    //             scrollToBottom();
    //         }
    //     });
});

onUnmounted(() => {
    window.removeEventListener('resize', handleResize);

    if (window.Echo && selectedConversation.value) {
        window.Echo.leave(`chat.${selectedConversation.value.user_id}`);
    }
});
</script>

<template>
    <!-- Bouton retour mobile -->
    <button v-if="!isSidebarOpen && isMobile && selectedConversation" @click="toggleSidebar"
        class="fixed top-16 left-4 z-10 text-green-900 p-2 rounded-full hover:bg-[var(--espace-or)] transition bg-white text-start w-full ">
        <i class="fas fa-arrow-left text-2xl "></i>
    </button>

    <div class="container mx-auto max-w-4xl h-full flex relative">
        <!-- Sidebar -->
        <transition name="slide-fade">
            <div v-if="isSidebarOpen || !isMobile"
                class="bg-white fixed pt-8 shadow-md p-4 overflow-y-auto transition-all"
                :class="isMobile ? 'absolute top-0 left-0 h-full z-20' : 'rounded-l-lg'" style="width: 300px;">
                <h2 class="text-lg font-semibold text-[var(--espace-vert)] mb-4">Conversations</h2>
                <div v-for="conv in conversations" :key="conv.user_id" @click="selectConversation(conv.user_id)"
                    class="p-2 hover:bg-gray-100 cursor-pointer rounded flex items-center transition-colors">
                    <div class="w-10 h-10 bg-[var(--espace-or)] rounded-full mr-2 flex items-center justify-center">
                        <span class="text-white font-bold">{{ conv.name.charAt(0) }}</span>
                    </div>
                    <div>
                        <p class="font-semibold text-[var(--espace-vert)]">{{ conv.name }}</p>
                        <p class="text-xs text-[var(--espace-gris)] truncate">{{ conv.last_message }}</p>
                    </div>
                </div>
            </div>
        </transition>

        <h2 v-if="selectedConversation"
            class="text-xl top-24 bg-white w-full font-semibold text-[var(--espace-vert)] p-4 border-b fixed">
            {{ selectedConversation.name }}
        </h2>
        <!-- Zone des messages -->
        <div :class="[
                'bg-white shadow-md transition-all duration-300 flex pb-8 mt-20 flex-col flex-1 h-[80vh]',
                isSidebarOpen && !isMobile ? '' : 'rounded-r-lg'
            ]" @scroll="handleScroll">
            <div v-if="selectedConversation" class="h-full flex flex-col">
                <!-- Zone scrollable des messages -->
                <div ref="messagesContainer" @scroll="handleScroll"
                     class="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 messages-container">
                    <div v-for="message in messages" :key="message.id" class="p-3 rounded-lg" :class="{
                            'bg-blue-200 ml-auto max-w-[70%]': message.sender_id === authStore.user.id,
                            'bg-gray-200 max-w-[70%]': message.sender_id !== authStore.user.id
                        }">
                        <strong class="block text-[var(--espace-vert)]">{{ message.sender.nom }} :</strong>
                        <p class="text-gray-800">{{ message.content }}</p>
                        <p class="text-xs text-[var(--espace-gris)] text-right">
                            {{ new Date(message.created_at).toLocaleTimeString() }}
                        </p>
                    </div>
                    <div v-if="isLoading" class="text-center text-[var(--espace-gris)]">Chargement...</div>
                </div>

                <!-- Zone d’écriture -->
                <div class="fixed bottom-18 left-0 w-full px-4">
                    <div class="bg-white shadow-lg rounded-full flex items-center p-2 border max-w-3xl mx-auto">
                        <input v-model="newMessage" type="text" placeholder="Écrivez votre message..."
                            class="flex-1 px-4 py-2 rounded-full focus:outline-none text-gray-700 text-sm placeholder-gray-400" />
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
</template>

<style scoped>
:root {
    --espace-vert: #14532d;
    --espace-or: #facc15;
    --espace-blanc: #ffffff;
    --espace-gris: #6b7280;
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