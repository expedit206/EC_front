import { createApp } from "vue";
import "./assets/css/main.css";
import App from "./App.vue";
import { createPinia } from "pinia";
import router from "./router";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import '@fortawesome/fontawesome-free/css/all.min.css' // Import Font Awesome
import axios from "axios";



axios.defaults.baseURL = "http://localhost:8000/api/v1";

// src/main.js
axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => Promise.reject(error)
  )

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(Toast, { timeout: 3000 });
app.mount("#app");

axios.defaults.withCredentials = true; // Active les cookies pour les requêtes

// axios.defaults.withCredentials = true;
