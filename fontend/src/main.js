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
import Echo from "laravel-echo";
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
      window.Pusher = Pusher;

      window.Echo = new Echo({
     broadcaster: "pusher",
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    // forceTLS: false,
    forceTLS: true,
        enabledTransports: ["ws", "wss"],
        // auth: {
        //   headers: {
        //     Authorization: `Bearer ${token}`, // ✅ Auth via token
        //   },
        // },
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
