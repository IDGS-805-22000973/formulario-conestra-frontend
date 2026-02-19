import React, { useEffect, useMemo, useState } from "react";
import { obtenerTodosLosResultados } from "../services/testService";
import {
  descargarResultadosMossPDF,
  descargarResultados16PFPDF,
} from "../utils/descargarResultadosPDF";
import Navbar from "../components/Navbar";



const ResultadosUsuariosPage = () => {
  const [resultados, setResultados] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [testSeleccionado, setTestSeleccionado] = useState("16PF");
  const [textoBusqueda, setTextoBusqueda] = useState("");


  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await obtenerTodosLosResultados();
        setResultados(data);
      } catch (error) {
        console.error(error);
      }
    };
    cargar();
  }, []);

  const usuariosAgrupados = useMemo(() => {
    const agrupado = resultados.reduce((acc, r) => {
      if (!r.user) return acc;

      const userId = r.user.id;

      if (!acc[userId]) {
        acc[userId] = {
          usuario: r.user,
          tests: [],
        };
      }

      acc[userId].tests.push(r);
      return acc;
    }, {});

    return Object.values(agrupado);
  }, [resultados]);


  const usuariosFiltrados = useMemo(() => {
    if (!textoBusqueda.trim()) return usuariosAgrupados;

    const texto = textoBusqueda.toLowerCase();

    return usuariosAgrupados.filter((u) =>
      u.usuario.nombre.toLowerCase().includes(texto)
    );
  }, [usuariosAgrupados, textoBusqueda]);




  const obtenerTestUsuario = (testType) => {
    if (!usuarioSeleccionado) return null;
    return usuarioSeleccionado.tests.find((t) => t.testType === testType);
  };

  const testActual = obtenerTestUsuario(testSeleccionado);

  return (
    <>
      <Navbar />
      <div style={estilos.contenedor}>
        {/* SIDEBAR */}
        <div style={estilos.sidebar}>
          <h2 style={estilos.tituloSidebar}>Usuarios</h2>

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


          {usuariosFiltrados.map((u) => (
            <div
              key={u.usuario.id}
              onClick={() => {
                setUsuarioSeleccionado(u);
                setTestSeleccionado("16PF");
              }}
              style={{
                ...estilos.usuarioCard,
                backgroundColor:
                  usuarioSeleccionado?.usuario.id === u.usuario.id
                    ? "#e9f0ff"
                    : "#fff",
                border:
                  usuarioSeleccionado?.usuario.id === u.usuario.id
                    ? "2px solid #2563eb"
                    : "1px solid #ddd",
              }}
            >
              <p style={estilos.nombreUsuario}>{u.usuario.nombre}</p>
              <p style={estilos.correoUsuario}>{u.usuario.correo}</p>
              <p style={estilos.detalleUsuario}>
                Edad: {u.usuario.edad} | Sexo: {u.usuario.sexo}
              </p>
            </div>
          ))}
        </div>

        {/* CONTENIDO */}
        <div style={estilos.contenido}>
          {!usuarioSeleccionado ? (
            <div style={estilos.vacio}>
              <h2>Selecciona un usuario</h2>
              <p>Para visualizar sus resultados en 16PF o MOSS.</p>
            </div>
          ) : (
            <>
              <div style={estilos.header}>
                <div>
                  <h2 style={estilos.tituloPrincipal}>
                    Resultados de {usuarioSeleccionado.usuario.nombre}
                  </h2>
                  <p style={estilos.subtitulo}>
                    {usuarioSeleccionado.usuario.correo}
                  </p>
                </div>

                <div style={estilos.tabs}>
                  <button
                    style={{
                      ...estilos.tabButton,
                      backgroundColor:
                        testSeleccionado === "16PF" ? "#2563eb" : "#fff",
                      color: testSeleccionado === "16PF" ? "#fff" : "#111",
                    }}
                    onClick={() => setTestSeleccionado("16PF")}
                  >
                    16PF
                  </button>

                  <button
                    style={{
                      ...estilos.tabButton,
                      backgroundColor:
                        testSeleccionado === "MOSS" ? "#2563eb" : "#fff",
                      color: testSeleccionado === "MOSS" ? "#fff" : "#111",
                    }}
                    onClick={() => setTestSeleccionado("MOSS")}
                  >
                    MOSS
                  </button>
                </div>
                {/* BOTON DESCARGA */}
                {testActual && (
                  <button
                    style={estilos.botonDescarga}
                    onClick={() => {
                      if (testActual.testType === "MOSS") {
                        descargarResultadosMossPDF(
                          usuarioSeleccionado.usuario,
                          testActual.calculatedResults
                        );
                      } else if (testActual.testType === "16PF") {
                        descargarResultados16PFPDF(
                          usuarioSeleccionado.usuario,
                          testActual.calculatedResults
                        );
                      }
                    }}
                  >
                    Descargar PDF
                  </button>
                )}
              </div>

              {!testActual ? (
                <div style={estilos.vacio}>
                  <h3>No hay resultados</h3>
                  <p>Este usuario aún no ha contestado el test {testSeleccionado}.</p>
                </div>
              ) : (
                <div style={estilos.panelResultados}>
                  <div style={estilos.cardGrande}>
                    <h3 style={estilos.tituloSeccion}>Resumen</h3>

                    <div style={estilos.gridResumen}>
                      <div style={estilos.resumenItem}>
                        <p style={estilos.resumenLabel}>ID Respuesta</p>
                        <p style={estilos.resumenValor}>{testActual.id}</p>
                      </div>

                      <div style={estilos.resumenItem}>
                        <p style={estilos.resumenLabel}>Tipo</p>
                        <p style={estilos.resumenValor}>{testActual.testType}</p>
                      </div>

                      <div style={estilos.resumenItem}>
                        <p style={estilos.resumenLabel}>Usuario ID</p>
                        <p style={estilos.resumenValor}>{testActual.userId}</p>
                      </div>
                    </div>
                  </div>

                  {/* RESULTADOS CALCULADOS */}
                  <div style={estilos.cardGrande}>
                    <h3 style={estilos.tituloSeccion}>Resultados Calculados</h3>

                    {testActual.testType === "16PF" ? (
                      <Vista16PF resultados={testActual.calculatedResults} />
                    ) : (
                      <VistaMoss resultados={testActual.calculatedResults} />
                    )}
                  </div>

                  {/* RESPUESTAS */}
                  <div style={estilos.cardGrande}>
                    <h3 style={estilos.tituloSeccion}>Respuestas del Usuario</h3>

                    <div style={estilos.respuestasGrid}>
                      {Object.entries(testActual.answers).map(([key, value]) => (
                        <div key={key} style={estilos.respuestaItem}>
                          <span style={estilos.respuestaPregunta}>{key}</span>
                          <span style={estilos.respuestaValor}>{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

/* ==========================
   COMPONENTES VISUALES
========================== */

const Vista16PF = ({ resultados }) => {
  const decatipos = resultados?.decatipos || {};
  const puntajes = resultados?.puntajesBrutos || {};

  return (
    <div>
      <h4 style={estilos.subtituloSeccion}>Decatipos</h4>

      <div style={estilos.gridBarras}>
        {Object.entries(decatipos).map(([factor, valor]) => (
          <BarraResultado key={factor} nombre={factor} valor={valor} max={10} />
        ))}
      </div>

      <h4 style={{ ...estilos.subtituloSeccion, marginTop: 20 }}>
        Puntajes Brutos
      </h4>

      <div style={estilos.gridBarras}>
        {Object.entries(puntajes).map(([factor, valor]) => (
          <BarraResultado key={factor} nombre={factor} valor={valor} max={20} />
        ))}
      </div>
    </div>
  );
};

const VistaMoss = ({ resultados }) => {
  if (!resultados) return <p>No hay resultados calculados.</p>;

  const areas = resultados?.areas || {};
  const totalAciertos = resultados?.totalAciertos;

  const nombresBonitos = {
    decision: "Toma de decisiones",
    evaluacion: "Evaluación",
    relaciones: "Relaciones humanas",
    supervision: "Supervisión",
    sentidoComun: "Sentido común",
  };

  return (
    <div style={estilos.mossContainer}>
      <h3 style={estilos.tituloSeccion}>Resultados MOSS</h3>

      <div style={estilos.totalBox}>
        <span style={estilos.totalLabel}>Total de aciertos:</span>
        <span style={estilos.totalValor}>{totalAciertos ?? "N/A"}</span>
      </div>

      <div style={estilos.mossGrid}>
        {Object.entries(areas).map(([areaKey, datos]) => (
          <div key={areaKey} style={estilos.mossCard}>
            <h4 style={estilos.mossTitulo}>
              {nombresBonitos[areaKey] || areaKey}
            </h4>

            <div style={estilos.mossRow}>
              <span style={estilos.mossLabel}>Rango:</span>
              <span style={estilos.mossValue}>{datos?.rango ?? "N/A"}</span>
            </div>

            <div style={estilos.mossRow}>
              <span style={estilos.mossLabel}>Puntaje:</span>
              <span style={estilos.mossValue}>{datos?.puntaje ?? "N/A"}</span>
            </div>

            <div style={estilos.mossRow}>
              <span style={estilos.mossLabel}>Percentil:</span>
              <span style={estilos.mossValue}>
                {datos?.percentil != null ? `${datos.percentil}%` : "N/A"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};



const BarraResultado = ({ nombre, valor, max }) => {
  const porcentaje = Math.min((valor / max) * 100, 100);

  return (
    <div style={estilos.barraCard}>
      <div style={estilos.barraHeader}>
        <span style={estilos.barraTitulo}>{nombre}</span>
        <span style={estilos.barraValor}>{valor}</span>
      </div>

      <div style={estilos.barraFondo}>
        <div style={{ ...estilos.barraProgreso, width: `${porcentaje}%` }} />
      </div>
    </div>
  );
};

/* ==========================
   ESTILOS
========================== */

const estilos = {

  headerRight: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    alignItems: "flex-end",
  },

  botonDescarga: {
    padding: "10px 15px",
    borderRadius: 10,
    border: "none",
    background: "#16a34a",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: 14,
    width: "fit-content",
  },


  mossContainer: {
    marginTop: 20,
  },

  tituloSeccion: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },

  totalBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#f3f4f6",
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    border: "1px solid #ddd",
  },

  totalLabel: {
    fontWeight: "bold",
    fontSize: 16,
  },

  totalValor: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2563eb",
  },

  mossGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: 15,
  },

  mossCard: {
    background: "white",
    borderRadius: 12,
    padding: 15,
    border: "1px solid #ddd",
    boxShadow: "0px 4px 8px rgba(0,0,0,0.06)",
  },

  mossTitulo: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    borderBottom: "1px solid #eee",
    paddingBottom: 8,
  },

  mossRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 8,
    fontSize: 14,
  },

  mossLabel: {
    fontWeight: "bold",
    color: "#374151",
  },

  mossValue: {
    color: "#111827",
  },

  contenedor: {
    display: "flex",
    height: "100vh",
    backgroundColor: "#f4f6fb",
    fontFamily: "Arial, sans-serif",
  },

  sidebar: {
    width: "320px",
    backgroundColor: "#fff",
    borderRight: "1px solid #ddd",
    padding: "15px",
    overflowY: "auto",
  },

  tituloSidebar: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "15px",
  },

  usuarioCard: {
    padding: "12px",
    borderRadius: "10px",
    marginBottom: "10px",
    transition: "0.2s",
  },

  nombreUsuario: {
    fontWeight: "bold",
    fontSize: "14px",
    margin: 0,
  },

  correoUsuario: {
    fontSize: "12px",
    margin: "4px 0",
    color: "#555",
  },

  detalleUsuario: {
    fontSize: "12px",
    margin: 0,
    color: "#666",
  },

  contenido: {
    flex: 1,
    padding: "20px",
    overflowY: "auto",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  tituloPrincipal: {
    fontSize: "22px",
    margin: 0,
  },

  subtitulo: {
    margin: "5px 0 0",
    fontSize: "13px",
    color: "#555",
  },

  tabs: {
    display: "flex",
    gap: "10px",
  },

  tabButton: {
    padding: "10px 20px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    cursor: "pointer",
    fontWeight: "bold",
  },

  panelResultados: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  cardGrande: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid #ddd",
    boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
  },

  tituloSeccion: {
    margin: "0 0 15px 0",
    fontSize: "16px",
  },

  subtituloSeccion: {
    fontSize: "14px",
    marginBottom: "10px",
    color: "#111",
  },

  gridResumen: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "15px",
  },

  resumenItem: {
    padding: "10px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    backgroundColor: "#f9fafc",
  },

  resumenLabel: {
    margin: 0,
    fontSize: "12px",
    color: "#555",
  },

  resumenValor: {
    margin: "5px 0 0",
    fontSize: "16px",
    fontWeight: "bold",
  },

  gridBarras: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: "12px",
  },

  barraCard: {
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "12px",
    backgroundColor: "#f9fafc",
  },

  barraHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px",
  },

  barraTitulo: {
    fontWeight: "bold",
    fontSize: "13px",
  },

  barraValor: {
    fontSize: "13px",
    fontWeight: "bold",
    color: "#2563eb",
  },

  barraFondo: {
    height: "10px",
    borderRadius: "10px",
    backgroundColor: "#e5e7eb",
    overflow: "hidden",
  },

  barraProgreso: {
    height: "100%",
    borderRadius: "10px",
    backgroundColor: "#2563eb",
  },

  respuestasGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
    gap: "10px",
    maxHeight: "350px",
    overflowY: "auto",
    paddingRight: "5px",
  },

  respuestaItem: {
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "10px",
    backgroundColor: "#f9fafc",
    display: "flex",
    justifyContent: "space-between",
  },

  respuestaPregunta: {
    fontWeight: "bold",
    fontSize: "12px",
  },

  respuestaValor: {
    fontWeight: "bold",
    fontSize: "12px",
    color: "#2563eb",
  },

  cardInterna: {
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "12px",
    backgroundColor: "#f9fafc",
  },

  preFormato: {
    backgroundColor: "#111827",
    color: "#fff",
    padding: "10px",
    borderRadius: "10px",
    fontSize: "12px",
    overflowX: "auto",
  },

  vacio: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "12px",
    border: "1px solid #ddd",
    textAlign: "center",
  },
};

export default ResultadosUsuariosPage;
