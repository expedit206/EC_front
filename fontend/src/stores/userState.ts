// src/stores/userState.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import apiClient from "../api/index";
import { useToast } from "vue-toastification";

export const useUserStateStore = defineStore("userState", () => {
  const collaborationsPending = ref(0);
  const unreadMessages = ref(0);
  const toast = useToast();

  // Initialiser l'état (collaborations et messages)
  const initializeState = () => {
    const pendingCollaborations = JSON.parse(
      localStorage.getItem("pending_collaborations") || "[]"
    );
    collaborationsPending.value = pendingCollaborations.length;
    const storedMessages = localStorage.getItem("unread_messages");
    unreadMessages.value = storedMessages ? parseInt(storedMessages, 10) : 0;
  };

  // Sauvegarder les collaborations
  const saveCollaborationsToLocalStorage = (collaborations: any[]) => {
    localStorage.setItem(
      "pending_collaborations",
      JSON.stringify(collaborations)
    );
    collaborationsPending.value = collaborations.length;
  };

  // Sauvegarder les messages non lus
  const saveUnreadMessagesToLocalStorage = (count: number) => {
    
    localStorage.setItem("unread_messages", count.toString());
    unreadMessages.value = count;
  };

  // Ajouter une collaboration
  const addCollaboration = async (collaboration: {
    produit_id: string;
    prix_revente: number;
  }) => {
    const pendingCollaborations = JSON.parse(
      localStorage.getItem("pending_collaborations") || "[]"
    );
    pendingCollaborations.push({
      produit_id: collaboration.produit_id,
      prix_revente: collaboration.prix_revente,
      status: "pending",
      created_at: new Date().toISOString(),
    });
    saveCollaborationsToLocalStorage(pendingCollaborations);

    try {
      await apiClient.post("/collaborations", {
        produit_id: collaboration.produit_id,
        prix_revente: collaboration.prix_revente,
      });
      await syncCollaborationsWithBackend();
      toast.success("Demande de collaboration envoyée !");
      return true;
    } catch (error: any) {
      const updatedCollaborations = pendingCollaborations.filter(
        (item: any) =>
          !(
            item.produit_id === collaboration.produit_id &&
            item.prix_revente === collaboration.prix_revente
          )
      );
      saveCollaborationsToLocalStorage(updatedCollaborations);
      toast.error(
        error.response?.data.message ||
          "Erreur lors de la demande de collaboration"
      );
      return false;
    }
  };

  // Synchroniser les collaborations et messages avec le backend
  const syncCollaborationsWithBackend = async () => {
    try {
      const response = await apiClient.get("/user/badges");
      // Utiliser directement le compteur collaborations_pending
      collaborationsPending.value = response.data.collaborations_pending;
      console.log(response.data);

      // Mettre à jour les messages non lus
      saveUnreadMessagesToLocalStorage(response.data.unread_messages || 0);
      // Optionnel : Si vous voulez toujours sauvegarder les détails des collaborations, fetch une autre endpoint
      // Exemple : const collabDetails = await apiClient.get("/collaborations/pending");
      // saveCollaborationsToLocalStorage(collabDetails.data);
    } catch (error) {
      console.error("Erreur lors de la synchronisation des badges:", error);
    }
  };

  // Vider l'état
  const clearState = () => {
    localStorage.removeItem("pending_collaborations");
    localStorage.removeItem("unread_messages");
    collaborationsPending.value = 0;
    unreadMessages.value = 0;
  };

  return {
    collaborationsPending,
    unreadMessages,
    initializeState,
    addCollaboration,
    syncCollaborationsWithBackend,
    clearState,
    saveCollaborationsToLocalStorage,
    saveUnreadMessagesToLocalStorage,
  };
});
