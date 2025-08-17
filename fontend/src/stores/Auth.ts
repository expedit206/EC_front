// src/stores/Auth.ts
import { defineStore } from "pinia";
import { getActivePinia } from "pinia";
import { useProductStore } from "./product";
import { User } from "../components/types/index"; // Import de l'interface Parrainage
import apiClient from "../api/index";

// Utility to access product store safely
export const productstore = () => {
  if (!getActivePinia()) {
    throw new Error("Pinia n’est pas encore actif");
  }
  return useProductStore();
};

export const useAuthStore = defineStore("auth", {
  state: () => {
    const rawUser = localStorage.getItem("user");
    const user: User =
      rawUser && rawUser !== "undefined" ? JSON.parse(rawUser) : null;
    const token = localStorage.getItem("token") || null;

    return {
      user,
      token: token as string | null,
    };
  },

  actions: {
    async login(credentials: { login: string; mot_de_passe: string }) {
      const response = await apiClient.post("/login", credentials);
      this.user = response.data.user;
      this.token = response.data.token;
      if (this.token) {
        localStorage.setItem("token", this.token);
      }
      if (this.user) {
        localStorage.setItem("user", JSON.stringify(this.user));
      }
    },

    async register(data: {
      nom: string;
      telephone: string;
      email?: string;
      ville: string;
      mot_de_passe: string;
      parrain_id?: string;
    }) {
      const response = await apiClient.post("/register", {
        nom: data.nom,
        telephone: data.telephone,
        email: data.email || null,
        ville: data.ville,
        mot_de_passe: data.mot_de_passe,
        parrain_id: data.parrain_id || null,
      });
      this.user = response.data.user;
      this.token = response.data.token;
      if (this.token) {
        localStorage.setItem("token", this.token);
      }
      if (this.user) {
        localStorage.setItem("user", JSON.stringify(this.user));
      }
    },

    async checkAuth() {
      if (!this.token) {
        this.logout();
        return false;
      }
      try {
        const response = await apiClient.get("/user");
        this.user = response.data.user;
        if (this.user) {
          localStorage.setItem("user", JSON.stringify(this.user));
          productstore().setUserId(this.user.id);
        }
        return true;
      } catch (error) {
        this.logout();
        return false;
      }
    },

    async updateJetons() {
      const response = await apiClient.get("/user");
      this.user = response.data.user; // Ensure response matches User type
    },

    logout() {
      apiClient.post("/logout").catch(() => {});
      this.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
});
