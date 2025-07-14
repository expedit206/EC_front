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

library.add(fas);

const app = createApp(App);

app.component("font-awesome-icon", FontAwesomeIcon);

app.use(createPinia());
app.use(router);
app.use(Toast);
app.mount("#app");
