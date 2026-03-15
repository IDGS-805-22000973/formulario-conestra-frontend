import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { updateUser, getOneUser } from "../services/usersService";
import logo from "../assets/Logo1.jpg";
import "../styles/NavBar.css";

/* ── SVG icons inline (sin dependencia de Bootstrap Icons) ── */
const IC = {
  User: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
  Mail: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>,
  Lock: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>,
  Cal: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
  Gender: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v4M12 18v4" /></svg>,
  Shield: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
  Eye: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>,
  EyeOff: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>,
  Edit: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>,
  Logout: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>,
  Save: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>,
  X: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
  Alert: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>,
  Check: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>,
  Info: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>,
};

const Navbar = () => {
  const { user, login, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const rol = user?.role || "user";

  /* ── Estado del modal ── */
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ nombre: "", correo: "", password: "", confirmarPassword: "", edad: "", sexo: "M" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [errorUpdate, setErrorUpdate] = useState("");
  const [successUpdate, setSuccessUpdate] = useState("");

  /* ── Helpers ── */
  const handleLogout = () => { logout(); navigate("/login"); };

  const getInitials = (nombre) => {
    if (!nombre) return "A";
    const p = nombre.trim().split(" ");
    return p.length >= 2 ? (p[0][0] + p[1][0]).toUpperCase() : p[0][0].toUpperCase();
  };

  const isActive = (path) => location.pathname === path;

  /* ── Modal: abrir y cargar datos ── */
  const handleOpenModal = async () => {
    setErrorUpdate(""); setSuccessUpdate("");
    setShowPassword(false); setShowConfirmPassword(false);
    setFormData({ nombre: "", correo: "", password: "", confirmarPassword: "", edad: "", sexo: "M" });
    setShowModal(true);
    setLoadingModal(true);
    try {
      const userId = user?.sub || user?.id;
      const userData = await getOneUser(userId);
      setFormData({ nombre: userData.nombre || "", correo: userData.correo || "", password: "", confirmarPassword: "", edad: userData.edad || "", sexo: userData.sexo || "M" });
    } catch {
      setFormData({ nombre: user?.nombre || "", correo: user?.correo || user?.email || "", password: "", confirmarPassword: "", edad: user?.edad || "", sexo: user?.sexo || "M" });
    } finally {
      setLoadingModal(false);
    }
  };

  const handleCloseModal = () => {
    if (loadingUpdate) return;
    setShowModal(false);
    setErrorUpdate(""); setSuccessUpdate("");
  };

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  /* ── Guardar cambios de perfil ── */
  const handleSave = async (e) => {
    e.preventDefault();
    setErrorUpdate(""); setSuccessUpdate("");

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

  /* ════════════════ RENDER ════════════════ */
  return (
    <>
      {/* ══════════ NAVBAR ══════════ */}
      <nav className="navbar navbar-expand-lg navbar-custom">
        <div className="container">

          {/* Logo */}
          <Link className="navbar-brand" to={rol === "admin" ? "/admin/users" : "/formularios"}>
            <img src={logo} alt="Logo" className="navbar-logo" />
          </Link>

          {/* Toggler móvil */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarMenu"
            aria-controls="navbarMenu"
            aria-expanded="false"
            aria-label="Abrir menú"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="navbarMenu">
            {/* Links centrales */}
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
              {rol === "user" && (
                <li className="nav-item">
                  <Link
                    className={`nav-link nav-link-custom ${isActive("/formularios") ? "active" : ""}`}
                    to="/formularios"
                  >
                    Formularios
                  </Link>
                </li>
              )}
              {rol === "admin" && (
                <>
                  <li className="nav-item">
                    <Link
                      className={`nav-link nav-link-custom ${isActive("/admin/users") ? "active" : ""}`}
                      to="/admin/users"
                    >
                      Gestión Usuarios
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className={`nav-link nav-link-custom ${isActive("/test/resultados") ? "active" : ""}`}
                      to="/test/resultados"
                    >
                      Resultados
                    </Link>
                  </li>
                </>
              )}
            </ul>

            {/* Sección usuario + logout */}
            <ul className="navbar-nav ms-auto align-items-center gap-2">
              <li className="nav-item">
                {rol === "admin" ? (
                  /* Botón de perfil para admin */
                  <button
                    className="navbar-user-btn"
                    onClick={handleOpenModal}
                    title="Editar mi perfil"
                  >
                    <span className="navbar-avatar">{getInitials(user?.nombre)}</span>
                    <span className="navbar-user-name">{user?.nombre || "Admin"}</span>
                    <span className="badge-role-navbar">Admin</span>
                    <span className="navbar-edit-icon"><IC.Edit /></span>
                  </button>
                ) : (
                  /* Info de usuario para rol user */
                  <span className="navbar-user-info">
                    <IC.User />
                    {user?.nombre || "Usuario"}
                    <span className="badge-role-user">{rol}</span>
                  </span>
                )}
              </li>

              <li className="nav-item">
                <button className="btn-logout" onClick={handleLogout}>
                  <IC.Logout />
                  <span>Cerrar sesión</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* ══════════ MODAL PERFIL ══════════ */}
      {showModal && (
        <div
          className="modal show d-block profile-modal-overlay"
          tabIndex="-1"
          onClick={(e) => e.target === e.currentTarget && handleCloseModal()}
        >
          <div className="modal-dialog modal-dialog-centered profile-modal-dialog">
            <div className="modal-content profile-modal-content">

              {/* Header */}
              <div className="profile-modal-header">
                <button
                  type="button"
                  className="profile-modal-close"
                  onClick={handleCloseModal}
                  aria-label="Cerrar"
                >
                  <IC.X />
                </button>
                <div className="profile-modal-avatar-lg">
                  {getInitials(user?.nombre)}
                </div>
                <h4 className="profile-modal-title">Mi Perfil</h4>
                <p className="profile-modal-subtitle">
                  <span className="profile-modal-badge">
                    <IC.Shield /> Administrador
                  </span>
                </p>
              </div>

              <form onSubmit={handleSave} noValidate>
                <div className="profile-modal-body">

                  {/* Alertas */}
                  {errorUpdate && (
                    <div className="profile-alert profile-alert-error">
                      <IC.Alert /> {errorUpdate}
                    </div>
                  )}
                  {successUpdate && (
                    <div className="profile-alert profile-alert-success">
                      <IC.Check /> {successUpdate}
                    </div>
                  )}

                  {/* Skeleton mientras carga */}
                  {loadingModal ? (
                    <div className="profile-loading-skeleton">
                      <div className="skeleton-line skeleton-line-sm mb-2" />
                      <div className="skeleton-line skeleton-line-lg mb-3" />
                      <div className="skeleton-line skeleton-line-sm mb-2" />
                      <div className="skeleton-line skeleton-line-lg mb-3" />
                      <div className="skeleton-row mb-3">
                        <div className="skeleton-line skeleton-line-half" />
                        <div className="skeleton-line skeleton-line-half" />
                      </div>
                      <div className="skeleton-line skeleton-line-lg mb-3" />
                      <div className="skeleton-line skeleton-line-lg" />
                    </div>
                  ) : (
                    <>
                      {/* Información personal */}
                      <div className="profile-section-label">
                        <IC.User /> Información Personal
                      </div>

                      {/* Nombre */}
                      <div className="profile-field">
                        <label className="profile-field-label">Nombre completo</label>
                        <div className="profile-input-wrapper">
                          <span className="profile-input-icon"><IC.User /></span>
                          <input type="text" className="profile-input"
                            name="nombre" value={formData.nombre}
                            onChange={handleChange}
                            placeholder="Tu nombre completo" autoComplete="off" />
                        </div>
                      </div>

                      {/* Correo */}
                      <div className="profile-field">
                        <label className="profile-field-label">Correo electrónico</label>
                        <div className="profile-input-wrapper">
                          <span className="profile-input-icon"><IC.Mail /></span>
                          <input type="email" className="profile-input"
                            name="correo" value={formData.correo}
                            onChange={handleChange}
                            placeholder="correo@ejemplo.com" autoComplete="off" />
                        </div>
                      </div>

                      {/* Edad + Sexo */}
                      <div className="profile-row">
                        <div className="profile-field">
                          <label className="profile-field-label">Edad</label>
                          <div className="profile-input-wrapper">
                            <span className="profile-input-icon"><IC.Cal /></span>
                            <input type="number" className="profile-input"
                              name="edad" value={formData.edad}
                              onChange={handleChange}
                              placeholder="Ej: 30" min="1" max="120" />
                          </div>
                        </div>
                        <div className="profile-field">
                          <label className="profile-field-label">Sexo</label>
                          <div className="profile-input-wrapper">
                            <span className="profile-input-icon"><IC.Gender /></span>
                            <select className="profile-input profile-select"
                              name="sexo" value={formData.sexo}
                              onChange={handleChange}>
                              <option value="M">Masculino</option>
                              <option value="F">Femenino</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Divisor contraseña */}
                      <div className="profile-divider">
                        <span>
                          <IC.Lock /> Cambiar contraseña
                          <span className="profile-optional-tag">opcional</span>
                        </span>
                      </div>

                      {/* Nueva contraseña */}
                      <div className="profile-field">
                        <label className="profile-field-label">Nueva contraseña</label>
                        <div className="profile-input-wrapper">
                          <span className="profile-input-icon"><IC.Lock /></span>
                          <input
                            type={showPassword ? "text" : "password"}
                            className="profile-input profile-input-password"
                            name="password" value={formData.password}
                            onChange={handleChange}
                            placeholder="Mínimo 6 caracteres"
                            autoComplete="new-password"
                          />
                          <button type="button" className="profile-eye-btn"
                            onClick={() => setShowPassword((v) => !v)} tabIndex="-1">
                            {showPassword ? <IC.EyeOff /> : <IC.Eye />}
                          </button>
                        </div>
                      </div>

                      {/* Confirmar contraseña */}
                      <div className="profile-field">
                        <label className="profile-field-label">Confirmar contraseña</label>
                        <div className="profile-input-wrapper">
                          <span className="profile-input-icon"><IC.Lock /></span>
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            className="profile-input profile-input-password"
                            name="confirmarPassword" value={formData.confirmarPassword}
                            onChange={handleChange}
                            placeholder="Repite la contraseña"
                            autoComplete="new-password"
                          />
                          <button type="button" className="profile-eye-btn"
                            onClick={() => setShowConfirmPassword((v) => !v)} tabIndex="-1">
                            {showConfirmPassword ? <IC.EyeOff /> : <IC.Eye />}
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Footer modal */}
                <div className="profile-modal-footer">
                  <button type="button" className="profile-btn-cancel"
                    onClick={handleCloseModal}
                    disabled={loadingUpdate || loadingModal}>
                    <IC.X /> Cancelar
                  </button>
                  <button type="submit" className="profile-btn-save"
                    disabled={loadingUpdate || loadingModal}>
                    {loadingUpdate ? (
                      <><span className="spinner-border spinner-border-sm" role="status" /> Guardando…</>
                    ) : (
                      <><IC.Save /> Guardar cambios</>
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