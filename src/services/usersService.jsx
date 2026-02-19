import api from "../helpers/axiosConfig";

export const getAllUsers = async () => {
    try {
        const response = await api.get("/users");
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Error al obtener usuarios" };
    }
};

export const getDeletedUsers = async () => {
    try {
        const response = await api.get("/users/deleted");
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Error al obtener usuarios eliminados" };
    }
};

export const createUser = async (userData) => {
    try {
        const response = await api.post("/users", userData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Error al crear el usuario" };
    }
};

export const deleteUser = async (id) => {
    try {
        const response = await api.delete(`/users/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Error al eliminar el usuario" };
    }
};

export const restoreUser = async (id) => {
    try {
        const response = await api.patch(`/users/${id}/restore`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: "Error al restaurar el usuario" };
    }
};
