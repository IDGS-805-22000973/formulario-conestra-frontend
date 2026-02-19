import api from "../helpers/axiosConfig";

export const loginService = async (correo, password) => {
    try {
        // Hacemos POST al endpoint que creamos en NestJS
        const response = await api.post('/auth/login', { 
            correo, 
            password 
        });
        
        // Si todo sale bien, retornamos la data (access_token y user)
        return response.data;
    } catch (error) {
        // Si hay error, lanzamos el mensaje que viene del backend o un genérico
        console.error("Error en loginService:", error);
        throw error.response?.data || { message: "No se pudo conectar con el servidor" };
    }
};