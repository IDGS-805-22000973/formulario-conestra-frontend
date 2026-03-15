import React, { useEffect, useMemo, useState } from "react";
import { obtenerTodosLosResultados } from "../services/testService";
import {
  descargarResultadosMossPDF,
  descargarResultados16PFPDF,
} from "../utils/descargarResultadosPDF";
import Navbar from "../components/Navbar";
import "../styles/ResultadosUsuariosPage.css";

/* ══════════════════════════════════════════════
   ICONOS SVG inline
══════════════════════════════════════════════ */
const IC = {
  Search: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
  Download: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>,
  Inbox: () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12" /><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 17 4H7a2 2 0 0 0-1.55.76z" /></svg>,
  Chart: () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>,
  Click: () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18" /></svg>,
  User: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
  Cal: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
  Gender: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v4M12 18v4" /></svg>,
};

/* ── Iniciales desde nombre ── */
const getInitials = (nombre = "") => {
  const p = nombre.trim().split(" ");
  return p.length >= 2 ? (p[0][0] + p[1][0]).toUpperCase() : nombre.substring(0, 2).toUpperCase();
};

/* ══════════════════════════════════════════════
   SUB-COMPONENTE: Barra de resultado
══════════════════════════════════════════════ */
const BarraResultado = ({ nombre, valor, max }) => {
  const pct = Math.min(Math.round((valor / max) * 100), 100);
  return (
    <div className="res-bar-card">
      <div className="res-bar-header">
        <span className="res-bar-label">{nombre}</span>
        <span className="res-bar-value">{valor}</span>
      </div>
      <div className="res-bar-track">
        <div className="res-bar-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════
   SUB-COMPONENTE: Vista 16PF
══════════════════════════════════════════════ */
const Vista16PF = ({ resultados }) => {
  const decatipos = resultados?.decatipos || {};
  const puntajes = resultados?.puntajesBrutos || {};

  return (
    <div>
      {/* Decatipos */}
      {Object.keys(decatipos).length > 0 && (
        <>
          <p className="res-section-subtitle">Decatipos</p>
          <div className="res-bars-grid">
            {Object.entries(decatipos).map(([factor, valor]) => (
              <BarraResultado key={factor} nombre={factor} valor={valor} max={10} />
            ))}
          </div>
        </>
      )}

      {/* Puntajes brutos */}
      {Object.keys(puntajes).length > 0 && (
        <>
          <p className="res-section-subtitle" style={{ marginTop: "1.25rem" }}>
            Puntajes brutos
          </p>
          <div className="res-bars-grid">
            {Object.entries(puntajes).map(([factor, valor]) => (
              <BarraResultado key={factor} nombre={factor} valor={valor} max={20} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════
   SUB-COMPONENTE: Vista MOSS
══════════════════════════════════════════════ */
const NOMBRES_AREAS = {
  decision: "Toma de decisiones",
  evaluacion: "Evaluación",
  relaciones: "Relaciones humanas",
  supervision: "Supervisión",
  sentidoComun: "Sentido común",
};

const VistaMoss = ({ resultados }) => {
  if (!resultados) return <p style={{ color: "#94a3b8", fontSize: ".875rem" }}>Sin resultados calculados.</p>;

  const areas = resultados?.areas || {};
  const totalAciertos = resultados?.totalAciertos;

  return (
    <div>
      {/* Total */}
      <div className="res-total-box">
        <span className="res-total-label">Total de aciertos</span>
        <span className="res-total-value">{totalAciertos ?? "N/A"}</span>
      </div>

      {/* Grid de áreas */}
      <div className="res-moss-grid">
        {Object.entries(areas).map(([areaKey, datos]) => (
          <div key={areaKey} className="res-moss-card">
            <div className="res-moss-card-header">
              {NOMBRES_AREAS[areaKey] || areaKey}
            </div>
            <div className="res-moss-card-body">
              {Object.entries(datos).map(([k, v]) => (
                <div key={k} className="res-moss-row">
                  <span className="res-moss-label">{k}</span>
                  <span className="res-moss-value">{String(v)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════
   COMPONENTE PRINCIPAL
══════════════════════════════════════════════ */
const ResultadosUsuariosPage = () => {
  const [resultados, setResultados] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [testSeleccionado, setTestSeleccionado] = useState("16PF");
  const [textoBusqueda, setTextoBusqueda] = useState("");

  /* ── Carga de datos ── */
  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await obtenerTodosLosResultados();
        setResultados(data);
      } catch (error) {
        console.error(error);
      }
    };
    cargar();
  }, []);

  /* ── Agrupar resultados por usuario ── */
  const usuariosAgrupados = useMemo(() => {
    const agrupado = resultados.reduce((acc, r) => {
      if (!r.user) return acc;
      const userId = r.user.id;
      if (!acc[userId]) {
        acc[userId] = { usuario: r.user, tests: [] };
      }
      acc[userId].tests.push(r);
      return acc;
    }, {});
    return Object.values(agrupado);
  }, [resultados]);

  /* ── Filtrado por búsqueda ── */
  const usuariosFiltrados = useMemo(() => {
    if (!textoBusqueda.trim()) return usuariosAgrupados;
    const texto = textoBusqueda.toLowerCase();
    return usuariosAgrupados.filter((u) =>
      u.usuario.nombre.toLowerCase().includes(texto)
    );
  }, [usuariosAgrupados, textoBusqueda]);

  /* ── Test activo ── */
  const obtenerTestUsuario = (testType) => {
    if (!usuarioSeleccionado) return null;
    return usuarioSeleccionado.tests.find((t) => t.testType === testType);
  };
  const testActual = obtenerTestUsuario(testSeleccionado);

  /* ── Seleccionar usuario ── */
  const handleSelectUsuario = (u) => {
    setUsuarioSeleccionado(u);
    setTestSeleccionado("16PF");
  };

  /* ════════════════ RENDER ════════════════ */
  return (
    <>
      <Navbar />

      <div className="res-root">

        {/* ══════════ SIDEBAR ══════════ */}
        <aside className="res-sidebar">
          <div className="res-sidebar-header">
            <div className="res-sidebar-eyebrow">
              <span className="res-sidebar-eyebrow-line" />
              <span className="res-sidebar-eyebrow-text">Resultados</span>
            </div>
            <h2 className="res-sidebar-title">Usuarios</h2>

            <div className="res-search-wrap">
              <span className="res-search-icon"><IC.Search /></span>
              <input
                type="text"
                className="res-search-input"
                placeholder="Buscar por nombre…"
                value={textoBusqueda}
                onChange={(e) => setTextoBusqueda(e.target.value)}
              />
            </div>
          </div>

          <div className="res-sidebar-list">
            {usuariosFiltrados.length === 0 && (
              <div className="res-sidebar-empty">
                <IC.Inbox />
                <span>No se encontraron usuarios</span>
              </div>
            )}

            {usuariosFiltrados.map((u) => (
              <div
                key={u.usuario.id}
                className={`res-user-card ${usuarioSeleccionado?.usuario.id === u.usuario.id ? "res-user-card--active" : ""}`}
                onClick={() => handleSelectUsuario(u)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && handleSelectUsuario(u)}
              >
                <div className="res-user-avatar">
                  {getInitials(u.usuario.nombre)}
                </div>
                <div className="res-user-card-info">
                  <p className="res-user-card-name">{u.usuario.nombre}</p>
                  <p className="res-user-card-email">{u.usuario.correo}</p>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* ══════════ CONTENIDO PRINCIPAL ══════════ */}
        <div className="res-main">

          {/* ── Sin usuario seleccionado ── */}
          {!usuarioSeleccionado ? (
            <div className="res-empty-state">
              <div className="res-empty-icon"><IC.Click /></div>
              <p className="res-empty-title">Selecciona un usuario</p>
              <p className="res-empty-sub">Para visualizar sus resultados en 16PF o MOSS.</p>
            </div>
          ) : (
            <>
              {/* ── Topbar ── */}
              <div className="res-topbar">
                <div className="res-topbar-left">
                  <div style={{ display: "flex", alignItems: "center", gap: ".85rem", marginBottom: ".35rem" }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: "50%",
                      background: "linear-gradient(135deg,#0f2154,#2563eb)",
                      color: "#fff", display: "flex", alignItems: "center",
                      justifyContent: "center", fontSize: ".85rem", fontWeight: 700, flexShrink: 0
                    }}>
                      {getInitials(usuarioSeleccionado.usuario.nombre)}
                    </div>
                    <h2 className="res-topbar-name">
                      {usuarioSeleccionado.usuario.nombre}
                    </h2>
                  </div>
                  <div className="res-topbar-meta">
                    <span className="res-meta-chip">
                      <IC.User />{usuarioSeleccionado.usuario.correo}
                    </span>
                    <span className="res-meta-chip">
                      <IC.Cal />{usuarioSeleccionado.usuario.edad} años
                    </span>
                    <span className="res-meta-chip">
                      <IC.Gender />
                      {usuarioSeleccionado.usuario.sexo === "M" ? "Masculino" : "Femenino"}
                    </span>
                  </div>
                </div>

                <div className="res-topbar-actions">
                  {testActual && (
                    <button
                      className="res-btn-download"
                      onClick={() => {
                        if (testActual.testType === "MOSS") {
                          descargarResultadosMossPDF(
                            usuarioSeleccionado.usuario,
                            testActual.calculatedResults
                          );
                        } else if (testActual.testType === "16PF") {
                          descargarResultados16PFPDF(
                            usuarioSeleccionado.usuario,
                            testActual.calculatedResults
                          );
                        }
                      }}
                    >
                      <IC.Download /> Descargar PDF
                    </button>
                  )}
                </div>
              </div>

              {/* ── Tabs ── */}
              <div className="res-tabs">
                {["16PF", "MOSS"].map((tipo) => (
                  <button
                    key={tipo}
                    className={`res-tab ${testSeleccionado === tipo ? "res-tab--active" : ""}`}
                    onClick={() => setTestSeleccionado(tipo)}
                  >
                    {tipo}
                  </button>
                ))}
              </div>

              {/* ── Panel de resultados ── */}
              <div className="res-body">
                {!testActual ? (
                  /* Sin resultados para este test */
                  <div className="res-empty-state" style={{ height: "auto", padding: "3rem 2rem" }}>
                    <div className="res-empty-icon"><IC.Chart /></div>
                    <p className="res-empty-title">Sin resultados</p>
                    <p className="res-empty-sub">
                      Este usuario aún no ha contestado el test {testSeleccionado}.
                    </p>
                  </div>
                ) : (
                  <div className="res-panel-grid">

                    {/* ── Resumen ── */}
                    <div className="res-card">
                      <div className="res-card-header">
                        <h3 className="res-card-title">Resumen</h3>
                        <span className="res-card-badge">{testActual.testType}</span>
                      </div>
                      <div className="res-card-body">
                        <div className="res-summary-grid">
                          <div className="res-summary-item">
                            <p className="res-summary-label">ID Respuesta</p>
                            <p className="res-summary-value">{testActual.id}</p>
                          </div>
                          <div className="res-summary-item">
                            <p className="res-summary-label">Tipo de test</p>
                            <p className="res-summary-value">{testActual.testType}</p>
                          </div>
                          <div className="res-summary-item">
                            <p className="res-summary-label">Usuario ID</p>
                            <p className="res-summary-value">{testActual.userId}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ── Resultados calculados ── */}
                    <div className="res-card">
                      <div className="res-card-header">
                        <h3 className="res-card-title">Resultados calculados</h3>
                      </div>
                      <div className="res-card-body">
                        {testActual.testType === "16PF" ? (
                          <Vista16PF resultados={testActual.calculatedResults} />
                        ) : (
                          <VistaMoss resultados={testActual.calculatedResults} />
                        )}
                      </div>
                    </div>

                    {/* ── Respuestas ── */}
                    <div className="res-card">
                      <div className="res-card-header">
                        <h3 className="res-card-title">Respuestas del usuario</h3>
                        <span className="res-card-badge">
                          {Object.keys(testActual.answers).length} ítems
                        </span>
                      </div>
                      <div className="res-card-body">
                        <div className="res-answers-grid">
                          {Object.entries(testActual.answers).map(([key, value]) => (
                            <div key={key} className="res-answer-item">
                              <span className="res-answer-q">{key}</span>
                              <span className="res-answer-v">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ResultadosUsuariosPage;