import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/auth/Login.vue";
import CommercantProduits from "../views/CommercantProduits.vue";
import Register from "../views/auth/Register.vue";
import Profile from "../views/Profile.vue";
import Parametres from "../views/Parametres.vue";
import Home from "../views/Home.vue";
import Produit from "../views/Produit.vue";
import CommercantDashboard from "../views/CommercantDashboard.vue";
import Parrainage from "../views/Parrainage.vue";
// import Abonnements from "../views/Abonnements.vue";
import Collaborations from "../views/Collaborations.vue";
import { useAuthStore } from "../stores/Auth";
import CommercantDetails from "../views/CommercantDetails.vue";

const routes = [
  { path: "/login", component: Login, name: "login" },
  { path: "/register", component: Register, name: "register" },
  {
    path: "/profil",
    component: Profile,
    name: "profil",
    meta: { requiresAuth: true },
  },
  {
    path: "/home",
    component: Home,
    name: "home",
    meta: { requiresAuth: true },
  },
  { path: "/", redirect: "/home" },

  {
    path: "/commercant/produits",
    name: "commercant.produits",
    component: CommercantProduits,
    meta: { requiresAuth: true, requiresCommercant: true },
  },

  {
    path: "/commercants/:commercantId",
    component: CommercantDetails,
    meta: { requiresAuth: true },
  },

  {
    path: "/commercant/monProfil",
    component: CommercantDashboard,
    meta: { requiresAuth: true },
  },

  {
    path: "/parametres",
    component: Parametres,
    meta: { requiresAuth: true },
  },

  {
    path: "/parrainage",
    component: Parrainage,
    name: "parrainage",
    meta: { requiresAuth: true },
  },

  // {
  //   path: "/abonnements",
  //   component: Abonnements,
  //   name: "abonnements",
  //   meta: { requiresAuth: true },
  // },

  { path: "/produits/:id", name: "produit", component: Produit },

  {
    path: "/collaborations",
    name: "collaborations",
    component: Collaborations,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = await authStore.checkAuth();

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: "login" });
  } else if (
    to.meta.requiresCommercant &&
    (!isAuthenticated || !authStore.user?.commercant)
  ) {
    next({ name: "home" });
  } else {
    next();
  }
});

export default router;
