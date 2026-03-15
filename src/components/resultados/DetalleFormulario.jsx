import React from "react";

/* ── Props:
     formulario → { testType, calculatedResults, answers }
─────────────────────────────────────────────── */
const DetalleFormulario = ({ formulario }) => {
  const { testType, calculatedResults, answers } = formulario;
  const answersEntries = Object.entries(answers || {});

  /* ── Helpers para detectar estructura de resultados ── */
  const isMoss = testType === "MOSS";

  /* Intenta extraer un total numérico del objeto de resultados */
  const totalEntry = calculatedResults
    ? Object.entries(calculatedResults).find(([k]) =>
      /total/i.test(k))
    : null;

  /* Detectar si hay sub-objetos (sectores MOSS) o plano (16PF) */
  const hasSectors = calculatedResults
    && Object.values(calculatedResults).some((v) => typeof v === "object" && v !== null);

  const flatEntries = calculatedResults && !hasSectors
    ? Object.entries(calculatedResults).filter(([k]) => !/total/i.test(k))
    : [];

  const sectorEntries = calculatedResults && hasSectors
    ? Object.entries(calculatedResults).filter(([, v]) => typeof v === "object" && v !== null)
    : [];

  /* Max de barras para calcular porcentaje */
  const flatValues = flatEntries.map(([, v]) => Number(v)).filter((v) => !isNaN(v));
  const maxValue = flatValues.length ? Math.max(...flatValues, 1) : 1;

  return (
    <div className="res-panel-grid">

      {/* ── Total / resumen rápido ── */}
      {totalEntry && (
        <div className="res-total-box">
          <span className="res-total-label">Puntaje total — {testType}</span>
          <span className="res-total-value">{totalEntry[1]}</span>
        </div>
      )}

      {/* ── SECTORES (MOSS u otro con sub-objetos) ── */}
      {hasSectors && sectorEntries.length > 0 && (
        <div className="res-card">
          <div className="res-card-header">
            <h3 className="res-card-title">Sectores evaluados</h3>
            <span className="res-card-badge">{sectorEntries.length} sectores</span>
          </div>
          <div className="res-card-body">
            <div className="res-moss-grid">
              {sectorEntries.map(([sector, valores]) => (
                <div key={sector} className="res-moss-card">
                  <div className="res-moss-card-header">{sector}</div>
                  <div className="res-moss-card-body">
                    {Object.entries(valores).map(([k, v]) => (
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
        </div>
      )}

      {/* ── BARRAS DE FACTORES (16PF u otro plano) ── */}
      {!hasSectors && flatEntries.length > 0 && (
        <div className="res-card">
          <div className="res-card-header">
            <h3 className="res-card-title">Factores de personalidad</h3>
            <span className="res-card-badge">{flatEntries.length} factores</span>
          </div>
          <div className="res-card-body">
            <div className="res-bars-grid">
              {flatEntries.map(([factor, valor]) => {
                const num = Number(valor);
                const pct = isNaN(num) ? 0 : Math.round((num / maxValue) * 100);
                return (
                  <div key={factor} className="res-bar-card">
                    <div className="res-bar-header">
                      <span className="res-bar-label">{factor}</span>
                      <span className="res-bar-value">{String(valor)}</span>
                    </div>
                    <div className="res-bar-track">
                      <div className="res-bar-fill" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── JSON crudo de resultados ── */}
      {calculatedResults && (
        <div className="res-card">
          <div className="res-card-header">
            <h3 className="res-card-title">Resultados calculados (raw)</h3>
          </div>
          <div className="res-card-body" style={{ padding: "1rem 1.25rem" }}>
            <pre className="res-pre">{JSON.stringify(calculatedResults, null, 2)}</pre>
          </div>
        </div>
      )}

      {/* ── Respuestas ── */}
      {answersEntries.length > 0 && (
        <div className="res-card">
          <div className="res-card-header">
            <h3 className="res-card-title">Respuestas</h3>
            <span className="res-card-badge">{answersEntries.length} ítems</span>
          </div>
          <div className="res-card-body">
            <div className="res-answers-grid">
              {answersEntries.map(([pregunta, valor]) => (
                <div key={pregunta} className="res-answer-item">
                  <span className="res-answer-q">{pregunta}</span>
                  <span className="res-answer-v">{String(valor)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetalleFormulario;