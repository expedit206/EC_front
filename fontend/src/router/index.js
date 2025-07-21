import { createRouter, createWebHistory } from "vue-router";
// import Login from "../views/auth/Login.vue";
import Login from "../views/auth/Login.vue";
import CommercantProduits from "../views/CommercantProduits.vue"; // Assurez-vous que le chemin est correct
import Register from "../views/auth/Register.vue";
import Profile from "../views/Profile.vue"; // À créer si non existant
import Parametres from "../views/Parametres.vue"; // À créer si non existant
import Home from "../views/Home.vue"; // À créer si non existant
import Produit from "../views/Produit.vue";
import CommercantDashboard from "../views/CommercantDashboard.vue"; // À créer si non existant
// import Parrainage from "../views/Parrainage.vue"; // À créer si non existant
import Commandes from "../views/commandes.vue"; // À créer si non existant
// import Abonnements from "../views/Abonnements.vue"; // À créer si non existant
import Collaborations from "../views/Collaborations.vue"; // À créer si non existant
import Panier from "../views/Panier.vue"; // À créer si non existant

import { useAuthStore } from "../stores/Auth"; // Assurez-vous que le chemin est correct
import CommercantDetails from "../views/CommercantDetails.vue";
import Parrainage from "../views/Parrainage.vue";

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
    meta: {
      requiresAuth: true,
    },
  },

  {
    path: "/commercant/monProfil",
    component: CommercantDashboard,
    meta: {
      requiresAuth: true,
    },
  },

  {
    path: "/parametres",
    component: Parametres,
    meta: {
      requiresAuth: true,
    },
  },

  {
    path: "/panier",
    name: "panier",
    component: Panier,
    meta: { requiresAuth: true },
  },

  // { path: '/parrainage', name: 'parrainage', component: Parrainage, meta: { requiresAuth: true } },
  {
    path: "/commandes",
    name: "commandes",
    component: Commandes,
    meta: { requiresAuth: true },
  },
  // { path: '/abonnements', name: 'abonnements', component: Abonnements, meta: { requiresAuth: true } },
  {
    path: "/parametres",
    name: "parametres",
    component: Parametres,
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
    path: "/parrainage", component: Parrainage, name: "Parrainage",
    
    meta: { requiresAuth: true },

  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// router.beforeEach((to, from, next) => {
//   const authStore = useAuthStore();

//   const authPages = ["login", "register"];

//   const storedUser = localStorage.getItem("user");
//   if (storedUser) {
//     authStore.loadUserFromStorage();
//   } else {
//     // if (!authPages.includes(to.name)) ; // Toujours charger l'utilisateur depuis localStorage
//   }

//   const isAuthenticated = !!authStore.user;
//   // console.log(isAuthenticated);

//   if (!isAuthenticated && !authPages.includes(to.name)) {
//     console.log(isAuthenticated);
//     // Pas connecté et essaie d'accéder à une page protégée
//     return next({ name: "login" });
//   }

//   if (isAuthenticated && authPages.includes(to.name)) {
//     // Déjà connecté et essaie d'accéder à login ou register
//     return next({ name: "home" });
//   }

//   // Cas normal
//   next();
// });

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
