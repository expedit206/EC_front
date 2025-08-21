import { defineStore } from "pinia";
import { getActivePinia } from "pinia";
import { useProductStore } from "./product";
import { User } from "../components/types/index";
import apiClient from "../api/index";

export const productstore = () => {
  if (!getActivePinia()) {
    throw new Error("Pinia n’est pas encore actif");
  }
  return useProductStore();
};

export const useAuthStore = defineStore("auth", {
  state: () => {
    const rawUser = localStorage.getItem("user");
    const rawToken = localStorage.getItem("token");

    const user: User =
      rawUser && rawUser !== "undefined" ? JSON.parse(rawUser) : null;

    return {
      user,
      token: rawToken || null,
    };
  },

  actions: {
    async login(credentials: { login: string; mot_de_passe: string }) {
      try {
        const response = await apiClient.post("/login", credentials);

        this.user = response.data.user;
        this.token = response.data.token; // ⚡ ton API doit renvoyer {user, token}

        if (this.user && this.token) {
          localStorage.setItem("user", JSON.stringify(this.user));
          localStorage.setItem("token", this.token);

          // Ajoute le token par défaut dans axios
          apiClient.defaults.headers.common["Authorization"] =
            `Bearer ${this.token}`;
        }
      } catch (error: any) {
        throw new Error(
          error.response?.data?.message || "Échec de la connexion"
        );
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
      try {
        const response = await apiClient.post("/register", data);

        this.user = response.data.user;
        this.token = response.data.token;

        if (this.user && this.token) {
          localStorage.setItem("user", JSON.stringify(this.user));
          localStorage.setItem("token", this.token);

          apiClient.defaults.headers.common["Authorization"] =
            `Bearer ${this.token}`;
        }
      } catch (error: any) {
        throw new Error(
          error.response?.data?.message || "Échec de l'inscription"
        );
      }
    },

    async checkAuth() {
      try {
        if (!this.token) return false;

        apiClient.defaults.headers.common["Authorization"] =
          `Bearer ${this.token}`;

        const response = await apiClient.get("/user");
        this.user = response.data.user;
console.log(response.data)
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
      try {
        const response = await apiClient.get("/user");
        this.user = response.data.user;
        localStorage.setItem("user", JSON.stringify(this.user));
      } catch (error) {
        console.error("Erreur lors de la mise à jour des jetons:", error);
      }
    },

    async logout() {
      try {
        await apiClient.post("/logout");
      } catch (e) {
        // ignorer l'erreur logout si le token est déjà invalide
      }

      // this.user = null;
      this.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      delete apiClient.defaults.headers.common["Authorization"];
    },
  },
});
