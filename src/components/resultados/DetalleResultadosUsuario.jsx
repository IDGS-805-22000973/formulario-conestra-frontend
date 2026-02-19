import React, { useState } from "react";
import DetalleFormulario from "./DetalleFormulario";

const DetalleResultadosUsuario = ({ data }) => {
  const [formularioSeleccionado, setFormularioSeleccionado] = useState(null);

  return (
    <div style={{ width: "70%" }}>
      <h3>{data.usuario.nombre}</h3>
      <p>Edad: {data.usuario.edad}</p>
      <p>Sexo: {data.usuario.sexo}</p>

      <h4>Formularios realizados</h4>

      {data.formularios.map((f) => (
        <button
          key={f.id}
          onClick={() => setFormularioSeleccionado(f)}
          style={{ marginRight: 10 }}
        >
          {f.testType}
        </button>
      ))}

      {formularioSeleccionado && (
        <DetalleFormulario formulario={formularioSeleccionado} />
      )}
    </div>
  );
};

export default DetalleResultadosUsuario;
