import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { submitTestService } from "../services/testService";
import { MOSS_QUESTIONS } from "../helpers/questionsData";
import { PF16_QUESTIONS } from "../helpers/pf16Data";
import {
    guardarProgresoTest,
    obtenerProgresoTest,
    limpiarProgresoTest,
} from "../utils/testStorage";
import "../styles/TestFormPage.css";  // ← ajusta la ruta si es necesario

// Letras para los marcadores de opción (A, B, C, D…)
const LETTERS = ["A", "B", "C", "D", "E", "F"];

const TestFormPage = () => {
    const { testType } = useParams();
    const navigate = useNavigate();

    const tipo = testType.toUpperCase();

    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [offline, setOffline] = useState(!navigator.onLine);
    const [modalConfirm, setModalConfirm] = useState({ show: false, type: "" });
    const [toast, setToast] = useState({ show: false, message: "", type: "" });

    const questionsPerPage = 10;

    // Referencia al inicio de la tarjeta de preguntas para hacer scroll al cambiar página
    const topRef = useRef(null);

    /* ── Listeners online/offline ── */
    useEffect(() => {
        const goOnline = () => setOffline(false);
        const goOffline = () => setOffline(true);
        window.addEventListener("online", goOnline);
        window.addEventListener("offline", goOffline);
        return () => {
            window.removeEventListener("online", goOnline);
            window.removeEventListener("offline", goOffline);
        };
    }, []);

    /* ── Cargar preguntas ── */
    useEffect(() => {
        if (tipo === "MOSS") setQuestions(MOSS_QUESTIONS);
        if (tipo === "16PF") setQuestions(PF16_QUESTIONS);
    }, [tipo]);

    /* ── Recuperar progreso guardado ── */
    useEffect(() => {
        const progreso = obtenerProgresoTest(tipo);
        if (progreso) {
            setAnswers(progreso.answers || {});
            setCurrentPage(progreso.currentPage || 0);
        }
    }, [tipo]);

    /* ── Guardar progreso automáticamente ── */
    useEffect(() => {
        if (questions.length > 0) {
            guardarProgresoTest(tipo, answers, currentPage);
        }
    }, [answers, currentPage, tipo, questions.length]);

    /* ── Scroll a la primera pregunta al cambiar de página ── */
    useEffect(() => {
        if (topRef.current) {
            topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, [currentPage]);

    /* ── Toast ── */
    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
    };

    /* ── Handlers ── */
    const handleOptionChange = (qId, optId) => {
        setAnswers((prev) => ({ ...prev, [`q${qId}`]: optId }));
    };

    const handleSubmit = async () => {
        if (Object.keys(answers).length < questions.length) {
            showToast(
                `Responde todas las preguntas (${Object.keys(answers).length}/${questions.length})`,
                "warning"
            );
            return;
        }
        setLoading(true);
        try {
            await submitTestService(tipo, answers);
            showToast("Test enviado con éxito", "success");
            limpiarProgresoTest(tipo);
            setTimeout(() => navigate("/formularios"), 2000);
        } catch (err) {
            showToast(err.message || "Error al enviar el test", "error");
        } finally {
            setLoading(false);
        }
    };

    const confirmClear = () => {
        limpiarProgresoTest(tipo);
        setAnswers({});
        setCurrentPage(0);
        setModalConfirm({ show: false, type: "" });
        showToast("Avance borrado correctamente", "success");
    };

    /* ── Paginación ── */
    const totalPages = Math.ceil(questions.length / questionsPerPage);
    const currentQuestions = questions.slice(
        currentPage * questionsPerPage,
        (currentPage + 1) * questionsPerPage
    );
    const answeredCount = Object.keys(answers).length;
    const progressPct = questions.length > 0
        ? (answeredCount / questions.length) * 100
        : 0;
    const globalOffset = currentPage * questionsPerPage;

    /* ════════════════════════════════ RENDER ════════════════════════════════ */
    return (
        <div className="container mt-4 mb-5">

            {/* ── ENCABEZADO ── */}
            <div className="tfp-header">
                <div className="tfp-header-left">
                    <span className="tfp-badge">Evaluación psicométrica</span>
                    <h2 className="tfp-title">{tipo}</h2>
                </div>
                <span className="tfp-page-badge">
                    Página {currentPage + 1} de {totalPages}
                </span>
            </div>

            {/* ── PROGRESO ── */}
            <div className="tfp-prog-wrap" role="progressbar" aria-valuenow={answeredCount} aria-valuemax={questions.length}>
                <div className="tfp-prog-bar" style={{ width: `${progressPct}%` }} />
            </div>
            <span className="tfp-prog-label">
                {answeredCount} de {questions.length} respondidas
            </span>

            {/* ── ALERTA OFFLINE ── */}
            {offline && (
                <div className="tfp-offline">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 1l22 22M16.72 11.06A10.94 10.94 0 0 1 19 12.55M5 12.55a10.94 10.94 0 0 1 5.17-2.39M10.71 5.05A16 16 0 0 1 22.56 9M1.42 9a15.91 15.91 0 0 1 4.7-2.88M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" />
                    </svg>
                    Sin conexión. Tus respuestas se guardan automáticamente.
                </div>
            )}

            {/* ── BOTÓN BORRAR AVANCE ── */}
            <div className="tfp-clear-row">
                <button
                    className="tfp-btn-clear"
                    onClick={() => setModalConfirm({ show: true, type: "clear" })}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
                    </svg>
                    Borrar avance guardado
                </button>
            </div>

            {/* ── TARJETA DE PREGUNTAS ── */}
            <div className="tfp-questions-card" ref={topRef}>
                {currentQuestions.map((q, idx) => (
                    <div key={q.id} className="tfp-question-item">
                        <span className="tfp-question-number">
                            Pregunta {globalOffset + idx + 1}
                        </span>
                        <p className="tfp-question-text">{q.question}</p>

                        <div className="tfp-options">
                            {q.options.map((opt, oi) => (
                                <label
                                    key={opt.id}
                                    className={`tfp-opt ${answers[`q${q.id}`] === opt.id ? "tfp-opt--on" : ""}`}
                                >
                                    <input
                                        type="radio"
                                        name={`q${q.id}`}
                                        value={opt.id}
                                        checked={answers[`q${q.id}`] === opt.id}
                                        onChange={() => handleOptionChange(q.id, opt.id)}
                                        className="tfp-opt-radio"
                                    />
                                    <span className="tfp-opt-marker">
                                        {LETTERS[oi] ?? oi + 1}
                                    </span>
                                    <span className="tfp-opt-text">{opt.text}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* ── NAVEGACIÓN ── */}
            <div className="tfp-nav">
                <button
                    className="tfp-btn-prev"
                    disabled={currentPage === 0}
                    onClick={() => setCurrentPage((p) => p - 1)}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                    Anterior
                </button>

                {currentPage === totalPages - 1 ? (
                    <button
                        className="tfp-btn-finish"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite" }}>
                                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                </svg>
                                Enviando…
                            </>
                        ) : (
                            <>
                                Finalizar Test
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            </>
                        )}
                    </button>
                ) : (
                    <button
                        className="tfp-btn-next"
                        onClick={() => setCurrentPage((p) => p + 1)}
                    >
                        Siguiente
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </button>
                )}
            </div>

            {/* ════════ MODAL CONFIRMACIÓN ════════ */}
            {modalConfirm.show && (
                <div className="tfp-modal-overlay">
                    <div className="tfp-modal-card">
                        <div className="tfp-modal-header">
                            <h5 className="tfp-modal-title">Borrar avance guardado</h5>
                            <button
                                className="tfp-modal-close"
                                onClick={() => setModalConfirm({ show: false, type: "" })}
                                aria-label="Cerrar"
                            >✕</button>
                        </div>
                        <div className="tfp-modal-body">
                            ¿Estás seguro de que deseas borrar todo el avance guardado?
                            Tus respuestas actuales se perderán y no se puede deshacer.
                        </div>
                        <div className="tfp-modal-footer">
                            <button
                                className="tfp-modal-btn-cancel"
                                onClick={() => setModalConfirm({ show: false, type: "" })}
                            >
                                Cancelar
                            </button>
                            <button className="tfp-modal-btn-danger" onClick={confirmClear}>
                                Sí, borrar avance
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ════════ TOAST ════════ */}
            {toast.show && (
                <div className="tfp-toast-wrap">
                    <div className={`tfp-toast tfp-toast--${toast.type}`}>
                        <span>{toast.message}</span>
                        <button
                            className="tfp-toast-close"
                            onClick={() => setToast({ show: false, message: "", type: "" })}
                            aria-label="Cerrar"
                        >✕</button>
                    </div>
                </div>
            )}

            {/* Spin para el botón de carga */}
            <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
        </div>
    );
};

export default TestFormPage;