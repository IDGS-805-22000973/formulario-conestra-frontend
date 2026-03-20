import React, { useState } from "react";

const TUTORIAL_STEPS = [
    {
        id: 1,
        label: "Paso 1 de 3 – Lee la pregunta completa",
        hint: "Tómate el tiempo necesario para leer cada pregunta antes de responder.",
        question: "Cuando tienes varias tareas pendientes, ¿cuál es tu reacción habitual?",
        options: [
            { id: "a", text: "Las organizo por prioridad y comienzo con la más urgente." },
            { id: "b", text: "Las anoto y empiezo por la que me resulta más fácil." },
            { id: "c", text: "Pido ayuda para decidir por dónde empezar." },
            { id: "d", text: "Las dejo para después y actúo según surjan." },
        ],
    },
    {
        id: 2,
        label: "Paso 2 de 3 – Selecciona UNA sola opción",
        hint: "En las pruebas reales solo podrás marcar una respuesta por pregunta. Elige la que mejor te describa.",
        question: "¿Cómo te comportas generalmente al trabajar en equipo?",
        options: [
            { id: "a", text: "Asumo el liderazgo y coordino al grupo." },
            { id: "b", text: "Colaboro activamente y apoyo las decisiones del grupo." },
            { id: "c", text: "Prefiero escuchar antes de opinar." },
            { id: "d", text: "Trabajo de forma independiente siempre que puedo." },
        ],
    },
    {
        id: 3,
        label: "Paso 3 de 3 – No hay respuestas correctas o incorrectas",
        hint: "Estas pruebas miden tu perfil, no tu conocimiento. Responde siempre con sinceridad.",
        question: "Ante un problema inesperado en el trabajo, ¿qué haces primero?",
        options: [
            { id: "a", text: "Analizo la situación antes de actuar." },
            { id: "b", text: "Busco de inmediato una solución práctica." },
            { id: "c", text: "Consulto con alguien de confianza." },
            { id: "d", text: "Me tomo un momento para calmarme y luego actúo." },
        ],
    },
];

const TutorialModal = ({ onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [selected, setSelected] = useState(null);
    const [shake, setShake] = useState(false);
    const [fadeKey, setFadeKey] = useState(0);
    const [closing, setClosing] = useState(false);

    const step = TUTORIAL_STEPS[currentStep];
    const isLast = currentStep === TUTORIAL_STEPS.length - 1;

    const progressFill = selected
        ? ((currentStep + 1) / TUTORIAL_STEPS.length) * 100
        : (currentStep / TUTORIAL_STEPS.length) * 100;

    const goNext = () => {
        if (!selected) {
            setShake(true);
            setTimeout(() => setShake(false), 600);
            return;
        }
        if (isLast) {
            setClosing(true);
            setTimeout(() => onComplete(), 450);
            return;
        }
        setFadeKey((k) => k + 1);
        setSelected(null);
        setCurrentStep((s) => s + 1);
    };

    return (
        <div
            className={`tut-overlay ${closing ? "tut-overlay--out" : ""}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="tut-title"
        >
            <div className={`tut-card ${closing ? "tut-card--out" : ""}`}>

                {/* ── HEADER ── */}
                <div className="tut-header">
                    <span className="tut-badge">Tutorial</span>
                    <h2 id="tut-title" className="tut-title">
                        ¿Cómo responder los cuestionarios?
                    </h2>
                    <p className="tut-subtitle">
                        Completa este breve simulador antes de iniciar las pruebas reales.
                    </p>
                </div>

                {/* ── BARRA DE PROGRESO ── */}
                <div
                    className="tut-prog-wrap"
                    role="progressbar"
                    aria-valuenow={currentStep + (selected ? 1 : 0)}
                    aria-valuemin={0}
                    aria-valuemax={TUTORIAL_STEPS.length}
                >
                    <div className="tut-prog-bar" style={{ width: `${progressFill}%` }} />
                </div>

                {/* ── LABEL + HINT ── */}
                <div className="tut-meta" key={`meta-${fadeKey}`}>
                    <span className="tut-step-label">{step.label}</span>
                    <div className="tut-hint">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                            style={{ flexShrink: 0 }}>
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="16" x2="12" y2="12" />
                            <line x1="12" y1="8" x2="12.01" y2="8" />
                        </svg>
                        {step.hint}
                    </div>
                </div>

                {/* ── TARJETA DE PREGUNTA ── */}
                <div
                    className={`tut-question-wrap ${shake ? "tut-shake" : ""}`}
                    key={`q-${fadeKey}`}
                >
                    <p className="tut-question-text">{step.question}</p>

                    <div className="tut-options">
                        {step.options.map((opt) => (
                            <label
                                key={opt.id}
                                className={`tut-opt ${selected === opt.id ? "tut-opt--on" : ""}`}
                            >
                                <input
                                    type="radio"
                                    name={`tut-q${step.id}`}
                                    value={opt.id}
                                    checked={selected === opt.id}
                                    onChange={() => setSelected(opt.id)}
                                    className="tut-opt-radio"
                                />
                                <span className="tut-opt-marker">{opt.id.toUpperCase()}</span>
                                <span className="tut-opt-text">{opt.text}</span>
                            </label>
                        ))}
                    </div>

                    {shake && (
                        <p className="tut-warn" role="alert">
                            ⚠️ Debes seleccionar una opción para continuar.
                        </p>
                    )}
                </div>

                {/* ── FOOTER ── */}
                <div className="tut-footer">
                    <div className="tut-dots" aria-hidden="true">
                        {TUTORIAL_STEPS.map((_, i) => (
                            <span
                                key={i}
                                className={`tut-dot
                                    ${i === currentStep ? "tut-dot--active" : ""}
                                    ${i < currentStep ? "tut-dot--done" : ""}`}
                            />
                        ))}
                    </div>

                    <button
                        className={`tut-btn ${selected ? "tut-btn--ready" : ""}`}
                        onClick={goNext}
                    >
                        {isLast ? "Comenzar pruebas" : "Siguiente"}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* ════════════════════ ESTILOS ════════════════════ */}
            <style>{`
                /* ── Base ── */
                .tut-overlay {
                    position: fixed;
                    inset: 0;
                    z-index: 1060;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    /* padding lateral mínimo para que el modal no toque los bordes */
                    padding: 1rem;
                    background: rgba(8,18,40,.76);
                    backdrop-filter: blur(6px);
                    /* overflow-y para pantallas muy pequeñas */
                    overflow-y: auto;
                    animation: tutFadeIn .35s ease both;
                }
                .tut-overlay--out { animation: tutFadeOut .4s ease both; }
                @keyframes tutFadeIn  { from{opacity:0} to{opacity:1} }
                @keyframes tutFadeOut { from{opacity:1} to{opacity:0} }

                /* ── Card ── */
                .tut-card {
                    background: #fff;
                    border-radius: 20px;
                    width: 100%;
                    /* max-width flexible: en pantallas muy anchas no se estira demasiado */
                    max-width: min(560px, 100%);
                    /* margin: auto garantiza centrado vertical cuando overflow-y: auto actúa */
                    margin: auto;
                    box-shadow: 0 28px 80px rgba(0,0,0,.3);
                    overflow: hidden;
                    animation: tutUp .4s cubic-bezier(.22,1,.36,1) both;
                    /* evitar que el contenido se recorte en pantallas pequeñas */
                    display: flex;
                    flex-direction: column;
                }
                .tut-card--out { animation: tutDown .4s cubic-bezier(.22,1,.36,1) both; }
                @keyframes tutUp {
                    from { opacity:0; transform:translateY(36px) }
                    to   { opacity:1; transform:translateY(0) }
                }
                @keyframes tutDown {
                    from { opacity:1; transform:translateY(0) }
                    to   { opacity:0; transform:translateY(-28px) }
                }

                /* ── Header ── */
                .tut-header {
                    background: linear-gradient(135deg, #1a56db 0%, #0e3fa5 100%);
                    padding: 1.5rem 1.75rem 1.3rem;
                    color: #fff;
                    flex-shrink: 0;
                }
                .tut-badge {
                    display: inline-block;
                    background: rgba(255,255,255,.2);
                    font-size: .68rem;
                    font-weight: 700;
                    letter-spacing: .12em;
                    text-transform: uppercase;
                    padding: .22rem .65rem;
                    border-radius: 999px;
                    margin-bottom: .6rem;
                }
                .tut-title {
                    font-size: clamp(1rem, 4vw, 1.3rem);
                    font-weight: 700;
                    margin: 0 0 .28rem;
                    line-height: 1.3;
                }
                .tut-subtitle {
                    font-size: clamp(.78rem, 2.5vw, .85rem);
                    opacity: .85;
                    margin: 0;
                }

                /* ── Progress ── */
                .tut-prog-wrap {
                    height: 5px;
                    background: #e9ecef;
                    flex-shrink: 0;
                }
                .tut-prog-bar {
                    height: 100%;
                    background: linear-gradient(90deg, #38bdf8, #1a56db);
                    transition: width .55s cubic-bezier(.22,1,.36,1);
                }

                /* ── Meta (label + hint) ── */
                .tut-meta {
                    padding: .9rem 1.75rem .4rem;
                    animation: tutFadeIn .3s ease both;
                    flex-shrink: 0;
                }
                .tut-step-label {
                    display: block;
                    font-size: .72rem;
                    font-weight: 700;
                    color: #1a56db;
                    letter-spacing: .06em;
                    text-transform: uppercase;
                    margin-bottom: .4rem;
                }
                .tut-hint {
                    display: flex;
                    gap: .45rem;
                    align-items: flex-start;
                    font-size: clamp(.75rem, 2.2vw, .8rem);
                    color: #6c757d;
                    line-height: 1.5;
                    background: #f4f7ff;
                    border-left: 3px solid #1a56db;
                    padding: .45rem .7rem;
                    border-radius: 0 6px 6px 0;
                }
                .tut-hint svg { flex-shrink:0; margin-top:1px; color:#1a56db; }

                /* ── Question wrap ──
                   flex: 1 + overflow-y para que en pantallas muy pequeñas
                   las opciones sean desplazables sin que el footer desaparezca  */
                .tut-question-wrap {
                    padding: 1rem 1.75rem .9rem;
                    animation: tutFadeIn .35s ease both;
                    flex: 1;
                    overflow-y: auto;
                    /* webkit para iOS */
                    -webkit-overflow-scrolling: touch;
                }
                .tut-question-text {
                    font-size: clamp(.9rem, 2.8vw, .975rem);
                    font-weight: 600;
                    color: #212529;
                    margin-bottom: .85rem;
                    line-height: 1.55;
                }

                /* ── Options ── */
                .tut-options {
                    display: flex;
                    flex-direction: column;
                    gap: .45rem;
                }
                .tut-opt {
                    display: flex;
                    align-items: flex-start;
                    gap: .65rem;
                    padding: .6rem .85rem;
                    border: 2px solid #dee2e6;
                    border-radius: 10px;
                    cursor: pointer;
                    /* touch target mínimo 44px de alto */
                    min-height: 44px;
                    transition: border-color .18s, background .18s, transform .14s;
                    user-select: none;
                    /* evitar que el tap cambie el fondo en iOS */
                    -webkit-tap-highlight-color: transparent;
                }
                .tut-opt:hover  { border-color:#1a56db; background:#f0f5ff; transform:translateX(3px); }
                .tut-opt--on    { border-color:#1a56db; background:#eef3ff; }
                .tut-opt-radio  { position:absolute; opacity:0; pointer-events:none; }
                .tut-opt-marker {
                    flex-shrink: 0;
                    width: 26px;
                    height: 26px;
                    border-radius: 50%;
                    background: #f1f3f5;
                    border: 2px solid #ced4da;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: .7rem;
                    font-weight: 700;
                    color: #495057;
                    transition: background .18s, border-color .18s, color .18s;
                    /* centrado vertical con el texto */
                    margin-top: 1px;
                }
                .tut-opt--on .tut-opt-marker { background:#1a56db; border-color:#1a56db; color:#fff; }
                .tut-opt-text {
                    font-size: clamp(.8rem, 2.4vw, .86rem);
                    color: #343a40;
                    line-height: 1.5;
                    padding-top: 2px;
                }

                /* ── Warning ── */
                .tut-warn {
                    font-size: .8rem;
                    color: #dc3545;
                    margin: .5rem 0 0;
                    animation: tutFadeIn .2s ease both;
                }

                /* ── Shake ── */
                .tut-shake { animation: tutShake .5s ease both; }
                @keyframes tutShake {
                    0%,100% { transform: translateX(0) }
                    20%     { transform: translateX(-6px) }
                    40%     { transform: translateX(6px) }
                    60%     { transform: translateX(-4px) }
                    80%     { transform: translateX(4px) }
                }

                /* ── Footer ── */
                .tut-footer {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: .85rem 1.75rem 1.3rem;
                    border-top: 1px solid #f1f3f5;
                    flex-shrink: 0;
                    /* safe-area para notch en iPhone */
                    padding-bottom: max(1.3rem, env(safe-area-inset-bottom));
                }
                .tut-dots { display:flex; gap:.4rem; align-items:center; }
                .tut-dot  {
                    width: 8px; height: 8px;
                    border-radius: 50%;
                    background: #dee2e6;
                    transition: background .3s, transform .3s;
                }
                .tut-dot--active { background:#1a56db; transform:scale(1.3); }
                .tut-dot--done   { background:#38bdf8; }

                /* ── Button ── */
                .tut-btn {
                    display: flex;
                    align-items: center;
                    gap: .4rem;
                    padding: .58rem 1.2rem;
                    border: none;
                    border-radius: 10px;
                    background: #e9ecef;
                    color: #6c757d;
                    font-size: clamp(.82rem, 2.4vw, .88rem);
                    font-weight: 600;
                    cursor: pointer;
                    /* touch target mínimo */
                    min-height: 44px;
                    -webkit-tap-highlight-color: transparent;
                    transition: background .2s, color .2s, transform .15s, box-shadow .2s;
                }
                .tut-btn--ready {
                    background: #1a56db;
                    color: #fff;
                    box-shadow: 0 4px 14px rgba(26,86,219,.32);
                }
                .tut-btn--ready:hover {
                    background: #1446b5;
                    transform: translateY(-1px);
                    box-shadow: 0 6px 18px rgba(26,86,219,.42);
                }
                .tut-btn--ready:active { transform: translateY(0); }

                /* ══════════════════════════════════
                   RESPONSIVE — móvil pequeño (≤ 480px)
                   Teléfonos: iPhone SE, Galaxy A series
                ══════════════════════════════════ */
                @media (max-width: 480px) {
                    .tut-overlay {
                        /* en móvil el modal ocupa casi toda la pantalla */
                        align-items: flex-end;
                        padding: 0;
                    }
                    .tut-card {
                        border-radius: 20px 20px 0 0;
                        max-width: 100%;
                        /* altura máxima: deja ~10% visible del overlay como "backdrop drag" */
                        max-height: 92dvh;
                        /* dvh usa la altura visual dinámica (respeta teclado virtual) */
                    }
                    .tut-header { padding: 1.25rem 1.25rem 1.1rem; }
                    .tut-meta   { padding: .8rem 1.25rem .35rem; }
                    .tut-question-wrap { padding: .85rem 1.25rem .75rem; }
                    .tut-footer { padding: .75rem 1.25rem max(1rem, env(safe-area-inset-bottom)); }
                    .tut-opt    { padding: .65rem .75rem; }
                }

                /* ══════════════════════════════════
                   RESPONSIVE — móvil muy pequeño (≤ 360px)
                   Teléfonos: Galaxy A03, iPhone 5
                ══════════════════════════════════ */
                @media (max-width: 360px) {
                    .tut-header { padding: 1rem 1rem .9rem; }
                    .tut-title  { font-size: .95rem; }
                    .tut-meta,
                    .tut-question-wrap { padding-left: 1rem; padding-right: 1rem; }
                    .tut-footer { padding-left: 1rem; padding-right: 1rem; }
                    .tut-opt-marker { width: 22px; height: 22px; font-size: .65rem; }
                    .tut-step-label { font-size: .68rem; }
                }

                /* ══════════════════════════════════
                   RESPONSIVE — landscape móvil (altura < 500px)
                   Teléfonos rotados horizontalmente
                ══════════════════════════════════ */
                @media (max-height: 500px) and (orientation: landscape) {
                    .tut-overlay {
                        align-items: center;
                        padding: .5rem;
                    }
                    .tut-card {
                        border-radius: 14px;
                        max-width: min(640px, 98vw);
                        max-height: 95dvh;
                        /* layout horizontal en landscape */
                        display: grid;
                        grid-template-rows: auto 4px auto 1fr auto;
                    }
                    .tut-header  { padding: .85rem 1.5rem .75rem; }
                    .tut-meta    { padding: .55rem 1.5rem .3rem; }
                    .tut-question-wrap { padding: .55rem 1.5rem .5rem; }
                    .tut-footer  { padding: .6rem 1.5rem .75rem; }
                    .tut-title   { font-size: 1rem; margin-bottom: .1rem; }
                    .tut-subtitle { display: none; }
                    .tut-opt     { padding: .5rem .75rem; min-height: 38px; }
                    .tut-question-text { margin-bottom: .6rem; }
                }

                /* ══════════════════════════════════
                   RESPONSIVE — tablet (481 – 768px)
                   Centra y limita el ancho
                ══════════════════════════════════ */
                @media (min-width: 481px) and (max-width: 768px) {
                    .tut-overlay { align-items: center; padding: 1.25rem; }
                    .tut-card    { border-radius: 18px; max-width: 500px; max-height: 90dvh; }
                }
            `}</style>
        </div>
    );
};

export default TutorialModal;