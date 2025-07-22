import { defineStore } from "pinia";
import { ref } from "vue";
import apiClient from "../api";
import { useToast } from "vue-toastification";

export const useUserStateStore = defineStore("userState", () => {
  const collaborationsPending = ref(0);
  const toast = useToast();

  // Initialiser l'état (collaborations)
  const initializeState = () => {
    const pendingCollaborations = JSON.parse(
      localStorage.getItem("pending_collaborations") || "[]"
    );
    collaborationsPending.value = pendingCollaborations.length;
  };

  // Sauvegarder les collaborations
  const saveCollaborationsToLocalStorage = (collaborations: any[]) => {
    localStorage.setItem(
      "pending_collaborations",
      JSON.stringify(collaborations)
    );
    collaborationsPending.value = collaborations.length;
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

  // Synchroniser les collaborations
  const syncCollaborationsWithBackend = async () => {
    try {
      const response = await apiClient.get("/collaborations");
      const backendCollaborations = response.data.filter(
        (item: any) => item.status === "pending"
      );
      saveCollaborationsToLocalStorage(
        backendCollaborations.map((item: any) => ({
          produit_id: item.produit_id,
          prix_revente: item.prix_revente,
          status: item.status,
          created_at: item.created_at,
        }))
      );
    } catch (error) {
      console.error(
        "Erreur lors de la synchronisation des collaborations:",
        error
      );
    }
  };

  // Vider l'état
  const clearState = () => {
    localStorage.removeItem("pending_collaborations");
    collaborationsPending.value = 0;
  };

  return {
    collaborationsPending,
    initializeState,
    addCollaboration,
    syncCollaborationsWithBackend,
    clearState,
    saveCollaborationsToLocalStorage,
  };
});
