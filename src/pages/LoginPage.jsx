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

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await loginService(correo, password);

      // Guardar token
      login(data.access_token, data.user);

      // Redirigir según rol
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
                        <input
                          type="password"
                          className="form-control form-control-lg"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          placeholder="••••••••"
                        />
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
