import { createApp } from "vue";
import "./assets/css/main.css";
import App from "./App.vue";
import { createPinia } from "pinia";
import router from "./router";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import '@fortawesome/fontawesome-free/css/all.min.css' // Import Font Awesome
import axios from "axios";
import { useAuthStore } from "./store/index";
// import cors from "cors";


const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(Toast, { timeout: 3000 });

// const authStore = useAuthStore();
// authStore.checkAuth().then(() => {
// });
// app.mount("#app");
// const corsOptions = {
// //   credentials: true, // Autoriser les cookies
// //   maxAge: 1800, // Durée de validité de la réponse CORS
// //   allowedHeaders: ["Content-Type"], // En-têtes autorisés
// };

// app.use(cors());
  
const authStore = useAuthStore();
authStore.checkAuth().then(() => {
    app.mount("#app");
});
// faults.withCredentials = true;