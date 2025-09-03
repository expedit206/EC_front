import { defineStore } from "pinia";
import apiClient from "../api/index";
import { User } from "../components/types/index";
import axios, { Axios } from "axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as User | null,
    token: localStorage.getItem("token") || null,
  }),

  actions: {
    // Connexion

    async login(credentials: { login: string; mot_de_passe: string }) {
      // await axios.get("http://localhost:8000/sanctum/csrf-cookie", {
      // await axios.get("https://espacecameroun.devfack.com/sanctum/csrf-cookie", {
      //   withCredentials: true,
      // });

      const response = await apiClient.post("/login", credentials);

      this.user = response.data.user;
      this.token = response.data.token;

      localStorage.setItem("token", this.token ?? "");

      // Ajout du header Authorization pour toutes les requêtes futures
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
      const response = await apiClient.post("/register", data);

      this.user = response.data.user;
      this.token = response.data.token;

      localStorage.setItem("token", this.token ?? "");
      apiClient.defaults.headers.common["Authorization"] =
        `Bearer ${this.token}`;
    },

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
          await apiClient.post("/logout");
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
