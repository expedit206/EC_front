import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import type { User } from "../types";
import apiClient from "../api/index.js";
import router from "../router";
export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);

  const register = async (form: {
    nom: string;
    telephone: string;
    email: string;
    ville: string;
    mot_de_passe: string;
    parrain_id: string;
  }) => {
    const response = await apiClient.post("/register", {
      ...form,
      mot_de_passe: form.mot_de_passe, // Assurer la cohérence
    });
    user.value = response.data.user;
    localStorage.setItem("user", JSON.stringify(user.value)); // Toujours LocalStorage pour register
    return response.data;
  };

  const login = async (form: {
    login: string;
    mot_de_passe: string;
    remember?: boolean;
  }) => {
    const response = await apiClient.post("/login", form);
    console.log(response.data.user);
    
    user.value = response.data.user;
    // const storage = form.remember ? localStorage : sessionStorage;
    localStorage.setItem("user", JSON.stringify(user.value));
    return response.data;
  };

  const logout = () => {
    user.value = null;
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
  };

    const loadUserFromStorage = () => {
      const storedUser =
        localStorage.getItem("user");
    // // console.log(storedUser);
    
    if (storedUser) {
      user.value =  JSON.parse(storedUser);
      
    } else {
      console.log('ok');
      user.value = null;
      // router.push("login");
    }
  };

  return { user, register, login, logout, loadUserFromStorage };
});
