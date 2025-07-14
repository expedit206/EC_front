import { createRouter, createWebHistory } from "vue-router";
// import Login from "../views/auth/Login.vue";
import Login from "../views/auth/Login.vue";
import Register from "../views/auth/Register.vue";
import Profile from "../views/Profile.vue"; // À créer si non existant
import Home from "../views/Home.vue"; // À créer si non existant
import CommercantDashboard from "../views/CommercantDashboard.vue"; // À créer si non existant
import { useAuthStore } from "../stores/Auth"; // Assurez-vous que le chemin est correct

const routes = [
  { path: "/login", component: Login, name: "login" },
  { path: "/register", component: Register, name: "register" },
  { path: "/profil", component: Profile, name: "profil", meta: { requiresAuth: true, } },
  { path: "/home", component: Home, name: "home" },
  { path: "/", redirect: "/home" },
  {
    path: "/commercant",
    component: CommercantDashboard,
    meta: {
      requiresAuth: true,
    },
  }
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
    next({ name: "dashboard" });
  } else {
    next();
  }
});
export default router;
