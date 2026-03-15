import React, { useState, useMemo } from "react";
import "../../styles/ListUser.css";

const IC = {
  Users: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
  Search: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
  Trash: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6M14 11v6M9 6V4h6v2" /></svg>,
  Restore: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>,
  Edit: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>,
  Shield: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
  Inbox: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12" /><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 17 4H7a2 2 0 0 0-1.55.76l-.01-.01z" /></svg>,
};

const getInitials = (nombre = "", correo = "") => {
  if (nombre) {
    const p = nombre.trim().split(" ");
    return p.length >= 2 ? (p[0][0] + p[1][0]).toUpperCase() : nombre.substring(0, 2).toUpperCase();
  }
  return correo.substring(0, 2).toUpperCase();
};

const ListUser = ({ users, onDelete, onRestore, onEdit, currentUserId }) => {
  const [textoBusqueda, setTextoBusqueda] = useState("");

  const usuariosFiltrados = useMemo(() =>
    users.filter((u) => u.nombre.toLowerCase().includes(textoBusqueda.toLowerCase()))
    , [users, textoBusqueda]);

  return (
    <div className="list-user-container">
      {/* Header */}
      <div className="list-user-header">
        <div className="list-user-header-top">
          <h5 className="list-user-title">
            <IC.Users />
            Lista de usuarios
          </h5>
          <span className="badge-count">{usuariosFiltrados.length}</span>
        </div>
        <div className="list-user-search">
          <span className="list-user-search-icon"><IC.Search /></span>
          <input
            type="text"
            className="list-user-search-input"
            placeholder="Buscar por nombre…"
            value={textoBusqueda}
            onChange={(e) => setTextoBusqueda(e.target.value)}
          />
        </div>
      </div>

      {/* Body */}
      <div className="list-user-body">
        {usuariosFiltrados.length === 0 ? (
          <div className="list-user-empty">
            <div className="list-user-empty-icon"><IC.Inbox /></div>
            <p>No hay usuarios para mostrar</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table-user">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th className="col-hide-md">Edad</th>
                  <th className="col-hide-md">Sexo</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th style={{ textAlign: "center" }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.map((u) => (
                  <tr key={u.id} className="table-user-row">
                    <td>
                      <div className="user-name-cell">
                        <div className="user-avatar">{getInitials(u.nombre, u.correo)}</div>
                        <div>
                          <div className="user-name">{u.nombre}</div>
                          <div className="user-email">{u.correo}</div>
                        </div>
                      </div>
                    </td>
                    <td className="col-hide-md">
                      <span className="user-age">{u.edad} años</span>
                    </td>
                    <td className="col-hide-md">
                      <span className="user-gender">
                        {u.sexo === "M" ? "Masculino" : "Femenino"}
                      </span>
                    </td>
                    <td>
                      <span className={`badge-role ${u.role === "admin" ? "badge-admin" : "badge-user"}`}>
                        <IC.Shield />
                        {u.role === "admin" ? "Admin" : "Usuario"}
                      </span>
                    </td>
                    <td>
                      {u.deletedAt ? (
                        <span className="badge-status badge-deleted">Eliminado</span>
                      ) : (
                        <span className="badge-status badge-active">Activo</span>
                      )}
                    </td>
                    <td>
                      <div className="user-actions">
                        {!u.deletedAt ? (
                          <>
                            <button className="btn-action btn-edit"
                              onClick={() => onEdit(u)} title="Editar">
                              <IC.Edit />
                            </button>
                            {u.id === currentUserId ? (
                              <span className="btn-own-account">Tu cuenta</span>
                            ) : (
                              <button className="btn-action btn-delete"
                                onClick={() => onDelete(u.id)} title="Eliminar">
                                <IC.Trash />
                              </button>
                            )}
                          </>
                        ) : (
                          <button className="btn-action btn-restore"
                            onClick={() => onRestore(u.id)} title="Restaurar">
                            <IC.Restore />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListUser;