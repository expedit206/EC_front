import { defineStore } from "pinia";
import apiClient from "../api/index";
import { User } from "../components/types/index";
import axios, { Axios } from "axios";
import { useRouter } from "vue-router";
const router = useRouter();


export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as User | null,
    token: localStorage.getItem("token") || null,
  }),

  actions: {
    // Connexion

    async login(credentials: { login: string; mot_de_passe: string }) {
   

      const response = await apiClient.post("/login", credentials);

      this.user = response.data.user;
      this.token = response.data.token;

      localStorage.setItem("token", this.token ?? "");

      // Ajout du header Authorization pour toutes les requêtes futures
      apiClient.defaults.headers.common["Authorization"] =
        `Bearer ${this.token}`;
    },

    

    async register(data: {
      nom: string;
      telephone: string;
      email?: string | null;
      ville?: string | null;
      mot_de_passe: string;
      parrain_code?: string; // Changé de parrain_id à parrain_code
    }) {
      const response = await apiClient.post("/register", data);

      this.user = response.data.user;
      this.token = response.data.token;

      localStorage.setItem("token", this.token ?? "");
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
    },
    // Autres actions...
    // Vérifier l'authentification (profil)
    async checkAuth() {
      if (!this.token) return false;

      try {
      apiClient.defaults.headers.common["Authorization"] =
        `Bearer ${this.token}`;


        const response = await apiClient.get("/user");

        this.user = response.data.user;
        return true;
      } catch (error) {
        console.error(
          "utilisateur non:",
          error
        );
        router.push("/login");

        this.user = null;
        this.token = null;
        localStorage.removeItem("token");
        return false;
      }
    },
    
//     async logout() {
//         try {
//         router.push('/login')
//         if (this.token) {
//           await apiClient.post("/logout");
//         }
//       } catch {
//         // ignorer si token invalide ou expiré
//       }

//   try {
//     // Appel à ton API pour déconnecter côté serveur
//     router.push("/login");
//     await apiClient.post('/logout');

//     // 🔥 Supprimer les variables du localStorage
//     const keysToRemove = [
//       "pending_collaborations",
//       "pending_orders",
//       "cart",
//       "token",
//       "unread_messages",
//       "viewedProducts"
//     ];

//     keysToRemove.forEach(key => localStorage.removeItem(key));

//     // Optionnel : si tu veux tout nettoyer d'un coup
//     // localStorage.clear();

//     // Rediriger vers la page de login
    
//       this.user = null;
//       this.token = null;
//       localStorage.removeItem("token");
//       delete apiClient.defaults.headers.common["Authorization"];

//   } catch (error) {
//     console.error("Erreur lors de la déconnexion :", error);
//   }
// },

    // Déconnexion
    async logout() {
      try {
        router.push("/login");
        if (this.token) {
          await apiClient.post("/logout");
        }
      } catch {
        // ignorer si token invalide ou expiré
      }

      this.user = null;
      this.token = null;
      localStorage.removeItem("token");
      delete apiClient.defaults.headers.common["Authorization"];
      // 🔥 Supprimer les variables du localStorage
          const keysToRemove = [
            "pending_collaborations",
            "pending_orders",
            "cart",
            "token",
            "unread_messages",
            "viewedProducts"
          ];

          keysToRemove.forEach(key => localStorage.removeItem(key));

    },
  },
});
