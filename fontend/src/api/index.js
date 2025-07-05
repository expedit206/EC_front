// src/api.js
import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
    credentials: true, //access-control-allow-credentials:true
  
});

// Intercepteur pour ajouter le token JWT
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwt_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("Ajout de Authorization:", config.headers.Authorization);
  }
  return config;
});

export default apiClient;
