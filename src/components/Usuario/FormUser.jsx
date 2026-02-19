import React, { useEffect, useState } from "react";
import "../../styles/FormUser.css";

const FormUser = ({ onSubmit, usuarioEditar, onCancel }) => {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [edad, setEdad] = useState("");
  const [sexo, setSexo] = useState("M");
  const [role, setRole] = useState("user");

  // Estados para errores
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
      setErrores({});
      setTouched({});
    }
  }, [usuarioEditar]);

  // Funciones de validación
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

  // Validar todos los campos
  const validarFormulario = () => {
    const nuevosErrores = {
      nombre: validarNombre(nombre),
      correo: validarCorreo(correo),
      password: validarPassword(password),
      edad: validarEdad(edad),
      sexo: validarSexo(sexo),
    };

    // Eliminar errores vacíos
    Object.keys(nuevosErrores).forEach(key => {
      if (nuevosErrores[key] === "") delete nuevosErrores[key];
    });

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // Manejar blur de campos
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
      case "edad":
        error = validarEdad(edad);
        break;
      case "sexo":
        error = validarSexo(sexo);
        break;
      default:
        return;
    }

    setErrores({
      ...errores,
      [campo]: error
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Marcar todos los campos como tocados
    const todosTouched = {
      nombre: true,
      correo: true,
      password: true,
      edad: true,
      sexo: true,
    };
    setTouched(todosTouched);

    if (!validarFormulario()) {
      return;
    }

    const usuarioEnviar = {
      id: usuarioEditar?.id,
      nombre: nombre.trim(),
      correo: correo.trim().toLowerCase(),
      edad: Number(edad),
      sexo,
      role,
    };

    // solo incluir password si viene escrita
    if (password.trim()) {
      usuarioEnviar.password = password;
    }

    onSubmit(usuarioEnviar);

    // limpiar formulario
    setNombre("");
    setCorreo("");
    setPassword("");
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

        <div className="form-user-group">
          <label className="form-user-label">
            <i className="bi bi-lock me-2"></i>
            Contraseña {usuarioEditar ? "(opcional)" : <span className="text-danger">*</span>}
          </label>
          <input
            type="password"
            className={`form-user-input ${touched.password && errores.password ? 'is-invalid' : touched.password && !errores.password && password ? 'is-valid' : ''}`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => handleBlur('password')}
            placeholder="••••••••"
          />
          {touched.password && errores.password && (
            <div className="form-user-error">
              <i className="bi bi-exclamation-circle me-1"></i>
              {errores.password}
            </div>
          )}
          {usuarioEditar && (
            <small className="form-user-hint">
              <i className="bi bi-info-circle me-1"></i>
              Deja en blanco si no deseas cambiar la contraseña
            </small>
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