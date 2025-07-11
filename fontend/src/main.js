// src/main.js
import { createApp } from "vue";
import "./assets/css/main.css";
import App from "./App.vue";
import { createPinia } from "pinia";
import router from "./router";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useAuthStore } from "./store/index";

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(Toast, { timeout: 3000 });

const authStore = useAuthStore();
console.log("État d'authentification initial:", {
  isAuthenticated: authStore.isAuthenticated,
  user: authStore.user,
  token: authStore.token,
});
authStore
  .checkAuth()
  .then(() => {
    app.mount("#app");
  })
  .catch((error) => {
    console.error(
      "Erreur lors de la restauration de l'authentification:",
      error
    );
  });
