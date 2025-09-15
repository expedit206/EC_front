import axios from "axios";

// Définir le baseURL de manière dynamique
const getBaseUrl = () => {
  const host = window.location.hostname;
  if (host === "localhost" || host === "127.0.0.1") {
    return "http://localhost:8000/api/v1"; // URL locale
  }
    return "https://espacecameroun.devfack.com/api/v1"; // URL de production (à ajuster selon votre domaine)
  
  
};

axios.defaults.withCredentials = true;
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
axios.defaults.withXSRFToken = true;

export const apiClient = axios.create({
  withCredentials: true,
  baseURL: getBaseUrl(), // Utilisation de la fonction dynamique
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});


export default apiClient;
