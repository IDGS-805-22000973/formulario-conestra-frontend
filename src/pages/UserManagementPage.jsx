import React, { useEffect, useMemo, useState } from "react";
import {
    getAllUsers,
    getDeletedUsers,
    deleteUser,
    createUser,
    restoreUser,
} from "../services/usersService";

import FormUser from "../components/Usuario/FormUser";
import ListUser from "../components/Usuario/ListUser";
import Navbar from "../components/Navbar";
import "../styles/UserManagementPage.css";

const UserManagementPage = () => {
    const [usuariosActivos, setUsuariosActivos] = useState([]);
    const [usuariosEliminados, setUsuariosEliminados] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [usuarioEditar, setUsuarioEditar] = useState(null);

    // filtros
    const [filtroEstado, setFiltroEstado] = useState("activos");
    const [filtroRol, setFiltroRol] = useState("todos");

    // Estados para modales y toasts
    const [modalConfirm, setModalConfirm] = useState({ show: false, type: '', userId: null });
    const [toast, setToast] = useState({ show: false, message: '', type: '' });

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);

            const [activos, eliminados] = await Promise.all([
                getAllUsers(),
                getDeletedUsers(),
            ]);

            setUsuariosActivos(activos);
            setUsuariosEliminados(eliminados);
        } catch (err) {
            setError(err.message || "Error al obtener usuarios");
        } finally {
            setLoading(false);
        }
    };

    const usuariosCombinados = useMemo(() => {
        let lista = [];

        if (filtroEstado === "activos") lista = usuariosActivos;
        if (filtroEstado === "eliminados") lista = usuariosEliminados;
        if (filtroEstado === "todos") lista = [...usuariosActivos, ...usuariosEliminados];

        if (filtroRol !== "todos") {
            lista = lista.filter((u) => u.role === filtroRol);
        }

        return lista;
    }, [usuariosActivos, usuariosEliminados, filtroEstado, filtroRol]);

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
    };

    const handleDelete = (id) => {
        setModalConfirm({ show: true, type: 'delete', userId: id });
    };

    const handleRestore = (id) => {
        setModalConfirm({ show: true, type: 'restore', userId: id });
    };

    const confirmAction = async () => {
        const { type, userId } = modalConfirm;
        setModalConfirm({ show: false, type: '', userId: null });

        try {
            if (type === 'delete') {
                await deleteUser(userId);
                showToast('Usuario eliminado con éxito', 'success');
            } else if (type === 'restore') {
                await restoreUser(userId);
                showToast('Usuario restaurado correctamente', 'success');
            }
            loadUsers();
        } catch (err) {
            showToast(err.message || 'Error al procesar la acción', 'error');
        }
    };

    const handleSubmitUser = async (nuevoUsuario) => {
        try {
            await createUser(nuevoUsuario);
            showToast('Usuario creado correctamente', 'success');
            loadUsers();
        } catch (err) {
            showToast(err.message || 'Error al crear usuario', 'error');
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="container mt-5">
                    <div className="text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                        <p className="mt-3">Cargando usuarios...</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <div className="container-fluid mt-4 px-4">
                <div className="page-header-simple">
                    <h2>Gestión de Usuarios</h2>
                </div>

                {error && <div className="alert alert-danger">{error}</div>}

                <div className="row g-4">
                    {/* COLUMNA IZQUIERDA - LISTA Y FILTROS */}
                    <div className="col-lg-8">
                        {/* FILTROS */}
                        <div className="filters-simple mb-3">
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label">Estado</label>
                                    <select
                                        className="form-select"
                                        value={filtroEstado}
                                        onChange={(e) => setFiltroEstado(e.target.value)}
                                    >
                                        <option value="activos">Activos</option>
                                        <option value="eliminados">Eliminados</option>
                                        <option value="todos">Todos</option>
                                    </select>
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">Rol</label>
                                    <select
                                        className="form-select"
                                        value={filtroRol}
                                        onChange={(e) => setFiltroRol(e.target.value)}
                                    >
                                        <option value="todos">Todos</option>
                                        <option value="admin">Admin</option>
                                        <option value="user">User</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* LISTA DE USUARIOS */}
                        <ListUser
                            users={usuariosCombinados}
                            onDelete={handleDelete}
                            onRestore={handleRestore}
                        />
                    </div>

                    {/* COLUMNA DERECHA - FORMULARIO */}
                    <div className="col-lg-4">
                        <FormUser
                            onSubmit={handleSubmitUser}
                            usuarioEditar={usuarioEditar}
                            onCancel={() => setUsuarioEditar(null)}
                        />
                    </div>
                </div>
            </div>

            {/* MODAL DE CONFIRMACIÓN */}
            {modalConfirm.show && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {modalConfirm.type === 'delete' ? 'Confirmar Eliminación' : 'Confirmar Restauración'}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setModalConfirm({ show: false, type: '', userId: null })}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <p>
                                    {modalConfirm.type === 'delete'
                                        ? '¿Estás seguro de que deseas eliminar este usuario? Esta acción se puede revertir posteriormente.'
                                        : '¿Deseas restaurar este usuario? Volverá a estar activo en el sistema.'}
                                </p>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setModalConfirm({ show: false, type: '', userId: null })}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    className={`btn ${modalConfirm.type === 'delete' ? 'btn-danger' : 'btn-primary'}`}
                                    onClick={confirmAction}
                                >
                                    {modalConfirm.type === 'delete' ? 'Eliminar' : 'Restaurar'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TOAST DE NOTIFICACIÓN */}
            {toast.show && (
                <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 11 }}>
                    <div className={`toast show align-items-center text-white ${toast.type === 'success' ? 'bg-success' : 'bg-danger'} border-0`}>
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
        </>
    );
};

export default UserManagementPage;