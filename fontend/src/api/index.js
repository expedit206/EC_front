// src/api.js
import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});


apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log(token);
  if (token) {
    config.headers.Authorization = token; // Token brut, sans "Bearer"
  }
  return config;
});
export default apiClient;
