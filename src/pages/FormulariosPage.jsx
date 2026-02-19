import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const FormulariosPage = () => {
    const navigate = useNavigate();

    const handleNavigate = (type) => {
        // Redirige a la ruta del test pasando el tipo como parámetro
        navigate(`/test/${type.toLowerCase()}`);
    };

    return (
        <>
        <Navbar />
  
        <div className="container mt-5">
            <div className="text-center mb-5">
                <h2 className="fw-bold">Centro de Evaluaciones</h2>
                <p className="text-muted">Seleccione la prueba que desea realizar. Recuerde que solo puede realizar cada prueba una vez.</p>
            </div>

            <div className="row justify-content-center g-4">
                {/* Card para Test de Moss */}
                <div className="col-md-5">
                    <div className="card h-100 shadow-sm border-primary">
                        <div className="card-body text-center d-flex flex-column">
                            <h5 className="card-title fw-bold text-primary">Test de MOSS</h5>
                            <p className="card-text flex-grow-1">
                                Evaluación de adaptabilidad social y liderazgo. Mide la capacidad de manejo de relaciones interpersonales y toma de decisiones en situaciones sociales.
                            </p>
                            <button
                                onClick={() => handleNavigate('MOSS')}
                                className="btn btn-primary w-100 mt-3 py-2"
                            >
                                Comenzar Test de Moss
                            </button>
                        </div>
                    </div>
                </div>

                {/* Card para Test 16PF */}
                <div className="col-md-5">
                    <div className="card h-100 shadow-sm border-success">
                        <div className="card-body text-center d-flex flex-column">
                            <h5 className="card-title fw-bold text-success">Test 16PF</h5>
                            <p className="card-text flex-grow-1">
                                Cuestionario de 16 factores de la personalidad. Permite obtener un perfil profundo sobre rasgos de carácter, estabilidad emocional y sociabilidad.
                            </p>
                            <button
                                onClick={() => handleNavigate('16PF')}
                                className="btn btn-success w-100 mt-3 py-2"
                            >
                                Comenzar Test 16PF
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default FormulariosPage;