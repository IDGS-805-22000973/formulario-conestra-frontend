import React, { useEffect, useState } from "react";
import "../../styles/FormUser.css";

const IC = {
  User: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
  Mail: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>,
  Lock: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>,
  Cal: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
  Gender: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v4M12 18v4" /></svg>,
  Shield: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
  Eye: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>,
  EyeOff: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>,
  Save: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>,
  Plus: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>,
  X: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
  AlertTri: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>,
  Warn: () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>,
};

const FormUser = ({ onSubmit, usuarioEditar, onCancel }) => {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [edad, setEdad] = useState("");
  const [sexo, setSexo] = useState("M");
  const [role, setRole] = useState("user");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarConfirmarPassword, setMostrarConfirmarPassword] = useState(false);
  const [errores, setErrores] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (usuarioEditar) {
      setNombre(usuarioEditar.nombre || "");
      setCorreo(usuarioEditar.correo || "");
      setEdad(usuarioEditar.edad || "");
      setSexo(usuarioEditar.sexo || "M");
      setRole(usuarioEditar.role || "user");
      setPassword(""); setConfirmarPassword("");
      setErrores({}); setTouched({});
    }
  }, [usuarioEditar]);

  const validarNombre = (v) => {
    if (!v.trim()) return "El nombre es obligatorio";
    if (v.trim().length < 3) return "Mínimo 3 caracteres";
    if (v.trim().length > 50) return "Máximo 50 caracteres";
    return "";
  };
  const validarCorreo = (v) => {
    if (!v.trim()) return "El correo es obligatorio";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Correo inválido";
    return "";
  };
  const validarPassword = (v) => {
    if (!usuarioEditar && !v.trim()) return "La contraseña es obligatoria";
    if (v.trim() && v.length < 6) return "Mínimo 6 caracteres";
    return "";
  };
  const validarConfirmarPassword = (v) => {
    if (!usuarioEditar && !v.trim()) return "Confirma la contraseña";
    if (password.trim() && v !== password) return "Las contraseñas no coinciden";
    return "";
  };
  const validarEdad = (v) => {
    if (!v) return "La edad es obligatoria";
    const n = Number(v);
    if (isNaN(n) || n < 1) return "Edad inválida";
    if (n > 120) return "Máximo 120";
    return "";
  };
  const validarSexo = (v) => (!v ? "Selecciona un sexo" : "");

  const validarFormulario = () => {
    const e = {
      nombre: validarNombre(nombre),
      correo: validarCorreo(correo),
      password: validarPassword(password),
      confirmarPassword: validarConfirmarPassword(confirmarPassword),
      edad: validarEdad(edad),
      sexo: validarSexo(sexo),
    };
    Object.keys(e).forEach((k) => { if (e[k] === "") delete e[k]; });
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const handleBlur = (campo) => {
    setTouched({ ...touched, [campo]: true });
    const validators = {
      nombre: () => validarNombre(nombre),
      correo: () => validarCorreo(correo),
      password: () => validarPassword(password),
      confirmarPassword: () => validarConfirmarPassword(confirmarPassword),
      edad: () => validarEdad(edad),
      sexo: () => validarSexo(sexo),
    };
    if (validators[campo]) setErrores({ ...errores, [campo]: validators[campo]() });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ nombre: true, correo: true, password: true, confirmarPassword: true, edad: true, sexo: true });
    if (!validarFormulario()) return;
    const payload = {
      id: usuarioEditar?.id,
      nombre: nombre.trim(),
      correo: correo.trim().toLowerCase(),
      edad: Number(edad), sexo, role,
    };
    if (password.trim()) payload.password = password;
    onSubmit(payload);
    setNombre(""); setCorreo(""); setPassword(""); setConfirmarPassword("");
    setEdad(""); setSexo("M"); setRole("user"); setErrores({}); setTouched({});
  };

  const handleCancel = () => { setErrores({}); setTouched({}); onCancel(); };
  const fc = (campo) =>
    touched[campo] && errores[campo] ? "is-invalid"
      : touched[campo] && !errores[campo] ? "is-valid" : "";

  const Err = ({ campo }) => touched[campo] && errores[campo]
    ? <div className="form-user-error"><IC.Warn />{errores[campo]}</div>
    : null;

  return (
    <div className="form-user-container">
      <div className={`form-user-header ${usuarioEditar ? "form-user-header--edit" : ""}`}>
        <h5 className="form-user-title">
          {usuarioEditar ? <><IC.Save /> Editar usuario</> : <><IC.Plus /> Registrar usuario</>}
        </h5>
      </div>

      <form onSubmit={handleSubmit} noValidate className="form-user-body">
        {/* Nombre */}
        <div className="form-user-group">
          <label className="form-user-label"><IC.User />Nombre <span style={{ color: "#ef4444" }}>*</span></label>
          <input type="text" className={`form-user-input ${fc("nombre")}`}
            value={nombre} onChange={(e) => setNombre(e.target.value)}
            onBlur={() => handleBlur("nombre")} placeholder="Nombre del usuario" />
          <Err campo="nombre" />
        </div>

        {/* Correo */}
        <div className="form-user-group">
          <label className="form-user-label"><IC.Mail />Correo <span style={{ color: "#ef4444" }}>*</span></label>
          <input type="email" className={`form-user-input ${fc("correo")}`}
            value={correo} onChange={(e) => setCorreo(e.target.value)}
            onBlur={() => handleBlur("correo")} placeholder="correo@ejemplo.com" />
          <Err campo="correo" />
        </div>

        {/* Password */}
        <div className="form-user-group">
          <label className="form-user-label">
            <IC.Lock />
            Contraseña {usuarioEditar
              ? <span style={{ color: "#94a3b8", textTransform: "none", letterSpacing: 0, fontWeight: 400 }}>(opcional)</span>
              : <span style={{ color: "#ef4444" }}>*</span>}
          </label>
          <div className="input-password-wrapper">
            <input type={mostrarPassword ? "text" : "password"}
              className={`form-user-input ${touched.password && errores.password ? "is-invalid" : touched.password && !errores.password && password ? "is-valid" : ""}`}
              value={password} onChange={(e) => setPassword(e.target.value)}
              onBlur={() => handleBlur("password")} placeholder="••••••••" />
            <button type="button" className="btn-toggle-password" onClick={() => setMostrarPassword(!mostrarPassword)}>
              {mostrarPassword ? <IC.EyeOff /> : <IC.Eye />}
            </button>
          </div>
          <Err campo="password" />
        </div>

        {/* Confirmar password */}
        <div className="form-user-group">
          <label className="form-user-label">
            <IC.Lock />
            Confirmar contraseña {!usuarioEditar && <span style={{ color: "#ef4444" }}>*</span>}
          </label>
          <div className="input-password-wrapper">
            <input type={mostrarConfirmarPassword ? "text" : "password"}
              className={`form-user-input ${touched.confirmarPassword && errores.confirmarPassword ? "is-invalid" : touched.confirmarPassword && !errores.confirmarPassword && confirmarPassword ? "is-valid" : ""}`}
              value={confirmarPassword} onChange={(e) => setConfirmarPassword(e.target.value)}
              onBlur={() => handleBlur("confirmarPassword")} placeholder="••••••••" />
            <button type="button" className="btn-toggle-password" onClick={() => setMostrarConfirmarPassword(!mostrarConfirmarPassword)}>
              {mostrarConfirmarPassword ? <IC.EyeOff /> : <IC.Eye />}
            </button>
          </div>
          <Err campo="confirmarPassword" />
        </div>

        {/* Edad + Sexo */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".75rem" }}>
          <div className="form-user-group" style={{ marginBottom: 0 }}>
            <label className="form-user-label"><IC.Cal />Edad <span style={{ color: "#ef4444" }}>*</span></label>
            <input type="number" className={`form-user-input ${fc("edad")}`}
              value={edad} onChange={(e) => setEdad(e.target.value)}
              onBlur={() => handleBlur("edad")} placeholder="22" min="1" max="120" />
            <Err campo="edad" />
          </div>
          <div className="form-user-group" style={{ marginBottom: 0 }}>
            <label className="form-user-label"><IC.Gender />Sexo <span style={{ color: "#ef4444" }}>*</span></label>
            <select className={`form-user-select ${fc("sexo")}`}
              value={sexo} onChange={(e) => setSexo(e.target.value)} onBlur={() => handleBlur("sexo")}>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </select>
            <Err campo="sexo" />
          </div>
        </div>

        {/* Rol */}
        <div className="form-user-group" style={{ marginTop: "1.1rem" }}>
          <label className="form-user-label"><IC.Shield />Rol</label>
          <select className="form-user-select" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="user">Usuario</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        {Object.keys(errores).length > 0 && (
          <div className="form-user-alert">
            <IC.AlertTri /> Corrige los errores antes de continuar.
          </div>
        )}

        <div className="form-user-actions">
          <button type="submit" className="btn-form-submit">
            {usuarioEditar ? <><IC.Save /> Actualizar</> : <><IC.Plus /> Guardar</>}
          </button>
          {usuarioEditar && (
            <button type="button" className="btn-form-cancel" onClick={handleCancel}>
              <IC.X /> Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default FormUser;