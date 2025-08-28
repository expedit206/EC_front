import { defineStore } from "pinia";
import apiClient from "../api/index";
import { User } from "../components/types/index";
import axios from "axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as User | null,
    token: localStorage.getItem("token") || null,
  }),

  actions: {
    // 🔑 Récupérer le cookie CSRF
    async getCsrfCookie() {
      // Laravel Sanctum doit poser le cookie "XSRF-TOKEN"
      await axios.get("http://localhost:8000/sanctum/csrf-cookie", {
        withCredentials: true, // très important
      });
    },

    // Connexion
    async login(credentials: { login: string; mot_de_passe: string }) {
      // ✅ attendre la récupération du CSRF
      await this.getCsrfCookie();

      const response = await apiClient.post("/login", credentials, {
        withCredentials: true, // nécessaire pour que Laravel voie le cookie
      });

      this.user = response.data.user;
      this.token = response.data.token;

localStorage.setItem("token", this.token ?? "");

      // Configurer apiClient pour les requêtes futures
      apiClient.defaults.headers.common["Authorization"] =
        `Bearer ${this.token}`;
    },

    // Inscription
    async register(data: {
      nom: string;
      telephone: string;
      email?: string;
      ville: string;
      mot_de_passe: string;
      parrain_id?: string;
    }) {
      await this.getCsrfCookie();

      const response = await apiClient.post("/register", data, {
        withCredentials: true,
      });

      this.user = response.data.user;
      this.token = response.data.token ;

localStorage.setItem("token", this.token ?? "");
      apiClient.defaults.headers.common["Authorization"] =
        `Bearer ${this.token}`;
    },

    // Vérifier l'authentification
    async checkAuth() {
      if (!this.token) return false;

      try {
        apiClient.defaults.headers.common["Authorization"] =
          `Bearer ${this.token}`;
        const response = await apiClient.get("/user", {
          withCredentials: true,
        });

        this.user = response.data.user;
        return true;
      } catch (error: any) {
        this.user = null;
        this.token = null;
        localStorage.removeItem("token");
        return false;
      }
    },

    // Déconnexion
    async logout() {
      try {
        if (this.token) {
          apiClient.defaults.headers.common["Authorization"] =
            `Bearer ${this.token}`;
          await apiClient.post("/logout", {}, { withCredentials: true });
        }
      } catch {
        // ignorer si token invalide ou expiré
      }

      this.user = null;
      this.token = null;
      localStorage.removeItem("token");
      delete apiClient.defaults.headers.common["Authorization"];
    },
  },
});
