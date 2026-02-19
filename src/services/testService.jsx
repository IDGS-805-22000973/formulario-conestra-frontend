import api from "../helpers/axiosConfig";

/**
 * Envía las respuestas de un test al servidor
 * @param {string} testType - 'MOSS' o '16PF'
 * @param {Object} answers - Objeto con formato { q1: 'A', q2: 'C', ... }
 */
export const submitTestService = async (testType, answers) => {
    try {
        const response = await api.post('/test/submit', {
            testType,
            answers
        });
        return response.data;
    } catch (error) {
        console.error(`Error al enviar el test ${testType}:`, error);
        throw error.response?.data || { message: "Error de conexión con el servidor" };
    }
};

/**
 * Obtiene todos los resultados (Solo para Admin)
 */
// Admin: traer todos los resultados
export const obtenerTodosLosResultados = async () => {
    const { data } = await api.get("/test/results");
    return data;
};

// Traer resultados por usuario
export const obtenerResultadosPorUsuario = async (userId) => {
    const { data } = await api.get(`/test/results/user/${userId}`);
    return data;
};