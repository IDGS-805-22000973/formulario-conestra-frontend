import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { submitTestService } from "../services/testService";
import { MOSS_QUESTIONS } from "../helpers/questionsData";
import { PF16_QUESTIONS } from "../helpers/pf16Data";

import {
    guardarProgresoTest,
    obtenerProgresoTest,
    limpiarProgresoTest,
} from "../utils/testStorage";

const TestFormPage = () => {
    const { testType } = useParams();
    const navigate = useNavigate();

    const tipo = testType.toUpperCase();

    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(false);

    const questionsPerPage = 10;

    const [offline, setOffline] = useState(!navigator.onLine);

    // Estados para modales y toasts
    const [modalConfirm, setModalConfirm] = useState({ show: false, type: '' });
    const [toast, setToast] = useState({ show: false, message: '', type: '' });

    useEffect(() => {
        const online = () => setOffline(false);
        const offline = () => setOffline(true);

        window.addEventListener("online", online);
        window.addEventListener("offline", offline);

        return () => {
            window.removeEventListener("online", online);
            window.removeEventListener("offline", offline);
        };
    }, []);

    // Cargar preguntas
    useEffect(() => {
        if (tipo === "MOSS") {
            setQuestions(MOSS_QUESTIONS);
        } else if (tipo === "16PF") {
            setQuestions(PF16_QUESTIONS);
        }
    }, [tipo]);

    // Cargar progreso guardado al iniciar
    useEffect(() => {
        const progreso = obtenerProgresoTest(tipo);

        if (progreso) {
            setAnswers(progreso.answers || {});
            setCurrentPage(progreso.currentPage || 0);
        }
    }, [tipo]);

    // Guardar progreso cada vez que cambie answers o currentPage
    useEffect(() => {
        if (questions.length > 0) {
            guardarProgresoTest(tipo, answers, currentPage);
        }
    }, [answers, currentPage, tipo, questions.length]);

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
    };

    const handleOptionChange = (qId, optId) => {
        setAnswers((prev) => ({ ...prev, [`q${qId}`]: optId }));
    };

    const totalPages = Math.ceil(questions.length / questionsPerPage);

    const currentQuestions = questions.slice(
        currentPage * questionsPerPage,
        (currentPage + 1) * questionsPerPage
    );

    const handleSubmit = async () => {
        if (Object.keys(answers).length < questions.length) {
            showToast(
                `Por favor, responde todas las preguntas (${Object.keys(answers).length}/${questions.length})`,
                'warning'
            );
            return;
        }

        setLoading(true);

        try {
            await submitTestService(tipo, answers);

            showToast('Test enviado con éxito', 'success');

            //BORRAR PROGRESO GUARDADO
            limpiarProgresoTest(tipo);

            // Navegar después de un pequeño delay para que se vea el toast
            setTimeout(() => {
                navigate("/formularios");
            }, 1500);
        } catch (err) {
            showToast(err.message || 'Error al enviar el test', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleLimpiar = () => {
        setModalConfirm({ show: true, type: 'clear' });
    };

    const confirmClear = () => {
        limpiarProgresoTest(tipo);
        setAnswers({});
        setCurrentPage(0);
        setModalConfirm({ show: false, type: '' });
        showToast('Avance borrado correctamente', 'success');
    };

    return (
        <div className="container mt-4 mb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>{tipo}</h2>
                <span className="badge bg-secondary">
                    Página {currentPage + 1} de {totalPages}
                </span>
            </div>

            <div className="progress mb-4" style={{ height: "10px" }}>
                <div
                    className="progress-bar bg-success"
                    style={{
                        width: `${(Object.keys(answers).length / questions.length) * 100}%`,
                    }}
                />
            </div>

            {offline && (
                <div className="alert alert-warning">
                    Estás sin conexión. Tus respuestas se guardarán automáticamente.
                </div>
            )}

            <div className="d-flex justify-content-end mb-3">
                <button className="btn btn-outline-danger btn-sm" onClick={handleLimpiar}>
                    Borrar avance guardado
                </button>
            </div>

            <div className="card shadow-sm p-4 mb-4">
                {currentQuestions.map((q) => (
                    <div key={q.id} className="mb-4 border-bottom pb-3">
                        <p className="fw-bold">{q.question}</p>

                        <div className="d-flex gap-3 flex-wrap">
                            {q.options.map((opt) => (
                                <div className="form-check" key={opt.id}>
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name={`q${q.id}`}
                                        checked={answers[`q${q.id}`] === opt.id}
                                        onChange={() => handleOptionChange(q.id, opt.id)}
                                    />
                                    <label className="form-check-label">{opt.text}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="d-flex justify-content-between">
                <button
                    className="btn btn-outline-primary"
                    disabled={currentPage === 0}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                    Anterior
                </button>

                {currentPage === totalPages - 1 ? (
                    <button
                        className="btn btn-success px-5"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? "Enviando..." : "Finalizar Test"}
                    </button>
                ) : (
                    <button
                        className="btn btn-primary px-5"
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                    >
                        Siguiente
                    </button>
                )}
            </div>

            {/* MODAL DE CONFIRMACIÓN */}
            {modalConfirm.show && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirmar Acción</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setModalConfirm({ show: false, type: '' })}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <p>
                                    ¿Estás seguro de que deseas borrar todo el avance guardado?
                                    Esta acción no se puede deshacer.
                                </p>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setModalConfirm({ show: false, type: '' })}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={confirmClear}
                                >
                                    Borrar Avance
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TOAST DE NOTIFICACIÓN */}
            {toast.show && (
                <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 11 }}>
                    <div className={`toast show align-items-center text-white border-0 ${toast.type === 'success' ? 'bg-success' :
                            toast.type === 'warning' ? 'bg-warning' : 'bg-danger'
                        }`}>
                        <div className="d-flex">
                            <div className="toast-body">
                                {toast.message}
                            </div>
                            <button
                                type="button"
                                className="btn-close btn-close-white me-2 m-auto"
                                onClick={() => setToast({ show: false, message: '', type: '' })}
                            ></button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TestFormPage;