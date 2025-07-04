import axios from 'axios';

const apiClient = axios.create({
  baseURL: "http://localhost:8000/", // Backend URL
  withCredentials: true, // Permet l'envoi des cookies
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  xsrfCookieName: "XSRF-TOKEN", // Nom du cookie CSRF
  xsrfHeaderName: "X-XSRF-TOKEN", // En-tête CSRF
});

export default apiClient;