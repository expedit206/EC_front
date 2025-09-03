import { createApp } from "vue";
import { createPinia } from "pinia";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import App from "./App.vue";
import "./assets/css/main.css";
import router from "./router";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";

import axios from "axios";
import Pusher from "pusher-js";

// 🔹 Config axios
// axios.defaults.baseURL = "http://localhost:8000/api/v1"; // ton API
axios.defaults.headers.common["Accept"] = "application/json";
axios.defaults.withCredentials = true; // si tu utilises les cookies
// 🔹 Ajouter le token automatiquement s'il existe
const token = localStorage.getItem("token");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// 🔹 Echo (uniquement si besoin de Reverb/Pusher public)
// Si tu veux écouter un canal public, pas besoin d'auth
if (token) {
  import("laravel-echo").then(({ default: Echo }) => {
      window.Pusher = Pusher;

      window.Echo = new Echo({
        broadcaster: "reverb",
        key: import.meta.env.VITE_REVERB_APP_KEY,
        wsHost: import.meta.env.VITE_REVERB_HOST,
        wsPort: import.meta.env.VITE_REVERB_PORT ?? 6001,
        wssPort: import.meta.env.VITE_REVERB_PORT ?? 6001,
        forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',

        enabledTransports: ["ws", "wss"],
        auth: {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Auth via token
          },
        },
      });

      // Exemple : écouter un canal public
      window.Echo.channel("public-channel")
        .listen(".message.sent", (event) => {
          console.log("📩 Nouveau message reçu:", event.message);
        })
        .error((error) => {
          console.error("Erreur Echo:", error);
        });
  });
}

// 🔹 Boot Vue
library.add(fas);
const app = createApp(App);
app.component("font-awesome-icon", FontAwesomeIcon);
app.use(createPinia());
app.use(router);
app.use(Toast);
app.mount("#app");
