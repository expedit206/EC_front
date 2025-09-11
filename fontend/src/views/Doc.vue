<!-- src/views/Documentation.vue -->
<template>
    <div class="overflow-y-scroll h-full bg-gradient-to-b from-gray-50 to-gray-100 p-4">
        <!-- En-tête de la page -->
        <div class="text-center mb-8">
            <h1 class="text-3xl font-bold text-[var(--espace-vert)]">📘 Documentation - Espace Cameroun</h1>
            <p class="text-gray-600 mt-2">Votre espace pour faciliter le commerce au Cameroun</p>
        </div>

        <!-- Introduction et Objectifs -->
        <section class="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 class="text-xl font-semibold text-[var(--espace-vert)] mb-4">À Propos d’Espace Cameroun</h2>
            <p class="text-gray-700">
                Espace Cameroun est une plateforme de marketplace conçue pour connecter commerçants, acheteurs et
                revendeurs.
                Son objectif principal est de créer un espace numérique où les transactions commerciales peuvent se
                dérouler
                facilement et en toute sécurité. Notre mission est de faciliter l’activité commerciale au Cameroun en
                offrant
                des outils simples et accessibles à tous.
            </p>
        </section>

        <!-- Fonctionnalités Principales -->
        <section class="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 class="text-xl font-semibold text-[var(--espace-vert)] mb-4">Fonctionnalités Clés</h2>
            <div class="space-y-4">
                <div>
                    <h3 class="text-lg font-medium text-[var(--espace-vert)]">Messagerie</h3>
                    <p class="text-gray-700">
                        Communiquez directement avec vos partenaires commerciaux pour négocier ou confirmer des
                        transactions via la
                        section <router-link to="/messages" class="text-blue-500 underline">Chat</router-link>.
                    </p>
                </div>
                <div>
                    <h3 class="text-lg font-medium text-[var(--espace-vert)]">Gestion des Portefeuilles</h3>
                    <p class="text-gray-700">
                        Créez et gérez vos portefeuilles Orange Money ou MTN pour recevoir ou envoyer des paiements en
                        toute
                        sécurité.
                    </p>
                </div>
                <div>
                    <h3 class="text-lg font-medium text-[var(--espace-vert)]">Achat et Vente de Jetons</h3>
                    <p class="text-gray-700">
                        Participez au marché des jetons via <router-link to="/jetonMarket"
                            class="text-blue-500 underline">Marché des Jetons</router-link>
                        pour vendre vos jetons ou en acheter, générant des revenus ou des ressources pour booster vos
                        annonces.
                    </p>
                </div>
                <div>
                    <h3 class="text-lg font-medium text-[var(--espace-vert)]">Poster des Produits ou Services</h3>
                    <p class="text-gray-700">
                        Devenez commerçant en créant un compte via <router-link to="/profil"
                            class="text-blue-500 underline">Profil</router-link>,
                        puis publiez vos produits (ex. téléphones, vêtements) ou services (ex. réparations, cours) en
                        remplissant les
                        détails (nom, prix, description, photos), sélectionnant un portefeuille, et soumettant votre
                        annonce.
                    </p>
                </div>
                <div>
                    <h3 class="text-lg font-medium text-[var(--espace-vert)]">Boostage des Produits et Services</h3>
                    <p class="text-gray-700">
                        Utilisez vos jetons gagnés pour booster vos produits ou services, augmentant leur visibilité
                        auprès des
                        acheteurs et revendeurs sur la plateforme.
                    </p>
                </div>
                <div>
                    <h3 class="text-lg font-medium text-[var(--espace-vert)]">Collaborations</h3>
                    <p class="text-gray-700">
                        Travaillez avec d’autres commerçants pour proposer des produits ou services en collaboration via
                        <router-link to="/collaborations" class="text-blue-500 underline">Collaborations</router-link>.
                    </p>
                </div>
                <div>
                    <h3 class="text-lg font-medium text-[var(--espace-vert)]">Système de Parrainage</h3>
                    <p class="text-gray-700">
                        Invitez d’autres utilisateurs à créer un compte commerçant via <router-link to="/parrainage"
                            class="text-blue-500 underline">Équipe</router-link>
                        et gagnez 1 jeton par parrainage. Atteignez des paliers (ex. 10 commerçants parrainés pour 10
                        jetons bonus)
                        et utilisez ces jetons pour booster vos annonces ou les échanger sur le marché des jetons.
                    </p>
                </div>
                <div>
                    <h3 class="text-lg font-medium text-[var(--espace-vert)]">Abonnement Premium</h3>
                    <p class="text-gray-700">
                        Souscrivez à un abonnement premium pour accéder à des privilèges exclusifs, comme une visibilité
                        accrue,
                        des fonctionnalités avancées, et des avantages spéciaux (détails à venir).
                    </p>
                </div>
                <div>
                    <h3 class="text-lg font-medium text-[var(--espace-vert)]">Et Bien Plus</h3>
                    <p class="text-gray-700">
                        Découvrez d’autres fonctionnalités au fil de votre utilisation pour optimiser votre expérience
                        commerciale.
                    </p>
                </div>
            </div>
        </section>

        <!-- Ressources et Support -->
        <section class="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 class="text-xl font-semibold text-[var(--espace-vert)] mb-4">Ressources et Support</h2>
            <p class="text-gray-700 mb-4">
                Pour toute question ou assistance, utilisez le formulaire ci-dessous pour nous contacter. Vous pouvez
                aussi
                rester à l’écoute pour les mises à jour et les nouvelles fonctionnalités à venir.
            </p>
            <form @submit.prevent="handleFormSubmit" class="space-y-4">
                <div>
                    <label for="name" class="block text-sm font-medium text-[var(--espace-vert)]">Nom</label>
                    <input type="text" id="name" name="name" v-model="form.name" required
                        class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[var(--espace-vert)] focus:outline-none"
                        placeholder="Votre nom" />
                </div>
                <div>
                    <label for="email" class="block text-sm font-medium text-[var(--espace-vert)]">Email</label>
                    <input type="email" id="email" name="email" v-model="form.email" required
                        class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[var(--espace-vert)] focus:outline-none"
                        placeholder="votre@email.com" />
                </div>
                <div>
                    <label for="message" class="block text-sm font-medium text-[var(--espace-vert)]">Message</label>
                    <textarea id="message" name="message" v-model="form.message" required rows="4"
                        class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[var(--espace-vert)] focus:outline-none"
                        placeholder="Votre message"></textarea>
                </div>
                <button type="submit" :disabled="loading"
                    class="w-full bg-[var(--espace-or)] text-[var(--espace-vert)] px-4 py-2 rounded-lg font-bold flex items-center justify-center transition"
                    :class="{ 'opacity-50 cursor-not-allowed': loading }">
                    <span v-if="loading"
                        class="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                    <span>{{ loading ? 'Envoi...' : 'Envoyer' }}</span>
                </button>
            </form>
            <p v-if="submitted" class="mt-4 text-green-600 text-center">Merci ! Votre message a été envoyé avec succès.
            </p>
        </section>

        <!-- Prochaines Étapes -->
        <section class="bg-white p-6 rounded-lg shadow-md">
            <h2 class="text-xl font-semibold text-[var(--espace-vert)] mb-4">Prochaines Étapes</h2>
            <p class="text-gray-700">
                Nous travaillons continuellement pour améliorer Espace Cameroun. Restez connectés pour découvrir de
                nouvelles
                fonctionnalités et opportunités commerciales dans un avenir proche.
            </p>
        </section>

    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const router = useRouter();
const loading = ref(false); // État de chargement
const submitted = ref(false); // État de soumission réussie
const form = ref({
    name: '',
    email: '',
    message: '',
});

const handleFormSubmit = async () => {
    loading.value = true; // Activer le chargement

    try {
        const response = await fetch('https://formspree.io/f/xanwpnlk', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(form.value),
        });

        if (response.ok) {
            submitted.value = true; // Afficher le message de succès
            form.value = { name: '', email: '', message: '' }; // Réinitialiser le formulaire
            setTimeout(() => {
                submitted.value = false; // Masquer le message après 5 secondes
            }, 5000);
        } else {
            throw new Error('Échec de l’envoi');
        }
    } catch (error) {
        console.error('Erreur lors de la soumission:', error);
        // Gérer l'erreur (ex. afficher un message d'erreur à l'utilisateur si nécessaire)
    } finally {
        loading.value = false; // Désactiver le chargement
    }
};
</script>

<style scoped>
:root {
    --espace-vert: #14532d;
    --espace-or: #facc15;
}

section {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

section:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.animate-spin {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}
</style>