// src/api.js
import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:2000/api/v1",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  // Supprimé credentials: true, car JWT n'a pas besoin de cookies
});

// apiClient.interceptors.request.use((config) => {
//   const noAuthRoutes = ["/login", "/register"];

//   const token = localStorage.getItem("jwt_token");
//   console.log(
//     "Interceptor: Token lu depuis localStorage:",
//     token,
//     "pour URL:",
//     config.url
//   );
//   if (token && token !== "undefined" && token !== "") {
//     config.headers.Authorization = `Bearer ${token}`;
//     console.log("Ajout de Authorization:", config.headers.Authorization);
//   } else {
//     console.log("Aucun token JWT valide trouvé pour la requête:", config.url);
//   }
//   return config;
// });

// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     console.error("Erreur réseau ou serveur:", {
//       message: error.message,
//       status: error.response?.status,
//       details: error.response?.data,
//       url: error.config?.url,
//     });
//     return Promise.reject(error);
//   }
// );

export default apiClient;
