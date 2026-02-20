import axios from "axios";

const api = axios.create({
    baseURL: "https://formulario-conestra-backend.onrender.com/",
    withCredentials: true,
});

// Interceptor para agregar TOKEN automáticamente a todas las peticiones
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
