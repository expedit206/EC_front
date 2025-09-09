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
import Collaborations from "../views/Collaborations.vue";
import JetonMarket from "../views/JetonMarket.vue";
import { useAuthStore } from "../stores/Auth";
import CommercantDetails from "../views/CommercantDetails.vue";
import CommercantCreate from "../views/CommercantCreate.vue";
import ParrainageInfo from "../views/ParrainageInfo.vue";
import Messages from "../views/Messages.vue";
import AchatJetonModal from "../components/AchatJetonModal.vue";
import JetonHistory from "../views/JetonHistory.vue";
import ProfilePublic from "../views/ProfilePublic.vue";

const routes = [
  { path: "/login", component: Login, name: "login" },
  { path: "/register/:code?", component: Register, name: "register" },
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
    name: "commercant-profile",
  },
  {
    path: "/commercant/create",
    component: CommercantCreate,
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
  { path: "/parrainage/info", component: ParrainageInfo },
  {
    path: "/messages",
    component: Messages,
    meta: { requiresAuth: true },
  },
  {
    path: "/messages/:receiverId",
    component: Messages,
    name: "messages",
    meta: { requiresAuth: true },
  },
  { path: "/produits/:id", name: "produit", component: Produit },
  {
    path: "/collaborations",
    name: "collaborations",
    component: Collaborations,
    meta: { requiresAuth: true },
  },
  {
    path: "/profile/public/:id",
    name: "public-profile",
    component: ProfilePublic,
  },
  {
    path: "/jeton-history",
    name: "jeton-history",
    component: JetonHistory,
    meta: { requiresAuth: true },
  },
  {
    path: "/acheter-jetons",
    name: "acheter-jetons",
    component: AchatJetonModal,
    meta: { requiresAuth: true },
  },
  {
    path: "/jetonMarket",
    name: "jetonMarkert",
    component: JetonMarket,
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

  // Si l'utilisateur est connecté et tente d'accéder à /login ou /register
  if (isAuthenticated && (to.name === "login" || to.name === "register")) {
    next({ name: "home" }); // Rediriger vers la page d'accueil
  }
  // Si la route nécessite une authentification et que l'utilisateur n'est pas connecté
  else if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: "login" });
  }
  // Si la route nécessite un statut commerçant
  else if (
    to.meta.requiresCommercant &&
    (!isAuthenticated || !authStore.user?.commercant)
  ) {
    next({ name: "home" });
  }
  // Autoriser l'accès dans les autres cas
  else {
    next();
  }
});

export default router;
