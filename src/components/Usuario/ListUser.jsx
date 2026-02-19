import React from "react";
import "../../styles/ListUser.css";

const ListUser = ({ users, onDelete, onRestore }) => {
  return (
    <div className="list-user-container">
      <div className="list-user-header">
        <h5 className="list-user-title">
          <i className="bi bi-people-fill me-2"></i>
          Lista de Usuarios
          <span className="badge badge-count">{users.length}</span>
        </h5>
      </div>

      <div className="list-user-body">
        {users.length === 0 ? (
          <div className="list-user-empty">
            <i className="bi bi-inbox"></i>
            <p>No hay usuarios para mostrar</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table-user">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Edad</th>
                  <th>Sexo</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="table-user-row">
                    <td>
                      <div className="user-name">
                        <i className="bi bi-person-circle me-2"></i>
                        {u.nombre}
                      </div>
                    </td>
                    <td>
                      <div className="user-email">
                        <i className="bi bi-envelope me-2"></i>
                        {u.correo}
                      </div>
                    </td>
                    <td>
                      <span className="user-age">{u.edad} años</span>
                    </td>
                    <td>
                      <span className="user-gender">
                        <i className={`bi ${u.sexo === 'M' ? 'bi-gender-male' : 'bi-gender-female'} me-1`}></i>
                        {u.sexo === 'M' ? 'M' : 'F'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge-role ${u.role === "admin" ? "badge-admin" : "badge-user"}`}>
                        <i className={`bi ${u.role === "admin" ? 'bi-shield-fill-check' : 'bi-person'} me-1`}></i>
                        {u.role === "admin" ? "Admin" : "Usuario"}
                      </span>
                    </td>
                    <td>
                      {u.deletedAt ? (
                        <span className="badge-status badge-deleted">
                          <i className="bi bi-trash me-1"></i>
                          Eliminado
                        </span>
                      ) : (
                        <span className="badge-status badge-active">
                          <i className="bi bi-check-circle me-1"></i>
                          Activo
                        </span>
                      )}
                    </td>
                    <td>
                      <div className="user-actions">
                        {!u.deletedAt ? (
                          <button
                            className="btn-action btn-delete"
                            onClick={() => onDelete(u.id)}
                            title="Eliminar usuario"
                          >
                            <i className="bi bi-trash"></i>
                            Eliminar
                          </button>
                        ) : (
                          <button
                            className="btn-action btn-restore"
                            onClick={() => onRestore(u.id)}
                            title="Restaurar usuario"
                          >
                            <i className="bi bi-arrow-counterclockwise"></i>
                            Restaurar
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