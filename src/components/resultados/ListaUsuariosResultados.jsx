import React, { useState, useMemo } from "react";

const getInitials = (nombre = "") => {
    const p = nombre.trim().split(" ");
    return p.length >= 2 ? (p[0][0] + p[1][0]).toUpperCase() : nombre.substring(0, 2).toUpperCase();
};

const IconSearch = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);

const IconInbox = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
        <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 17 4H7a2 2 0 0 0-1.55.76z" />
    </svg>
);

/* ── Props:
     usuarios → array de objetos { usuario: { id, nombre, correo, edad, sexo }, formularios: [...] }
     onSelect → fn(item)
     selectedId → id del usuario activo (para highlight)
─────────────────────────────────────────────── */
const ListaUsuariosResultados = ({ usuarios, onSelect, selectedId }) => {
    const [textoBusqueda, setTextoBusqueda] = useState("");

    const usuariosFiltrados = useMemo(() => {
        if (!textoBusqueda.trim()) return usuarios;
        const t = textoBusqueda.toLowerCase();
        return usuarios.filter((u) => u.usuario.nombre.toLowerCase().includes(t));
    }, [usuarios, textoBusqueda]);

    return (
        <aside className="res-sidebar">
            {/* Header */}
            <div className="res-sidebar-header">
                <div className="res-sidebar-eyebrow">
                    <span className="res-sidebar-eyebrow-line" />
                    <span className="res-sidebar-eyebrow-text">Resultados</span>
                </div>
                <h2 className="res-sidebar-title">Usuarios</h2>

                <div className="res-search-wrap">
                    <span className="res-search-icon"><IconSearch /></span>
                    <input
                        type="text"
                        className="res-search-input"
                        placeholder="Buscar por nombre…"
                        value={textoBusqueda}
                        onChange={(e) => setTextoBusqueda(e.target.value)}
                    />
                </div>
            </div>

            {/* Lista */}
            <div className="res-sidebar-list">
                {usuariosFiltrados.length === 0 && (
                    <div className="res-sidebar-empty">
                        <IconInbox />
                        <span>No se encontraron usuarios</span>
                    </div>
                )}

                {usuariosFiltrados.map((u) => (
                    <div
                        key={u.usuario.id}
                        className={`res-user-card ${selectedId === u.usuario.id ? "res-user-card--active" : ""}`}
                        onClick={() => onSelect(u)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === "Enter" && onSelect(u)}
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
    );
};

export default ListaUsuariosResultados;