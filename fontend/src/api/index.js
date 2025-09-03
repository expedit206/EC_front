import axios from "axios";

axios.defaults.withCredentials = true;

axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
axios.defaults.withXSRFToken = true;
export const apiClient = axios.create({
  withCredentials: true, 

  // baseURL: "http://localhost:8000/api/v1",
  baseURL: "https://espacecameroun.devfack.com/api/v1",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});
// const apiClient = axios.create({
//   withCredentials: true,

//   baseURL: "http://localhost:8000",
//   headers: {
//     Accept: "application/json",
//     "Content-Type": "application/json",
//   },
// });


apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token"); // ou Pinia si tu stockes là
  if (token) {
    // config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
