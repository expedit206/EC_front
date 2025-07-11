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
        if (!response.data.user || !response.data.token) {
          throw new Error(
            "Réponse invalide du serveur: user ou token manquant"
          );
        }
        this.user = response.data.user;
        this.token = response.data.token;
        this.isAuthenticated = true;
        localStorage.setItem("jwt_token", this.token);
        console.log(
          "Token stocké dans localStorage:",
          localStorage.getItem("jwt_token")
        );
        console.log("Connexion réussie:", {
          user: this.user,
          token: this.token,
        });
        return response.data;
      } catch (error) {
        console.error("Erreur lors de la connexion:", {
          message: error.response?.data?.message || error.message,
          status: error.response?.status,
          details: error.response?.data,
        });
        this.resetAuthState();
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
        if (!response.data.user || !response.data.token) {
          throw new Error(
            "Réponse invalide du serveur: user ou token manquant"
          );
        }
        this.user = response.data.user;
        this.token = response.data.token;
        this.isAuthenticated = true;
        localStorage.setItem("jwt_token", this.token);
        console.log(
          "Token stocké dans localStorage:",
          localStorage.getItem("jwt_token")
        );
        console.log("Inscription réussie:", {
          user: this.user,
          token: this.token,
        });
        return response.data;
      } catch (error) {
        console.error("Erreur lors de l'inscription:", {
          message: error.response?.data?.message || error.message,
          status: error.response?.status,
          details: error.response?.data,
        });
        this.resetAuthState();
        throw (
          error.response?.data || { message: "Erreur lors de l'inscription" }
        );
      }
    },
    async logout() {
      try {
        console.log("Déconnexion...");
        const response = await apiClient.post("/logout");
        console.log("Réponse de /logout:", response.data);
        this.resetAuthState();
        console.log("Déconnexion réussie");
      } catch (error) {
        console.error("Erreur lors de la déconnexion:", {
          message: error.response?.data?.message || error.message,
          status: error.response?.status,
          details: error.response?.data,
        });
        this.resetAuthState();
        throw (
          error.response?.data || { message: "Erreur lors de la déconnexion" }
        );
      }
    },
    async fetchUser() {
      try {
        console.log("État du token avant fetchUser:", {
          token: this.token,
          localStorageToken: localStorage.getItem("jwt_token"),
        });
        if (!this.token || this.token === "undefined" || this.token === "") {
          throw new Error("Aucun token valide pour récupérer l'utilisateur");
        }
        console.log(
          "Récupération des données utilisateur avec /user, token:",
          this.token
        );

        // Ajout explicite du header Authorization
        const response = await apiClient.get("/user", {
          headers: {
            // Authorization: `Bearer ${this.token}`,
          },
        });

        console.log("Réponse de /user :", response.data);
        if (!response.data.user) {
          throw new Error("Réponse invalide du serveur: user manquant");
        }
        this.user = response.data.user;
        this.isAuthenticated = true;
        console.log("Utilisateur récupéré:", this.user);
        return this.user;
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur:", {
          message: error.response?.data?.message || error.message,
          status: error.response?.status,
          details: error.response?.data,
          token: this.token,
        });
        if (error.response?.status === 401) {
          console.log("Erreur 401: Token invalide ou non autorisé");
        }
        // this.resetAuthState();
        throw (
          error.response?.data || {
            message: "Erreur lors de la récupération de l'utilisateur",
          }
        );
      }
    },

    async checkAuth() {
      try {
        console.log("État du token avant checkAuth:", {
          token: this.token,
          localStorageToken: localStorage.getItem("jwt_token"),
        });
        if (!this.token || this.token === "undefined" || this.token === "") {
          console.log("Aucun token valide trouvé, session non restaurée");
          // this.resetAuthState();
          return false;
        }
        console.log(
          "Vérification de la session avec fetchUser, token:",
          this.token
        );
        await this.fetchUser();
        console.log("Session restaurée:", this.user);
        return true;
      } catch (error) {
        console.error("Erreur lors de la vérification de la session:", {
          message: error.response?.data?.message || error.message,
          status: error.response?.status,
          details: error.response?.data,
          token: this.token,
        });
        if (error.response?.status === 401) {
          console.log(
            "Erreur 401: Token invalide ou non autorisé, nettoyage de la session"
          );
        } else if (error.response?.status === 500) {
          console.log(
            "Erreur 500: Problème serveur, vérifiez UserController::profile"
          );
        } else if (error.message.includes("Network Error")) {
          console.log(
            "Erreur réseau: Vérifiez que le backend est en cours d'exécution sur http://localhost:8000"
          );
        }
        // this.resetAuthState();
        return false;
      }
    },

    resetAuthState() {
      this.user = null;
      this.isAuthenticated = false;
      this.token = null;
      localStorage.removeItem("jwt_token");
      console.log("État d'authentification réinitialisé");
    },
  },
});
