import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { updateUser, getOneUser } from "../services/usersService";
import logo from "../assets/Logo1.jpg";
import "../styles/NavBar.css";

const Navbar = () => {
  const { user, login, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const rol = user?.role || "user";

  // Estado del modal
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "", correo: "", password: "", confirmarPassword: "", edad: "", sexo: "M",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [errorUpdate, setErrorUpdate] = useState("");
  const [successUpdate, setSuccessUpdate] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Genera iniciales del nombre
  const getInitials = (nombre) => {
    if (!nombre) return "A";
    const partes = nombre.trim().split(" ");
    return partes.length >= 2
      ? (partes[0][0] + partes[1][0]).toUpperCase()
      : partes[0][0].toUpperCase();
  };

  // Abre el modal y carga datos reales desde el backend
  const handleOpenModal = async () => {
    setErrorUpdate("");
    setSuccessUpdate("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    setFormData({ nombre: "", correo: "", password: "", confirmarPassword: "", edad: "", sexo: "M" });
    setShowModal(true);
    setLoadingModal(true);

    try {
      const userId = user?.sub || user?.id;
      const userData = await getOneUser(userId);
      setFormData({
        nombre: userData.nombre || "",
        correo: userData.correo || "",
        password: "",
        confirmarPassword: "",
        edad: userData.edad || "",
        sexo: userData.sexo || "M",
      });
    } catch {
      // Fallback: datos del token
      setFormData({
        nombre: user?.nombre || "",
        correo: user?.correo || user?.email || "",
        password: "",
        confirmarPassword: "",
        edad: user?.edad || "",
        sexo: user?.sexo || "M",
      });
    } finally {
      setLoadingModal(false);
    }
  };

  const handleCloseModal = () => {
    if (loadingUpdate) return;
    setShowModal(false);
    setErrorUpdate("");
    setSuccessUpdate("");
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setErrorUpdate("");
    setSuccessUpdate("");

    if (!formData.nombre.trim()) { setErrorUpdate("El nombre es obligatorio"); return; }
    if (!formData.correo.trim()) { setErrorUpdate("El correo es obligatorio"); return; }
    if (formData.password && formData.password.length < 6) {
      setErrorUpdate("La contraseña debe tener al menos 6 caracteres"); return;
    }
    if (formData.password && formData.password !== formData.confirmarPassword) {
      setErrorUpdate("Las contraseñas no coinciden"); return;
    }

    const payload = {
      nombre: formData.nombre.trim(),
      correo: formData.correo.trim().toLowerCase(),
      edad: formData.edad ? Number(formData.edad) : undefined,
      sexo: formData.sexo,
    };
    if (formData.password) payload.password = formData.password;

    try {
      setLoadingUpdate(true);
      const result = await updateUser(user?.sub || user?.id, payload);
      setSuccessUpdate("¡Perfil actualizado correctamente!");
      if (result?.access_token) login(result.access_token);
      setTimeout(() => handleCloseModal(), 1500);
    } catch (err) {
      setErrorUpdate(err?.message || "Error al actualizar el perfil");
    } finally {
      setLoadingUpdate(false);
    }
  };

  return (
    <>
      {/* ===== NAVBAR ===== */}
      <nav className="navbar navbar-expand-lg navbar-custom shadow-sm">
        <div className="container">
          <Link className="navbar-brand" to={rol === "admin" ? "/admin/users" : "/formularios"}>
            <img src={logo} alt="Logo" className="navbar-logo" />
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarMenu"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarMenu">
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
              {rol === "user" && (
                <li className="nav-item">
                  <Link className="nav-link nav-link-custom" to="/formularios">
                    Formularios
                  </Link>
                </li>
              )}
              {rol === "admin" && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link nav-link-custom" to="/admin/users">
                      Gestión Usuarios
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link nav-link-custom" to="/test/resultados">
                      Resultados
                    </Link>
                  </li>
                </>
              )}
            </ul>

            <ul className="navbar-nav ms-auto align-items-center gap-2">
              <li className="nav-item">
                {rol === "admin" ? (
                  <button
                    className="navbar-user-btn"
                    onClick={handleOpenModal}
                    title="Editar mi perfil"
                  >
                    <span className="navbar-avatar">{getInitials(user?.nombre)}</span>
                    <span className="navbar-user-name">{user?.nombre || "Admin"}</span>
                    <span className="badge-role-navbar">Admin</span>
                    <i className="bi bi-pencil-fill navbar-edit-icon"></i>
                  </button>
                ) : (
                  <span className="navbar-user-info">
                    <i className="bi bi-person-circle me-2"></i>
                    {user?.nombre || "Usuario"}
                    <span className="badge bg-light text-dark ms-2">{rol}</span>
                  </span>
                )}
              </li>
              <li className="nav-item">
                <button className="btn btn-logout" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right"></i>
                  <span>Cerrar sesión</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* ===== MODAL PERFIL ===== */}
      {showModal && (
        <div
          className="modal show d-block profile-modal-overlay"
          tabIndex="-1"
          onClick={(e) => e.target === e.currentTarget && handleCloseModal()}
        >
          <div className="modal-dialog modal-dialog-centered profile-modal-dialog">
            <div className="modal-content profile-modal-content">

              {/* HEADER */}
              <div className="profile-modal-header">
                <button
                  type="button"
                  className="profile-modal-close"
                  onClick={handleCloseModal}
                  aria-label="Cerrar"
                >
                  <i className="bi bi-x-lg"></i>
                </button>
                <div className="profile-modal-avatar-lg">
                  {getInitials(user?.nombre)}
                </div>
                <h4 className="profile-modal-title">Mi Perfil</h4>
                <p className="profile-modal-subtitle">
                  <span className="profile-modal-badge">
                    <i className="bi bi-shield-fill-check me-1"></i>
                    Administrador
                  </span>
                </p>
              </div>

              <form onSubmit={handleSave} noValidate>
                <div className="profile-modal-body">

                  {/* Alertas */}
                  {errorUpdate && (
                    <div className="profile-alert profile-alert-error">
                      <i className="bi bi-exclamation-triangle-fill me-2"></i>
                      {errorUpdate}
                    </div>
                  )}
                  {successUpdate && (
                    <div className="profile-alert profile-alert-success">
                      <i className="bi bi-check-circle-fill me-2"></i>
                      {successUpdate}
                    </div>
                  )}

                  {/* ---- SKELETON mientras carga ---- */}
                  {loadingModal ? (
                    <div className="profile-loading-skeleton">
                      <div className="skeleton-line skeleton-line-sm mb-2"></div>
                      <div className="skeleton-line skeleton-line-lg mb-3"></div>
                      <div className="skeleton-line skeleton-line-sm mb-2"></div>
                      <div className="skeleton-line skeleton-line-lg mb-3"></div>
                      <div className="skeleton-row mb-3">
                        <div className="skeleton-line skeleton-line-half"></div>
                        <div className="skeleton-line skeleton-line-half"></div>
                      </div>
                      <div className="skeleton-line skeleton-line-lg mb-3"></div>
                      <div className="skeleton-line skeleton-line-lg"></div>
                    </div>
                  ) : (
                    /* ---- FORMULARIO con datos reales ---- */
                    <>
                      {/* Sección info personal */}
                      <div className="profile-section-label">
                        <i className="bi bi-person-lines-fill me-2"></i>
                        Información Personal
                      </div>

                      {/* Nombre */}
                      <div className="profile-field">
                        <label className="profile-field-label">Nombre completo</label>
                        <div className="profile-input-wrapper">
                          <span className="profile-input-icon">
                            <i className="bi bi-person-fill"></i>
                          </span>
                          <input
                            type="text"
                            className="profile-input"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            placeholder="Tu nombre completo"
                            autoComplete="off"
                          />
                        </div>
                      </div>

                      {/* Correo */}
                      <div className="profile-field">
                        <label className="profile-field-label">Correo electrónico</label>
                        <div className="profile-input-wrapper">
                          <span className="profile-input-icon">
                            <i className="bi bi-envelope-fill"></i>
                          </span>
                          <input
                            type="email"
                            className="profile-input"
                            name="correo"
                            value={formData.correo}
                            onChange={handleChange}
                            placeholder="correo@ejemplo.com"
                            autoComplete="off"
                          />
                        </div>
                      </div>

                      {/* Edad y Sexo */}
                      <div className="profile-row">
                        <div className="profile-field">
                          <label className="profile-field-label">Edad</label>
                          <div className="profile-input-wrapper">
                            <span className="profile-input-icon">
                              <i className="bi bi-calendar2-heart-fill"></i>
                            </span>
                            <input
                              type="number"
                              className="profile-input"
                              name="edad"
                              value={formData.edad}
                              onChange={handleChange}
                              placeholder="Ej: 30"
                              min="1"
                              max="120"
                            />
                          </div>
                        </div>
                        <div className="profile-field">
                          <label className="profile-field-label">Sexo</label>
                          <div className="profile-input-wrapper">
                            <span className="profile-input-icon">
                              <i className="bi bi-gender-ambiguous"></i>
                            </span>
                            <select
                              className="profile-input profile-select"
                              name="sexo"
                              value={formData.sexo}
                              onChange={handleChange}
                            >
                              <option value="M">Masculino</option>
                              <option value="F">Femenino</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Divisor contraseña */}
                      <div className="profile-divider">
                        <span>
                          <i className="bi bi-lock-fill me-2"></i>
                          Cambiar contraseña
                          <span className="profile-optional-tag">opcional</span>
                        </span>
                      </div>

                      {/* Nueva contraseña */}
                      <div className="profile-field">
                        <label className="profile-field-label">Nueva contraseña</label>
                        <div className="profile-input-wrapper">
                          <span className="profile-input-icon">
                            <i className="bi bi-lock-fill"></i>
                          </span>
                          <input
                            type={showPassword ? "text" : "password"}
                            className="profile-input profile-input-password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Mínimo 6 caracteres"
                            autoComplete="new-password"
                          />
                          <button
                            type="button"
                            className="profile-eye-btn"
                            onClick={() => setShowPassword((v) => !v)}
                            tabIndex="-1"
                            title={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
                          >
                            <i className={`bi ${showPassword ? "bi-eye-slash-fill" : "bi-eye-fill"}`}></i>
                          </button>
                        </div>
                      </div>

                      {/* Confirmar contraseña */}
                      <div className="profile-field">
                        <label className="profile-field-label">Confirmar contraseña</label>
                        <div className="profile-input-wrapper">
                          <span className="profile-input-icon">
                            <i className="bi bi-shield-lock-fill"></i>
                          </span>
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            className="profile-input profile-input-password"
                            name="confirmarPassword"
                            value={formData.confirmarPassword}
                            onChange={handleChange}
                            placeholder="Repite la contraseña"
                            autoComplete="new-password"
                          />
                          <button
                            type="button"
                            className="profile-eye-btn"
                            onClick={() => setShowConfirmPassword((v) => !v)}
                            tabIndex="-1"
                            title={showConfirmPassword ? "Ocultar contraseña" : "Ver contraseña"}
                          >
                            <i className={`bi ${showConfirmPassword ? "bi-eye-slash-fill" : "bi-eye-fill"}`}></i>
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                </div>

                {/* FOOTER */}
                <div className="profile-modal-footer">
                  <button
                    type="button"
                    className="profile-btn-cancel"
                    onClick={handleCloseModal}
                    disabled={loadingUpdate || loadingModal}
                  >
                    <i className="bi bi-x-circle me-2"></i>
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="profile-btn-save"
                    disabled={loadingUpdate || loadingModal}
                  >
                    {loadingUpdate ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-floppy-fill me-2"></i>
                        Guardar cambios
                      </>
                    )}
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;