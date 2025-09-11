<template>
    <div class="overflow-y-scroll bg-gray-50 flex flex-col">
        <!-- Hero Section -->
        <section class="bg-gradient-to-r from-[var(--espace-vert)] to-green-700 text-white py-16 shadow-lg">
            <div class="max-w-4xl mx-auto text-center px-6">
                <h1 class="text-4xl sm:text-5xl font-bold mb-4">Politique de Confidentialité</h1>
                <p class="text-lg text-green-100 max-w-2xl mx-auto">
                    Découvrez comment <strong>Espace Cameroun</strong> protège vos données et respecte votre vie privée.
                </p>
                <p class="text-sm mt-4 italic text-green-200">
                    Dernière mise à jour : {{ updatedAt }}
                </p>
            </div>
        </section>

        <!-- Content Section -->
        <section class="max-w-5xl mx-auto px-6 sm:px-8 py-12 grid gap-6">
            <transition-group name="fade" tag="div" class="grid gap-6 md:grid-cols-2">
                <div v-for="section in sections" :key="section.id"
                    class="bg-white rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 p-6 flex flex-col">
                    <div class="flex items-center mb-4">
                        <div
                            class="flex items-center justify-center w-12 h-12 bg-[var(--espace-or)] text-[var(--espace-vert)] rounded-full shadow">
                            <i :class="section.icon" class="text-xl"></i>
                        </div>
                        <h2 class="ml-4 text-lg font-semibold text-gray-800">{{ section.title }}</h2>
                    </div>
                    <p v-if="section.text" class="text-gray-700 mb-2 leading-relaxed">{{ section.text }}</p>
                    <ul v-if="section.list" class="list-disc pl-6 space-y-1 text-gray-700">
                        <li v-for="item in section.list" :key="item">{{ item }}</li>
                    </ul>
                </div>
            </transition-group>
        </section>

        <!-- Formulaire de contact -->
        <section class="bg-white max-w-3xl mx-auto px-6 py-10 rounded-2xl shadow-lg mb-12">
            <h3 class="text-2xl font-semibold text-center text-[var(--espace-vert)] mb-4">
                💌 Une question sur vos données ?
            </h3>
            <p class="text-gray-600 text-center mb-6">
                Utilisez ce formulaire pour nous contacter directement. Nous vous répondrons dans les plus brefs délais.
            </p>

            <form @submit.prevent="handleFormSubmit" class="space-y-4">
                <div>
                    <label for="name" class="block text-sm font-medium text-[var(--espace-vert)]">Nom</label>
                    <input type="text" id="name" name="name" v-model="form.name" required
                        class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[var(--espace-vert)] focus:outline-none"
                        placeholder="Votre nom" />
                </div>
                <div>
                    <label for="email" class="block text-sm font-medium text-[var(--espace-vert)]">Email</label>
                    <input type="email" id="email" name="email" v-model="form.email" required
                        class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[var(--espace-vert)] focus:outline-none"
                        placeholder="votre@email.com" />
                </div>
                <div>
                    <label for="message" class="block text-sm font-medium text-[var(--espace-vert)]">Message</label>
                    <textarea id="message" name="message" v-model="form.message" required rows="4"
                        class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[var(--espace-vert)] focus:outline-none"
                        placeholder="Votre message..."></textarea>
                </div>
                <button type="submit" :disabled="loading"
                    class="w-full bg-[var(--espace-or)] text-[var(--espace-vert)] px-4 py-3 rounded-lg font-bold flex items-center justify-center transition hover:bg-yellow-400"
                    :class="{ 'opacity-50 cursor-not-allowed': loading }">
                    <span v-if="loading"
                        class="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                    <span>{{ loading ? 'Envoi...' : 'Envoyer' }}</span>
                </button>
            </form>
            <p v-if="submitted" class="mt-4 text-green-600 text-center">
                ✅ Merci ! Votre message a été envoyé avec succès.
            </p>
        </section>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const updatedAt = new Date().toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
});

const sections = ref([
    { id: 'intro', title: 'Introduction', icon: 'fas fa-user-shield', text: 'Chez Espace Cameroun, nous nous engageons à protéger vos informations personnelles et à respecter votre vie privée.' },
    { id: 'collecte', title: 'Données collectées', icon: 'fas fa-database', list: ['Nom, email, téléphone', 'Produits publiés', 'Messages échangés', 'Logs techniques', 'Historique de jetons'] },
    { id: 'utilisation', title: 'Utilisation des données', icon: 'fas fa-cogs', list: ['Gestion des comptes', 'Amélioration du service', 'Sécurité et anti-fraude'] },
    { id: 'partage', title: 'Partage', icon: 'fas fa-share-alt', text: 'Nous ne vendons jamais vos données. Elles ne sont partagées qu’avec nos prestataires ou si la loi l’exige.' },
    { id: 'securite', title: 'Sécurité', icon: 'fas fa-lock', list: ['HTTPS', 'Hachage des mots de passe', 'Surveillance des accès'] },
    { id: 'droits', title: 'Vos droits', icon: 'fas fa-user-check', list: ['Accès et rectification', 'Suppression du compte', 'Opposition et portabilité'] }
]);

const loading = ref(false);
const submitted = ref(false);
const form = ref({ name: '', email: '', message: '' });

const handleFormSubmit = async () => {
    loading.value = true;
    try {
        const response = await fetch('https://formspree.io/f/xanwpnlk', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form.value)
        });

        if (response.ok) {
            submitted.value = true;
            form.value = { name: '', email: '', message: '' };
            setTimeout(() => { submitted.value = false }, 5000);
        } else throw new Error('Échec de l’envoi');
    } catch (error) {
        console.error('Erreur envoi :', error);
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
:root {
    --espace-vert: #14532d;
    --espace-or: #facc15;
}

.fade-enter-active {
    transition: opacity 0.6s ease, transform 0.4s ease;
}

.fade-enter-from {
    opacity: 0;
    transform: translateY(10px);
}

.animate-spin {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>
