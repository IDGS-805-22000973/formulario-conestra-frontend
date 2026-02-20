import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import logo from "../assets/Logo1.jpg";
import "../styles/NavBar.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const rol = user?.role || "user";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
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

            {/* Opciones para USER */}
            {rol === "user" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link nav-link-custom" to="/formularios">
                    Formularios
                  </Link>
                </li>
              </>
            )}

            {/* Opciones para ADMIN */}
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

          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item me-3">
              <span className="navbar-user-info">
                <i className="bi bi-person-circle me-2"></i>
                {user?.nombre || "Usuario"}
                <span className="badge bg-light text-dark ms-2">{rol}</span>
              </span>
            </li>

            <button className="btn btn-logout" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right"></i>
              <span>Cerrar sesión</span>
            </button>

          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;