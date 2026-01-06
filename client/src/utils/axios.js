import axios from "axios";

const axiosInstance = axios.create({
  // Points to your backend URL (e.g., http://localhost:4000/api)
  baseURL: import.meta.env.VITE_BASE_URL,

  // Important: This allows the browser to send cookies/sessions
  // if your backend uses them for authentication

  withCredentials: true,
});

//localhost:8000

http: axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
