// src/stores/userState.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import apiClient from "../api";
import { useToast } from "vue-toastification";

export const useUserStateStore = defineStore("userState", () => {
  const cartCount = ref(0);
  const collaborationsPending = ref(0);
  const ordersPending = ref(0); // Nouveau compteur pour les commandes en attente
  const toast = useToast();

  // Initialiser l'état (panier, collaborations, commandes)
  const initializeState = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cartCount.value = cart.reduce(
      (sum: number, item: any) => sum + (item.quantite || 1),
      0
    );

    const pendingCollaborations = JSON.parse(
      localStorage.getItem("pending_collaborations") || "[]"
    );
    collaborationsPending.value = pendingCollaborations.length;

    const pendingOrders = JSON.parse(
      localStorage.getItem("pending_orders") || "[]"
    );
    ordersPending.value = pendingOrders.length;
  };

  // Sauvegarder le panier
  const saveCartToLocalStorage = (cart: any[]) => {
    localStorage.setItem("cart", JSON.stringify(cart));
    cartCount.value = cart.reduce(
      (sum: number, item: any) => sum + (item.quantite || 1),
      0
    );
  };

  // Sauvegarder les collaborations
  const saveCollaborationsToLocalStorage = (collaborations: any[]) => {
    localStorage.setItem(
      "pending_collaborations",
      JSON.stringify(collaborations)
    );
    collaborationsPending.value = collaborations.length;
  };

  // Sauvegarder les commandes en attente
  const saveOrdersToLocalStorage = (orders: any[]) => {
    localStorage.setItem("pending_orders", JSON.stringify(orders));
    ordersPending.value = orders.length;
  };

  // Ajouter au panier
  const addToCart = async (produit: {
    id: string;
    nom: string;
    prix: number;
  }) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = cart.find(
      (item: any) => item.produit_id === produit.id
    );
    if (existingItem) {
      existingItem.quantite = (existingItem.quantite || 1) + 1;
    } else {
      cart.push({
        produit_id: produit.id,
        quantite: 1,
        nom: produit.nom,
        prix: produit.prix,
      });
    }
    saveCartToLocalStorage(cart);

    try {
      await apiClient.post("/panier", { produit_id: produit.id });
      await syncCartWithBackend();
      return true;
    } catch (error) {
      const updatedCart = cart.filter(
        (item: any) => !(item.produit_id === produit.id && item.quantite === 1)
      );
      if (existingItem) {
        existingItem.quantite -= 1;
        if (existingItem.quantite > 0) updatedCart.push(existingItem);
      }
      saveCartToLocalStorage(updatedCart);
      toast.error("Erreur lors de l’ajout au panier");
      return false;
    }
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

  // Passer une commande
  const placeOrder = async () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (cart.length === 0) {
      toast.error("Votre panier est vide");
      return false;
    }
    
    const pendingOrders = JSON.parse(
      localStorage.getItem("pending_orders") || "[]"
    );
    const newOrder = {
      id: `temp-${Date.now()}`,
      items: cart,
      status: "pending",
      created_at: new Date().toISOString(),
      total: cart.reduce(
        (sum: number, item: any) => sum + item.prix * item.quantite,
        0
      ),
    };
    pendingOrders.push(newOrder);
    saveOrdersToLocalStorage(pendingOrders);
    
    try {
      console.log(cart);
      
      const response = await apiClient.post("/commandes", { items: cart });
      console.log(response.data);

      saveCartToLocalStorage([]); // Vider le panier
      await syncOrdersWithBackend();
      toast.success("Commande passée avec succès !");
      return true;
    } catch (error) {
      const updatedOrders = pendingOrders.filter(
        (order: any) => order.id !== newOrder.id
      );
      saveOrdersToLocalStorage(updatedOrders);
      saveCartToLocalStorage(cart); // Restaurer le panier
      toast.error("Erreur lors de la commande");
      return false;
    }
  };

  // Synchroniser le panier
  const syncCartWithBackend = async () => {
    try {
      const response = await apiClient.get("/panier");
      const backendCart = response.data.items;
      saveCartToLocalStorage(
        backendCart.map((item: any) => ({
          produit_id: item.produit_id,
          quantite: item.quantite,
          nom: item.produit.nom,
          prix: item.produit.prix,
        }))
      );
    } catch (error) {
      console.error("Erreur lors de la synchronisation du panier:", error);
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

  // Synchroniser les commandes
  const syncOrdersWithBackend = async () => {
    try {
      const response = await apiClient.get("/commandes");
      
      const backendOrders = response.data.filter(
        (order: any) => order.status === "pending"
      );
      saveOrdersToLocalStorage(
        backendOrders.map((order: any) => ({
          id: order.id,
          items: order.items.map((item: any) => ({
            produit_id: item.produit_id,
            quantite: item.quantite,
            nom: item.produit.nom,
            prix: item.produit.prix,
          })),
          status: order.status,
          created_at: order.created_at,
          total: order.total,
        }))
      );
    } catch (error) {
      console.error("Erreur lors de la synchronisation des commandes:", error);
    }
  };

  // Vider l'état
  const clearState = () => {
    localStorage.removeItem("cart");
    localStorage.removeItem("pending_collaborations");
    localStorage.removeItem("pending_orders");
    cartCount.value = 0;
    collaborationsPending.value = 0;
    ordersPending.value = 0;
  };

  return {
    cartCount,
    collaborationsPending,
    ordersPending,
    initializeState,
    addToCart,
    addCollaboration,
    placeOrder,
    syncCartWithBackend,
    syncCollaborationsWithBackend,
    syncOrdersWithBackend,
    clearState,
    saveCartToLocalStorage,
    saveCollaborationsToLocalStorage,
    saveOrdersToLocalStorage, 
  };
});
