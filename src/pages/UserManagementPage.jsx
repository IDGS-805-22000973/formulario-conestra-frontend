import React, { useContext, useEffect, useMemo, useState } from "react";
import {
    getAllUsers,
    getDeletedUsers,
    deleteUser,
    createUser,
    restoreUser,
    updateUser,
} from "../services/usersService";
import { AuthContext } from "../context/AuthContext";
import FormUser from "../components/Usuario/FormUser";
import ListUser from "../components/Usuario/ListUser";
import Navbar from "../components/Navbar";
import "../styles/UserManagementPage.css";

/* ── SVG icons ── */
const IconAlert = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
);

const IconTrashConfirm = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        <path d="M10 11v6M14 11v6M9 6V4h6v2" />
    </svg>
);

const IconRestoreConfirm = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
    </svg>
);

/* ════════════════════════════════════════════
   COMPONENTE PRINCIPAL
════════════════════════════════════════════ */
const UserManagementPage = () => {
    const { user } = useContext(AuthContext);
    const currentUserId = user?.sub || user?.id || null;

    const [usuariosActivos, setUsuariosActivos] = useState([]);
    const [usuariosEliminados, setUsuariosEliminados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [usuarioEditar, setUsuarioEditar] = useState(null);

    /* Filtros */
    const [filtroEstado, setFiltroEstado] = useState("activos");
    const [filtroRol, setFiltroRol] = useState("todos");

    /* Modal y toast */
    const [modalConfirm, setModalConfirm] = useState({ show: false, type: "", userId: null });
    const [toast, setToast] = useState({ show: false, message: "", type: "" });

    /* ── Carga de usuarios ── */
    const loadUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const [activos, eliminados] = await Promise.all([getAllUsers(), getDeletedUsers()]);
            setUsuariosActivos(activos);
            setUsuariosEliminados(eliminados);
        } catch (err) {
            setError(err.message || "Error al obtener usuarios");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadUsers(); }, []);

    /* ── Lista filtrada ── */
    const usuariosCombinados = useMemo(() => {
        let lista =
            filtroEstado === "activos" ? usuariosActivos :
                filtroEstado === "eliminados" ? usuariosEliminados :
                    [...usuariosActivos, ...usuariosEliminados];

        if (filtroRol !== "todos") lista = lista.filter((u) => u.role === filtroRol);
        return lista;
    }, [usuariosActivos, usuariosEliminados, filtroEstado, filtroRol]);

    /* ── Toast helper ── */
    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
    };

    /* ── Handlers de acciones ── */
    const handleDelete = (id) => setModalConfirm({ show: true, type: "delete", userId: id });
    const handleRestore = (id) => setModalConfirm({ show: true, type: "restore", userId: id });

    const closeModal = () => setModalConfirm({ show: false, type: "", userId: null });

    const confirmAction = async () => {
        const { type, userId } = modalConfirm;
        closeModal();
        try {
            if (type === "delete") { await deleteUser(userId); showToast("Usuario eliminado", "success"); }
            if (type === "restore") { await restoreUser(userId); showToast("Usuario restaurado", "success"); }
            loadUsers();
        } catch (err) {
            showToast(err.message || "Error al procesar la acción", "error");
        }
    };

    const handleSubmitUser = async (nuevoUsuario) => {
        try {
            if (nuevoUsuario.id) {
                const { id, ...datos } = nuevoUsuario;
                await updateUser(id, datos);
                showToast("Usuario actualizado correctamente", "success");
                setUsuarioEditar(null);
            } else {
                await createUser(nuevoUsuario);
                showToast("Usuario creado correctamente", "success");
            }
            loadUsers();
        } catch (err) {
            showToast(err.message || "Error al procesar usuario", "error");
        }
    };

    /* ── Loading screen ── */
    if (loading) {
        return (
            <div className="um-page">
                <Navbar />
                <div className="um-loading">
                    <div className="um-loading-spinner" aria-hidden="true" />
                    <p className="um-loading-text">Cargando usuarios…</p>
                </div>
            </div>
        );
    }

    /* ════════════════ RENDER ════════════════ */
    return (
        <div className="um-page">
            <Navbar />

            <div className="um-page-inner">

                {/* ── ENCABEZADO ── */}
                <header className="um-page-header">
                    <div className="um-page-header-left">
                        <div className="um-page-eyebrow">
                            <span className="um-page-eyebrow-line" />
                            <span className="um-page-eyebrow-text">Panel de administración</span>
                        </div>
                        <h1 className="um-page-title">Gestión de Usuarios</h1>
                    </div>

                    <div className="um-page-meta">
                        <div className="um-stat-chip">
                            <span className="um-stat-chip-value">{usuariosActivos.length}</span>
                            <span className="um-stat-chip-label">Activos</span>
                        </div>
                        <div className="um-stat-chip">
                            <span className="um-stat-chip-value">{usuariosEliminados.length}</span>
                            <span className="um-stat-chip-label">Eliminados</span>
                        </div>
                    </div>
                </header>

                {/* ── ERROR ── */}
                {error && (
                    <div className="um-alert-error" role="alert">
                        <IconAlert />
                        {error}
                    </div>
                )}

                {/* ── GRID PRINCIPAL ── */}
                <div className="um-grid">

                    {/* COLUMNA IZQUIERDA — Filtros + Lista */}
                    <div>
                        <div className="um-card">
                            {/* Cabecera lista */}
                            <div className="um-card-header">
                                <div>
                                    <h2 className="um-card-title">Directorio de usuarios</h2>
                                    <p className="um-card-subtitle">
                                        {usuariosCombinados.length} usuario{usuariosCombinados.length !== 1 ? "s" : ""} encontrado{usuariosCombinados.length !== 1 ? "s" : ""}
                                    </p>
                                </div>
                            </div>

                            {/* Filtros */}
                            <div className="um-filters">
                                <div className="um-filter-group">
                                    <label htmlFor="filtro-estado" className="um-filter-label">Estado</label>
                                    <select
                                        id="filtro-estado"
                                        className="um-select"
                                        value={filtroEstado}
                                        onChange={(e) => setFiltroEstado(e.target.value)}
                                    >
                                        <option value="activos">Activos</option>
                                        <option value="eliminados">Eliminados</option>
                                        <option value="todos">Todos</option>
                                    </select>
                                </div>

                                <div className="um-filter-group">
                                    <label htmlFor="filtro-rol" className="um-filter-label">Rol</label>
                                    <select
                                        id="filtro-rol"
                                        className="um-select"
                                        value={filtroRol}
                                        onChange={(e) => setFiltroRol(e.target.value)}
                                    >
                                        <option value="todos">Todos los roles</option>
                                        <option value="admin">Administrador</option>
                                        <option value="user">Usuario</option>
                                    </select>
                                </div>
                            </div>

                            {/* Lista */}
                            <ListUser
                                users={usuariosCombinados}
                                onDelete={handleDelete}
                                onRestore={handleRestore}
                                onEdit={setUsuarioEditar}
                                currentUserId={currentUserId}
                            />
                        </div>
                    </div>

                    {/* COLUMNA DERECHA — Formulario */}
                    <div>
                        <FormUser
                            onSubmit={handleSubmitUser}
                            usuarioEditar={usuarioEditar}
                            onCancel={() => setUsuarioEditar(null)}
                        />
                    </div>
                </div>
            </div>

            {/* ════════ MODAL CONFIRMACIÓN ════════ */}
            {modalConfirm.show && (
                <div className="um-modal-overlay" role="dialog" aria-modal="true">
                    <div className="um-modal-card">
                        <div className={`um-modal-header um-modal-header--${modalConfirm.type}`}>
                            <h3 className="um-modal-title">
                                {modalConfirm.type === "delete"
                                    ? "Confirmar eliminación"
                                    : "Confirmar restauración"}
                            </h3>
                            <button className="um-modal-close" onClick={closeModal} aria-label="Cerrar">✕</button>
                        </div>
                        <div className="um-modal-body">
                            <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                                <div style={{
                                    flexShrink: 0, width: 44, height: 44, borderRadius: "50%",
                                    background: modalConfirm.type === "delete" ? "var(--um-error-pale)" : "var(--um-blue-pale)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    color: modalConfirm.type === "delete" ? "var(--um-error)" : "var(--um-blue)"
                                }}>
                                    {modalConfirm.type === "delete" ? <IconTrashConfirm /> : <IconRestoreConfirm />}
                                </div>
                                <p style={{ margin: 0 }}>
                                    {modalConfirm.type === "delete"
                                        ? "¿Estás seguro de que deseas eliminar este usuario? Esta acción se puede revertir posteriormente desde el filtro de eliminados."
                                        : "¿Deseas restaurar este usuario? Volverá a estar activo en el sistema inmediatamente."}
                                </p>
                            </div>
                        </div>
                        <div className="um-modal-footer">
                            <button className="um-btn um-btn--ghost" onClick={closeModal}>
                                Cancelar
                            </button>
                            <button
                                className={`um-btn ${modalConfirm.type === "delete" ? "" : "um-btn--primary"}`}
                                style={modalConfirm.type === "delete" ? {
                                    background: "linear-gradient(135deg, #dc2626, #b91c1c)",
                                    color: "#fff", boxShadow: "0 4px 14px rgba(220,38,38,.28)"
                                } : {}}
                                onClick={confirmAction}
                            >
                                {modalConfirm.type === "delete" ? "Sí, eliminar" : "Sí, restaurar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ════════ TOAST ════════ */}
            {toast.show && (
                <div className="um-toast-wrap" role="status" aria-live="polite">
                    <div className={`um-toast um-toast--${toast.type}`}>
                        <span>{toast.message}</span>
                        <button
                            className="um-toast-close"
                            onClick={() => setToast({ show: false, message: "", type: "" })}
                            aria-label="Cerrar"
                        >✕</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagementPage;