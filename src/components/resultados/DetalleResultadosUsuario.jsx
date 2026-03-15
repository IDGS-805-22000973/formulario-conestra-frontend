import React, { useState } from "react";
import DetalleFormulario from "./DetalleFormulario";

const IconUser = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
    </svg>
);
const IconCal = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
);
const IconGender = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4"/>
        <path d="M12 2v4M12 18v4"/>
    </svg>
);
const IconClipboard = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
    </svg>
);

const getInitials = (nombre = "") => {
    const p = nombre.trim().split(" ");
    return p.length >= 2 ? (p[0][0] + p[1][0]).toUpperCase() : nombre.substring(0, 2).toUpperCase();
};

/* ── Props:
     data → { usuario: { nombre, edad, sexo, correo }, formularios: [{id, testType, ...}] }
─────────────────────────────────────────────── */
const DetalleResultadosUsuario = ({ data }) => {
    const [formularioSeleccionado, setFormularioSeleccionado] = useState(null);

    if (!data) return null;

    const { usuario, formularios } = data;

    return (
        <main className="res-main">
            {/* Topbar con datos del usuario */}
            <div className="res-topbar">
                <div className="res-topbar-left">
                    <div style={{ display:"flex", alignItems:"center", gap:".85rem", marginBottom:".35rem" }}>
                        <div style={{
                            width:46, height:46, borderRadius:"50%",
                            background:"linear-gradient(135deg,#0f2154,#2563eb)",
                            color:"#fff", display:"flex", alignItems:"center", justifyContent:"center",
                            fontSize:".9rem", fontWeight:700, flexShrink:0
                        }}>
                            {getInitials(usuario.nombre)}
                        </div>
                        <h2 className="res-topbar-name">{usuario.nombre}</h2>
                    </div>
                    <div className="res-topbar-meta">
                        <span className="res-meta-chip"><IconCal />{usuario.edad} años</span>
                        <span className="res-meta-chip">
                            <IconGender />
                            {usuario.sexo === "M" ? "Masculino" : "Femenino"}
                        </span>
                        {usuario.correo && (
                            <span className="res-meta-chip">
                                <IconUser />
                                {usuario.correo}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Tabs de formularios */}
            <div className="res-tabs">
                {formularios.map((f) => (
                    <button
                        key={f.id}
                        className={`res-tab ${formularioSeleccionado?.id === f.id ? "res-tab--active" : ""}`}
                        onClick={() => setFormularioSeleccionado(
                            formularioSeleccionado?.id === f.id ? null : f
                        )}
                    >
                        {f.testType}
                    </button>
                ))}
            </div>

            {/* Cuerpo: detalle del formulario o empty state */}
            <div className="res-body">
                {formularioSeleccionado ? (
                    <DetalleFormulario formulario={formularioSeleccionado} />
                ) : (
                    <div className="res-empty-state">
                        <div className="res-empty-icon"><IconClipboard /></div>
                        <p className="res-empty-title">Selecciona un cuestionario</p>
                        <p className="res-empty-sub">
                            Elige una de las pestañas de arriba para ver sus resultados detallados.
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
};

export default DetalleResultadosUsuario;