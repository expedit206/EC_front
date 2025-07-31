import { createApp } from "vue";
import { createPinia } from "pinia";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import App from "./App.vue";
// // import du css
import "./assets/css/main.css";
import router from "./router";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons"; // Tous les icônes "solid"


import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;



window.Echo = new Echo({
  broadcaster: "reverb",
  key: import.meta.env.VITE_REVERB_APP_KEY || "o7gm0ywqku2xk9ubjv14", // Remplacez par votre clé ou utilisez une variable d'environnement
  wsHost: import.meta.env.VITE_REVERB_HOST || "localhost",
  wsPort: import.meta.env.VITE_REVERB_PORT || 8080,
  wssPort: import.meta.env.VITE_REVERB_PORT || 8080,
  forceTLS: false,
  enabledTransports: ["ws", "wss"],
});

library.add(fas);

const app = createApp(App);

app.component("font-awesome-icon", FontAwesomeIcon);

app.use(createPinia());
app.use(router);
app.use(Toast);
app.mount("#app");
