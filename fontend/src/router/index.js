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

const routes = [
    {
        path: "/", component: Home, name: "home",
    // meta: { requiresAuth: false },
      
   },
  { path: "/login", component: Login, name: "login" },
  { path: "/register", component: Register, name: "register" },
  {
    path: "/profil",
    component: Profil,
    name: "profil",
    meta: { requiresAuth: true },
  },
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

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem("token");
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: "login" });
  } else {
    next();
  }
});

export default router;
