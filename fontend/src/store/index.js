// src/store/index.js
import { defineStore } from "pinia";
import axios from "axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: localStorage.getItem("token") || null,
  }),
  actions: {
    async login(credentials) {
      try {
        const response = await axios.post("/login", credentials);
        this.token = response.data.token;
        this.user = response.data.user;
        localStorage.setItem("token", this.token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
        return response.data;
      } catch (error) {
        throw (
          error.response?.data || { message: "Erreur lors de la connexion" }
        );
      }
    },
    async register(data) {
      try {
        const response = await axios.post("/register", data);
        this.token = response.data.token;
        this.user = response.data.user;
        localStorage.setItem("token", this.token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
        return response.data;
      } catch (error) {
        throw (
          error.response?.data || { message: "Erreur lors de l'inscription" }
        );
      }
    },
    // logout() {
    //   this.user = null;
    //   this.token = null;
    //   localStorage.removeItem("token");
    //   delete axios.defaults.headers.common["Authorization"];
    // },
    async fetchUser() {
      try {
        if (!this.token) {
          console.warn("Aucun token disponible pour fetchUser");
          return;
        }
        const response = await axios.get("/user");
        this.user = response.data.user;
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        if (error.response?.status === 401) {
          // this.logout(); // Déconnexion uniquement si token invalide (401 Unauthorized)
        }
      }
    },
  },
});
