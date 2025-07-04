// src/store/index.js
import { defineStore } from "pinia";
import apiClient from "../api";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    isAuthenticated: false,
    token: localStorage.getItem("jwt_token") || null,
  }),
  actions: {
    async login(credentials) {
      try {
        console.log("Connexion avec:", credentials);
        const response = await apiClient.post("/login", credentials);
        console.log("Réponse de /login:", response.data);
        this.user = response.data.user;
        this.token = response.data.token;
        this.isAuthenticated = true;
        localStorage.setItem("jwt_token", this.token);
        console.log("Connexion réussie:", this.user);
        return response.data;
      } catch (error) {
        console.error("Erreur lors de la connexion:", {
          message: error.response?.data?.message,
          status: error.response?.status,
          details: error.response?.data,
        });
        this.user = null;
        this.isAuthenticated = false;
        this.token = null;
        localStorage.removeItem("jwt_token");
        throw (
          error.response?.data || { message: "Erreur lors de la connexion" }
        );
      }
    },
    async register(data) {
      try {
        console.log("Inscription avec:", data);
        const response = await apiClient.post("/register", data);
        console.log("Réponse de /register:", response.data);
        this.user = response.data.user;
        console.log(user);
        
        this.token = response.data.token;
        this.isAuthenticated = true;
        localStorage.setItem("jwt_token", this.token);
        console.log("Inscription réussie:", this.user);
        return response.data;
      } catch (error) {
        console.error("Erreur lors de l'inscription:", {
          message: error.response?.data?.message,
          status: error.response?.status,
          details: error.response?.data,
        });
        this.user = null;
        this.isAuthenticated = false;
        this.token = null;
        localStorage.removeItem("jwt_token");
        throw (
          error.response?.data || { message: "Erreur lors de l'inscription" }
        );
      }
    },
    async logout() {
      try {
        console.log("Déconnexion...");
        await apiClient.post("/logout");
        this.user = null;
        this.isAuthenticated = false;
        this.token = null;
        localStorage.removeItem("jwt_token");
        console.log("Déconnexion réussie");
      } catch (error) {
        console.error("Erreur lors de la déconnexion:", {
          message: error.response?.data?.message,
          status: error.response?.status,
          details: error.response?.data,
        });
      }
    },
    async checkAuth() {
      try {
        if (!this.token) {
          console.log("Aucun token trouvé, session non restaurée");
          this.user = null;
          this.isAuthenticated = false;
          return;
        }
        console.log("Vérification de la session avec /profile...");
        const response = await apiClient.get("/profile");
        this.user = response.data.user;
        this.isAuthenticated = true;
        console.log("Session restaurée:", this.user);
      } catch (error) {
        console.error("Erreur lors de la vérification de la session:", {
          message: error.response?.data?.message,
          status: error.response?.status,
          details: error.response?.data,
        });
        this.user = null;
        this.isAuthenticated = false;
        this.token = null;
        localStorage.removeItem("jwt_token");
      }
    },
  },
});
