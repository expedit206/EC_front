<!-- src/components/ChatComponent.vue -->
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useAuthStore } from '../stores/Auth';
import apiClient from '../api/index';
import Echo from 'laravel-echo';
// import { Echo } from 'laravel-echo';
// Echo
// import Reverb from '@laravel/reverb-client';
import { Message } from "../components/types/index"; // Import de l'interface Parrainage


const messages = ref<Message[]>([]);

const authStore = useAuthStore();
const newMessage = ref('');
const receiverId = ref(0);
const productId = ref(0);

const echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT,
    wssPort: import.meta.env.VITE_REVERB_PORT,
    forceTLS: false,
    enabledTransports: ['ws', 'wss'],
    authEndpoint: '/broadcasting/auth',
    auth: {
        headers: {
            Authorization: `Bearer ${authStore.user?.token}`,
        },
    },
});

onMounted(() => {
    if (authStore.user && receiverId.value && productId.value) {
        fetchMessages();
        echo.private(`chat.${productId.value}.${receiverId.value}`)
            .listen('.message', (e: any) => {
                messages.value.push(e.message);
            });
    }
});

const fetchMessages = async () => {
    if (authStore.user && receiverId.value && productId.value) {
        const response = await apiClient.get(`/chat/${productId.value}/${receiverId.value}`);
        messages.value = response.data.messages;
        //console.log(response.data)
    }
};

const sendMessage = async () => {
    if (authStore.user && newMessage.value && receiverId.value && productId.value) {
        await apiClient.post(`/chat/${productId.value}/${receiverId.value}`, {
            content: newMessage.value,
        });
        newMessage.value = '';
    }
};

watch([receiverId, productId], () => {
    if (authStore.user) {
        fetchMessages();
    }
});
</script>

<template>
    <div class="chat-container p-4 bg-white rounded-lg shadow-md">
        <h3 class="text-lg font-semibold text-[var(--espace-vert)] mb-4">Chat à propos du produit</h3>
        <div class="messages h-64 overflow-y-auto border p-2 mb-4">
            <div v-for="message in messages" :key="message.id" class="mb-2">
                <strong>{{ message.sender_id === authStore.user?.id ? 'Vous' : 'Destinataire' }} :</strong>
                <span class="ml-2">{{ message.content }}</span>
                <small class="text-gray-500 ml-2">{{ new Date(message.created_at).toLocaleTimeString() }}</small>
            </div>
        </div>
        <div class="flex">
            <input v-model="newMessage" @keyup.enter="sendMessage" type="text" placeholder="Tapez votre message..."
                class="flex-1 p-2 border rounded-l" />
            <button @click="sendMessage"
                class="bg-[var(--espace-vert)] text-white px-4 py-2 rounded-r hover:bg-[var(--espace-or)] hover:text-[var(--espace-vert)] transition">
                Envoyer
            </button>
        </div>
    </div>
</template>

<style scoped>
.chat-container {
    max-width: 500px;
    margin: 0 auto;
}

.messages {
    background-color: #f9fafb;
}
</style>