import React, { useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../components/BotonRegresar";
import { AuthContext } from "../context/AuthContext";

const NotFound = () => {
    const botonRef = useRef(null);
    const navigate = useNavigate();

    const { user } = useContext(AuthContext);

    useEffect(() => {
        const el = botonRef.current;

        if (el) {
            const handler = () => {
                if (user?.role === "admin") {
                    navigate("/test/resultados");
                } else if (user?.role === "user") {
                    navigate("/formularios");
                } else {
                    navigate("/login");
                }
            };

            el.addEventListener("regresar", handler);

            return () => el.removeEventListener("regresar", handler);
        }
    }, [navigate, user]);

    return (
        <div className="text-center mt-5">
            <h1 className="text-danger mb-4">404 - Página no encontrada</h1>
            <p>La página que buscas no existe o ha sido movida.</p>

            <boton-regresar ref={botonRef}></boton-regresar>
        </div>
    );
};

export default NotFound;
