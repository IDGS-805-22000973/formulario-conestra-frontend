export const guardarProgresoTest = (testType, answers, currentPage) => {
    const clave = `progreso_test_${testType}`;

    const data = {
        answers,
        currentPage,
        fecha: new Date().toISOString(),
    };

    localStorage.setItem(clave, JSON.stringify(data));
};

export const obtenerProgresoTest = (testType) => {
    const clave = `progreso_test_${testType}`;
    const data = localStorage.getItem(clave);
    return data ? JSON.parse(data) : null;
};

export const limpiarProgresoTest = (testType) => {
    const clave = `progreso_test_${testType}`;
    localStorage.removeItem(clave);
};
