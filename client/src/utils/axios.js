// src/utils/axios.ts
import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    import.meta.env.VITE_BASE_URL ||
    "https://airbnb-clone-app-sepia.vercel.app/api/v1",
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
