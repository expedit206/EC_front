// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import Profil from "../views/Profil.vue";
import Boutique from "../views/Boutique.vue";
import Parrainage from "../views/Parrainage.vue";
import Commande from "../views/Commande.vue";
import Litige from "../views/Litige.vue";
import Abonnement from "../views/Abonnement.vue";
import { useAuthStore } from "../store/index";

const routes = [
  { path: "/", component: Home, name: "home" },
  { path: "/login", component: Login, name: "login" },
  { path: "/register", component: Register, name: "register" },
  {
    path: "/profil",
    component: Profil,
    name: "profil",
    meta: { requiresAuth: true },
  }, // Ajouté requiresAuth
  { path: "/boutique/:id", component: Boutique, name: "boutique" },
  {
    path: "/parrainage",
    component: Parrainage,
    name: "parrainage",
    meta: { requiresAuth: true },
  },
  {
    path: "/commandes",
    component: Commande,
    name: "commandes",
    meta: { requiresAuth: true },
  },
  {
    path: "/litiges",
    component: Litige,
    name: "litiges",
    meta: { requiresAuth: true },
  },
  {
    path: "/abonnements",
    component: Abonnement,
    name: "abonnements",
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  console.log(
    "Navigation vers:",
    to.name,
    "isAuthenticated:",
    authStore.isAuthenticated,
    "token:",
    authStore.token
  );

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    try {
      const isAuthenticated = await authStore.checkAuth();
      console.log(
        "checkAuth result:",
        isAuthenticated,
        "user:",
        authStore.user
      );
      if (isAuthenticated) {
        next();
      } else {
        console.log("Redirection vers login: utilisateur non authentifié");
        next({ name: "login" });
      }
    } catch (error) {
      console.error("Erreur lors de la vérification d'authentification:", {
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
      next({ name: "login" });
    }
  } else {
    next();
  }
});

export default router;
