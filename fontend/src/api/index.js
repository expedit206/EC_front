import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
axios.defaults.withXSRFToken = true;
export const apiClient = axios.create({
  // withCredentials: true,

  baseURL: "http://localhost:8000/api/v1",
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

export default apiClient;
