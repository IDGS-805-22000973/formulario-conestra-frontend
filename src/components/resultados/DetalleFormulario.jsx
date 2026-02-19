import React from "react";

const DetalleFormulario = ({ formulario }) => {
  return (
    <div style={{ marginTop: 20 }}>
      <h4>Formulario {formulario.testType}</h4>

      <h5>Resultados calculados</h5>
      <pre>{JSON.stringify(formulario.calculatedResults, null, 2)}</pre>

      <h5>Respuestas</h5>
      <div style={{ maxHeight: 300, overflow: "auto" }}>
        {Object.entries(formulario.answers).map(([pregunta, valor]) => (
          <div key={pregunta}>
            {pregunta}: <strong>{valor}</strong>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DetalleFormulario;
