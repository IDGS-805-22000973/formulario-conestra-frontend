import React, { useEffect, useState } from "react";
import "../../styles/FormUser.css";

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
      setPassword("");
      setConfirmarPassword("");
      setErrores({});
      setTouched({});
    }
  }, [usuarioEditar]);

  const validarNombre = (valor) => {
    if (!valor.trim()) return "El nombre es obligatorio";
    if (valor.trim().length < 3) return "El nombre debe tener al menos 3 caracteres";
    if (valor.trim().length > 50) return "El nombre no puede exceder los 50 caracteres";
    return "";
  };

  const validarCorreo = (valor) => {
    if (!valor.trim()) return "El correo es obligatorio";
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexCorreo.test(valor)) return "Ingresa un correo electrónico válido";
    return "";
  };

  const validarPassword = (valor) => {
    if (!usuarioEditar && !valor.trim()) return "La contraseña es obligatoria";
    if (valor.trim() && valor.length < 6) return "La contraseña debe tener al menos 6 caracteres";
    return "";
  };

  const validarConfirmarPassword = (valor) => {
    if (!usuarioEditar && !valor.trim()) return "Confirma la contraseña";
    if (password.trim() && valor !== password) return "Las contraseñas no coinciden";
    return "";
  };

  const validarEdad = (valor) => {
    if (!valor) return "La edad es obligatoria";
    const edadNum = Number(valor);
    if (isNaN(edadNum)) return "La edad debe ser un número";
    if (edadNum < 1) return "La edad debe ser mayor a 0";
    if (edadNum > 120) return "La edad no puede ser mayor a 120 años";
    return "";
  };

  const validarSexo = (valor) => {
    if (!valor) return "Selecciona un sexo";
    return "";
  };

  const validarFormulario = () => {
    const nuevosErrores = {
      nombre: validarNombre(nombre),
      correo: validarCorreo(correo),
      password: validarPassword(password),
      confirmarPassword: validarConfirmarPassword(confirmarPassword),
      edad: validarEdad(edad),
      sexo: validarSexo(sexo),
    };

    Object.keys(nuevosErrores).forEach((key) => {
      if (nuevosErrores[key] === "") delete nuevosErrores[key];
    });

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleBlur = (campo) => {
    setTouched({ ...touched, [campo]: true });

    let error = "";
    switch (campo) {
      case "nombre":
        error = validarNombre(nombre);
        break;
      case "correo":
        error = validarCorreo(correo);
        break;
      case "password":
        error = validarPassword(password);
        break;
      case "confirmarPassword":
        error = validarConfirmarPassword(confirmarPassword);
        break;
      case "edad":
        error = validarEdad(edad);
        break;
      case "sexo":
        error = validarSexo(sexo);
        break;
      default:
        return;
    }

    setErrores({ ...errores, [campo]: error });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const todosTouched = {
      nombre: true,
      correo: true,
      password: true,
      confirmarPassword: true,
      edad: true,
      sexo: true,
    };
    setTouched(todosTouched);

    if (!validarFormulario()) return;

    const usuarioEnviar = {
      id: usuarioEditar?.id,
      nombre: nombre.trim(),
      correo: correo.trim().toLowerCase(),
      edad: Number(edad),
      sexo,
      role,
    };

    if (password.trim()) {
      usuarioEnviar.password = password;
    }

    onSubmit(usuarioEnviar);

    setNombre("");
    setCorreo("");
    setPassword("");
    setConfirmarPassword("");
    setEdad("");
    setSexo("M");
    setRole("user");
    setErrores({});
    setTouched({});
  };

  const handleCancel = () => {
    setErrores({});
    setTouched({});
    onCancel();
  };


  return (
    <div className="form-user-container">
      <div className="form-user-header">
        <h5 className="form-user-title">
          {usuarioEditar ? (
            <>
              <i className="bi bi-pencil-square me-2"></i>
              Editar Usuario
            </>
          ) : (
            <>
              <i className="bi bi-person-plus-fill me-2"></i>
              Registrar Usuario
            </>
          )}
        </h5>
      </div>

      <form onSubmit={handleSubmit} noValidate className="form-user-body">
        <div className="form-user-group">
          <label className="form-user-label">
            <i className="bi bi-person me-2"></i>
            Nombre <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className={`form-user-input ${touched.nombre && errores.nombre ? 'is-invalid' : touched.nombre ? 'is-valid' : ''}`}
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            onBlur={() => handleBlur('nombre')}
            placeholder="Nombre del usuario"
          />
          {touched.nombre && errores.nombre && (
            <div className="form-user-error">
              <i className="bi bi-exclamation-circle me-1"></i>
              {errores.nombre}
            </div>
          )}
        </div>

        <div className="form-user-group">
          <label className="form-user-label">
            <i className="bi bi-envelope me-2"></i>
            Correo <span className="text-danger">*</span>
          </label>
          <input
            type="email"
            className={`form-user-input ${touched.correo && errores.correo ? 'is-invalid' : touched.correo ? 'is-valid' : ''}`}
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            onBlur={() => handleBlur('correo')}
            placeholder="correo@ejemplo.com"
          />
          {touched.correo && errores.correo && (
            <div className="form-user-error">
              <i className="bi bi-exclamation-circle me-1"></i>
              {errores.correo}
            </div>
          )}
        </div>

        {/* Password */}
        <div className="form-user-group">
          <label className="form-user-label">
            <i className="bi bi-lock me-2"></i>
            Contraseña {usuarioEditar ? "(opcional)" : <span className="text-danger">*</span>}
          </label>

          <div className="input-password-wrapper">
            <input
              type={mostrarPassword ? "text" : "password"}
              className={`form-user-input ${touched.password && errores.password
                ? "is-invalid"
                : touched.password && !errores.password && password
                  ? "is-valid"
                  : ""
                }`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => handleBlur("password")}
              placeholder="••••••••"
            />

            <button
              type="button"
              className="btn-toggle-password"
              onClick={() => setMostrarPassword(!mostrarPassword)}
            >
              <i className={`bi ${mostrarPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
            </button>
          </div>

          {touched.password && errores.password && (
            <div className="form-user-error">{errores.password}</div>
          )}
        </div>

        {/* Confirmar Password */}
        <div className="form-user-group">
          <label className="form-user-label">
            <i className="bi bi-lock-fill me-2"></i>
            Confirmar contraseña {!usuarioEditar && <span className="text-danger">*</span>}
          </label>

          <div className="input-password-wrapper">
            <input
              type={mostrarConfirmarPassword ? "text" : "password"}
              className={`form-user-input ${touched.confirmarPassword && errores.confirmarPassword
                ? "is-invalid"
                : touched.confirmarPassword &&
                  !errores.confirmarPassword &&
                  confirmarPassword
                  ? "is-valid"
                  : ""
                }`}
              value={confirmarPassword}
              onChange={(e) => setConfirmarPassword(e.target.value)}
              onBlur={() => handleBlur("confirmarPassword")}
              placeholder="••••••••"
            />

            <button
              type="button"
              className="btn-toggle-password"
              onClick={() =>
                setMostrarConfirmarPassword(!mostrarConfirmarPassword)
              }
            >
              <i
                className={`bi ${mostrarConfirmarPassword ? "bi-eye-slash" : "bi-eye"
                  }`}
              ></i>
            </button>
          </div>

          {touched.confirmarPassword && errores.confirmarPassword && (
            <div className="form-user-error">
              {errores.confirmarPassword}
            </div>
          )}
        </div>

        <div className="row">
          <div className="col-md-6">
            <div className="form-user-group">
              <label className="form-user-label">
                <i className="bi bi-calendar-event me-2"></i>
                Edad <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                className={`form-user-input ${touched.edad && errores.edad ? 'is-invalid' : touched.edad ? 'is-valid' : ''}`}
                value={edad}
                onChange={(e) => setEdad(e.target.value)}
                onBlur={() => handleBlur('edad')}
                placeholder="Ej: 22"
                min="1"
                max="120"
              />
              {touched.edad && errores.edad && (
                <div className="form-user-error">
                  <i className="bi bi-exclamation-circle me-1"></i>
                  {errores.edad}
                </div>
              )}
            </div>
          </div>

          <div className="col-md-6">
            <div className="form-user-group">
              <label className="form-user-label">
                <i className="bi bi-gender-ambiguous me-2"></i>
                Sexo <span className="text-danger">*</span>
              </label>
              <select
                className={`form-user-select ${touched.sexo && errores.sexo ? 'is-invalid' : touched.sexo ? 'is-valid' : ''}`}
                value={sexo}
                onChange={(e) => setSexo(e.target.value)}
                onBlur={() => handleBlur('sexo')}
              >
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
              </select>
              {touched.sexo && errores.sexo && (
                <div className="form-user-error">
                  <i className="bi bi-exclamation-circle me-1"></i>
                  {errores.sexo}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="form-user-group">
          <label className="form-user-label">
            <i className="bi bi-shield-check me-2"></i>
            Rol
          </label>
          <select
            className="form-user-select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="user">Usuario</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        {Object.keys(errores).length > 0 && (
          <div className="form-user-alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            Por favor, corrige los errores antes de continuar.
          </div>
        )}

        <div className="form-user-actions">
          <button type="submit" className="btn-form-submit">
            <i className={`bi ${usuarioEditar ? 'bi-check-circle' : 'bi-save'} me-2`}></i>
            {usuarioEditar ? "Actualizar" : "Guardar"}
          </button>

          {usuarioEditar && (
            <button
              type="button"
              className="btn-form-cancel"
              onClick={handleCancel}
            >
              <i className="bi bi-x-circle me-2"></i>
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default FormUser;