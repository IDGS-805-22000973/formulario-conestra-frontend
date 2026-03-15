import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { loginService } from "../services/authService";
import logo from "../assets/Logo2.png";
import "../styles/Login.css";

const IconMail = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);
const IconLock = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const IconEyeOff = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);
const IconEye = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const IconArrow = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);
const IconAlert = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const LoginPage = () => {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await loginService(correo, password);
      login(data.access_token, data.user);
      navigate(data.user.role === "admin" ? "/admin/users" : "/formularios");
    } catch (err) {
      setError(err.message || "Credenciales incorrectas. Verifica e intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const dots = Array.from({ length: 35 });

  return (
    <main className="ln-root">

      {/* ══════════ PANEL IZQUIERDO ══════════ */}
      <section className="ln-panel-left" aria-hidden="true">
        <div className="ln-geo" aria-hidden="true">
          <div className="ln-geo-ring" />
          <div className="ln-geo-dot-grid">
            {dots.map((_, i) => <span key={i} />)}
          </div>
        </div>

        {/* Logo izquierdo — sin filtro, se ve sobre el fondo oscuro */}
        <div className="ln-left-logo">
          <img src={logo} alt="Conestra" />
        </div>

        <div className="ln-left-body">
          <div className="ln-tagline-eyebrow">
            <span className="ln-eyebrow-line" />
            <span className="ln-eyebrow-text">Plataforma de evaluación</span>
          </div>
          <h1 className="ln-headline">
            Talento que impulsa <em>el crecimiento</em> de tu empresa
          </h1>
          <p className="ln-subheadline">
            Brindamos soluciones e innovación a través del talento específico
            para tu empresa con calidad y profesionalismo.
          </p>
        </div>

        <div className="ln-stats">
          <div className="ln-stat-item">
            <span className="ln-stat-value">+500</span>
            <span className="ln-stat-label">Evaluaciones realizadas</span>
          </div>
          <div className="ln-stat-item">
            <span className="ln-stat-value">2</span>
            <span className="ln-stat-label">Pruebas disponibles</span>
          </div>
          <div className="ln-stat-item">
            <span className="ln-stat-value">100%</span>
            <span className="ln-stat-label">Resultados confiables</span>
          </div>
        </div>
      </section>

      {/* ══════════ PANEL DERECHO ══════════ */}
      <section className="ln-panel-right">
        <div className="ln-form-box">

          <header className="ln-form-header">
            {/*
                          Logo visible siempre en el panel derecho.
                          En desktop se muestra encima del título.
                          En tablet/móvil (cuando el panel izquierdo se oculta) también aparece.
                          ── FIX: quitamos el style display:none ──
                        */}
            <img
              src={logo}
              alt="Conestra"
              className="ln-form-logo"
            />
            <h2 className="ln-form-title">Bienvenido de nuevo</h2>
            <p className="ln-form-subtitle">Ingresa tus credenciales para continuar</p>
          </header>

          {error && (
            <div className="ln-alert" role="alert" aria-live="assertive">
              <span className="ln-alert-icon"><IconAlert /></span>
              <span className="ln-alert-text">{error}</span>
              <button
                className="ln-alert-close"
                onClick={() => setError(null)}
                aria-label="Cerrar mensaje de error"
              >✕</button>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="ln-fields">

              <div className="ln-field">
                <label htmlFor="ln-email" className="ln-label">Correo electrónico</label>
                <div className="ln-input-wrap">
                  <span className="ln-input-icon"><IconMail /></span>
                  <input
                    id="ln-email"
                    type="email"
                    className="ln-input"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    placeholder="ejemplo@correo.com"
                    autoComplete="email"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="ln-field">
                <label htmlFor="ln-password" className="ln-label">Contraseña</label>
                <div className="ln-input-wrap">
                  <span className="ln-input-icon"><IconLock /></span>
                  <input
                    id="ln-password"
                    type={showPassword ? "text" : "password"}
                    className="ln-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="ln-eye-btn"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    tabIndex={-1}
                  >
                    {showPassword ? <IconEyeOff /> : <IconEye />}
                  </button>
                </div>
              </div>

            </div>

            <button
              type="submit"
              className="ln-submit-btn"
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? (
                <><span className="ln-spinner" aria-hidden="true" />Verificando…</>
              ) : (
                <>Ingresar<IconArrow /></>
              )}
            </button>
          </form>

          <footer className="ln-form-footer">
            <p className="ln-footer-text">
              © {new Date().getFullYear()}&nbsp;
              <span className="ln-footer-brand">Conestra</span>
              &nbsp;· Todos los derechos reservados
            </p>
          </footer>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;