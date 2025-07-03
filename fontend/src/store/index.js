import { defineStore } from "pinia";
import apiClient from "../api";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    isAuthenticated: false,
  }),
  actions: {
    async login(credentials) {
      try {
        await apiClient.get("/sanctum/csrf-cookie");
        await apiClient.post("/login", credentials); // Supprimer api/v1 car baseURL est défini
        const response = await apiClient.get("/profile");
        this.user = response.data.user;
        this.isAuthenticated = true;
        console.log("Connexion réussie:", this.user);
        return response.data;
      } catch (error) {
        console.error(
          "Erreur lors de la connexion:",
          error.response?.data,
          error.response?.status
        );
        this.user = null;
        this.isAuthenticated = false;
        throw (
          error.response?.data || { message: "Erreur lors de la connexion" }
        );
      }
    },
    async register(data) {
      try {
        await apiClient.get("/sanctum/csrf-cookie");
        await apiClient.post("api/v1/register", data);
        
        // const response = await apiClient.get("api/v1/user");
        console.log('fghj');
        // this.user = response.data.user;
        this.isAuthenticated = true;
        // console.log("Inscription réussie:", this.user);
        // return response.data;
      } catch (error) {
        console.error(
          "Erreur lors de l'inscription:",
          error.response?.data,
          error.response?.status
        );
        this.user = null;
        this.isAuthenticated = false;
        throw (
          error.response?.data || { message: "Erreur lors de l'inscription" }
        );
      }
    },
    async logout() {
      try {
        await apiClient.get("/sanctum/csrf-cookie");
        await apiClient.post("/logout");
        this.user = null;
        this.isAuthenticated = false;
        console.log("Déconnexion réussie");
      } catch (error) {
        console.error(
          "Erreur lors de la déconnexion:",
          error.response?.data,
          error.response?.status
        );
      }
    },
    async checkAuth() {
      
      try {
        const response = await apiClient.get("api/v1/user");
        this.user = response.data.user;
        this.isAuthenticated = true;
        console.log("Session restaurée:", this.user);
      } catch (error) {
        console.error(
          "Erreur lors de la vérification de la session:",
          error.response?.data,
          error.response?.status
        );
        this.user = null;
        this.isAuthenticated = false;
      }
    },
  },
});
