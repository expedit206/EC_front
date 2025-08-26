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

import Echo from "laravel-echo";
import Pusher from "pusher-js";
import axios from "axios";

// Config axios global
// axios.defaults.withCredentials = true;

// Récupérer le token stocké
const token = localStorage.getItem("token");

// Config axios pour ajouter automatiquement le Bearer token
if (token) {
//   axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

async function initApp() {
  // 1️⃣ Demander le cookie CSRF (utile si certaines requêtes POST nécessitent CSRF)
//   try {
//     await axios.get("http://localhost:8000/sanctum/csrf-cookie");
//   } catch (error) {
//     console.warn("Impossible de récupérer le cookie CSRF :", error);
//   }

  // 2️⃣ Initialiser Echo si le token existe
  if (token) {
    window.Pusher = Pusher;
    // window.Echo = new Echo({
    //   broadcaster: "reverb",
    //   key: import.meta.env.VITE_REVERB_APP_KEY,
    //   wsHost: import.meta.env.VITE_REVERB_HOST,
    //   wsPort: import.meta.env.VITE_REVERB_PORT ?? 6001,
    //   wssPort: import.meta.env.VITE_REVERB_PORT ?? 6001,
    //   forceTLS: false,
    //   enabledTransports: ["ws", "wss"],
    // //   authEndpoint: "http://localhost:8000/broadcasting/auth",
    //   auth: {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   },
    //   authorizer: (channel, options) => {
    //     return {
    //       authorize: (socketId, callback) => {
    //         axios
    //           .get(
    //             "http://localhost:8000/broadcasting/auth",
    //             {
    //               socket_id: socketId,
    //               channel_name: channel.name,
    //             },
    //             {
    //               withCredentials: true, // Important for session/cookie based auth
    //               headers: {
    //                 Authorization: `Bearer ${token}`,

    //                 // "X-XSRF-TOKEN": getCsrfToken(), // Function to get XSRF token
    //               },
    //             }
    //           )
    //           .then((response) => {
    //             callback(false, response.data);
    //           })
    //           .catch((error) => {
    //             callback(true, error);
    //           });
    //       },
    //     };
    //   },
    // });


window.Echo = new Echo({
  broadcaster: "reverb",
  key: import.meta.env.VITE_REVERB_APP_KEY,
  wsHost: import.meta.env.VITE_REVERB_HOST,
  wsPort: import.meta.env.VITE_REVERB_PORT ?? 6001,
  wssPort: import.meta.env.VITE_REVERB_PORT ?? 6001,
  forceTLS: false,
  enabledTransports: ["ws", "wss"],
});




    // // 3️⃣ Exemple d'écoute d'un canal privé
    // window.Echo.channel(`public-channel`)
    //   // window.Echo.private(`chat.4`)
    //   .listen(".message.sent", (event) => {
    //     console.log("📩 Nouveau message reçu :", event.message);
    //   })
    //   .error((error) => {
    //     console.error("Erreur Echo:", error);
    //   });
  }

  // 4️⃣ Boot Vue
  library.add(fas);

  const app = createApp(App);
  app.component("font-awesome-icon", FontAwesomeIcon);
  app.use(createPinia());
  app.use(router);
  app.use(Toast);
  app.mount("#app");
}

initApp();
