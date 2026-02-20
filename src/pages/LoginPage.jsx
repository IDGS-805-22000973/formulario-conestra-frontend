import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { loginService } from "../services/authService";
import logo from "../assets/Logo2.png";
import "../styles/Login.css";

const LoginPage = () => {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await loginService(correo, password);

      login(data.access_token, data.user);

      if (data.user.role === "admin") {
        navigate("/admin/users");
      } else {
        navigate("/formularios");
      }

    } catch (err) {
      setError(err.message || "Credenciales incorrectas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-gradient-bg">
        <div className="container">
          <div className="row min-vh-100 align-items-center">
            {/* COLUMNA IZQUIERDA - INFORMACIÓN */}
            <div className="col-lg-6 text-white d-none d-lg-block">
              <div className="login-info-section">
                <h1 className="display-4 fw-bold mb-4">
                  Nuestra calidad<br />
                  y servicio son tu<br />
                  solución
                </h1>
                <p className="lead mb-4">
                  Brindamos soluciones e innovación a través del talento específico
                  para tu empresa con calidad y profesionalismo.
                </p>
                <div className="login-decorative-elements">
                  <div className="floating-card"></div>
                  <div className="floating-card delay-1"></div>
                  <div className="floating-card delay-2"></div>
                </div>
              </div>
            </div>

            {/* COLUMNA DERECHA - FORMULARIO */}
            <div className="col-lg-6">
              <div className="login-form-wrapper">
                <div className="card login-card shadow-lg">
                  <div className="card-body p-5">
                    {/* Logo */}
                    <div className="text-center mb-4">
                      <img
                        src={logo}
                        alt="Conestra Logo"
                        className="login-logo mb-3"
                      />
                      <h2 className="fw-bold mb-2">Iniciar Sesión</h2>
                      <p className="text-muted">Ingresa tus credenciales para continuar</p>
                    </div>

                    {error && (
                      <div className="alert alert-danger alert-dismissible fade show" role="alert">
                        {error}
                        <button
                          type="button"
                          className="btn-close"
                          onClick={() => setError("")}
                        ></button>
                      </div>
                    )}

                    <form onSubmit={handleSubmit}>
                      <div className="mb-4">
                        <label className="form-label fw-semibold">Correo Electrónico</label>
                        <input
                          type="email"
                          className="form-control form-control-lg"
                          value={correo}
                          onChange={(e) => setCorreo(e.target.value)}
                          required
                          placeholder="ejemplo@correo.com"
                        />
                      </div>

                      <div className="mb-4">
                        <label className="form-label fw-semibold">Contraseña</label>
                        {/* ── único cambio: input-group con botón de ojo ── */}
                        <div className="input-group">
                          <input
                            type={showPassword ? "text" : "password"}
                            className="form-control form-control-lg"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            style={{ borderRadius: "0 10px 10px 0", border: "2px solid #e0e0e0", borderLeft: "none" }}
                            onClick={() => setShowPassword(!showPassword)}
                            tabIndex={-1}
                          >
                            {showPassword ? (
                              // Ojo cerrado
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z" />
                                <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829" />
                                <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z" />
                              </svg>
                            ) : (
                              // Ojo abierto
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="btn btn-primary btn-lg w-100 login-btn"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Cargando...
                          </>
                        ) : (
                          "Ingresar"
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;