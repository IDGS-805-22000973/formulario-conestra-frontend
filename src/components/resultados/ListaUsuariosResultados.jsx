import React, { useState, useMemo } from "react";

const ListaUsuariosResultados = ({ usuarios, onSelect }) => {
  const [textoBusqueda, setTextoBusqueda] = useState("");

  const usuariosFiltrados = useMemo(() => {
    if (!textoBusqueda.trim()) return usuarios;

    const texto = textoBusqueda.toLowerCase();

    return usuarios.filter((u) =>
      u.usuario.nombre.toLowerCase().includes(texto)
    );
  }, [usuarios, textoBusqueda]);

  return (
    <div style={{ width: "30%" }}>
      <h3>Usuarios</h3>

      <input
        type="text"
        placeholder="Buscar por nombre..."
        value={textoBusqueda}
        onChange={(e) => setTextoBusqueda(e.target.value)}
        style={{
          width: "100%",
          padding: 8,
          marginBottom: 12,
          border: "1px solid #ccc",
          borderRadius: 4,
        }}
      />

      {usuariosFiltrados.length === 0 && (
        <div style={{ color: "#777" }}>
          No se encontraron usuarios
        </div>
      )}

      {usuariosFiltrados.map((u) => (
        <div
          key={u.usuario.id}
          onClick={() => onSelect(u)}
          style={{
            border: "1px solid #ccc",
            padding: 10,
            marginBottom: 8,
            cursor: "pointer",
          }}
        >
          <strong>{u.usuario.nombre}</strong>
          <div>{u.usuario.correo}</div>
        </div>
      ))}
    </div>
  );
};

export default ListaUsuariosResultados;
