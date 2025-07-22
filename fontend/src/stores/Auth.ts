import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import type { User } from "../types";
import apiClient from "../api/index.js";
import router from "../router";


export const useAuthStore = defineStore("auth", {
  state: () => {
    const rawUser = localStorage.getItem("user");
    // console.log(rawUser=='undefined');

    const user =
      rawUser && rawUser !== "undefined" ? JSON.parse(rawUser) : null;

    const token = localStorage.getItem("token") || null;
    // console.log(token);

    return {
      user,
      token,
    };
  },
  actions: {
    async login(credentials: { login: string; mot_de_passe: string }) {
      const response = await apiClient.post("/login", credentials);
      // console.log(response.data);

      this.user = response.data.user;
      this.token = response.data.token;
      // localStorage.setItem("user", JSON.stringify(this.user));
      localStorage.setItem("token", this.token);
    },

    async register(data: {
      nom: string;
      telephone: string;
      email?: string;
      ville: string;
      mot_de_passe: string;
      parrain_id?: string;
    }) {
      // console.log(data);

      const response = await apiClient.post("/register", {
        nom: data.nom,
        telephone: data.telephone,
        email: data.email || null,
        ville: data.ville,
        mot_de_passe: data.mot_de_passe,
        parrain_id: data.parrain_id || null,
      });
      // console.log(response.data);

      this.user = response.data.user;
      this.token = response.data.token;
      localStorage.setItem("user", JSON.stringify(this.user));
      localStorage.setItem("token", this.token);
    },
    async checkAuth() {
      if (!this.token) {
        this.logout();
        return false;
      }
      try {
        const response = await apiClient.get("/user");
        // console.log(response.data);

        this.user = response.data.user;
        localStorage.setItem("user", JSON.stringify(this.user));
        return true;
      } catch (error) {
        this.logout();
        return false;
      }
    },

    async updateJetons() {
      const response = await apiClient.get("/user");
      this.user = response.data;
    },

    logout() {
      apiClient.post("/logout").catch(() => {}); // Ignorer les erreurs réseau
      this.user = null;
      this.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
});