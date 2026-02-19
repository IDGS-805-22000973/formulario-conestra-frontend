import { Routes, Route, Navigate } from "react-router-dom";
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import LoginPage from "../pages/LoginPage";
import TestFormPage from "../pages/TestFormPage";
import UserManagementPage from "../pages/UserManagementPage";
import FormulariosPage from "../pages/FormulariosPage";
import ResultadosUsuariosPage from "../pages/ResultadosUsuariosPage";
import NotFound from "../pages/NotFound";


const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { token, user } = useContext(AuthContext);

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles.length > 0) {
    const userRole = user?.role || "user";
    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/NotFound" />;
    }
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginPage />} />

      {/* ADMIN */}
      <Route
        path="/admin/users"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <UserManagementPage />
          </PrivateRoute>
        }
      />

      {/* USER y ADMIN */}
      <Route
        path="/formularios"
        element={
          <PrivateRoute allowedRoles={["user", "admin"]}>
            <FormulariosPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/test/:testType"
        element={
          <PrivateRoute allowedRoles={["user"]}>
            <TestFormPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/test/resultados"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <ResultadosUsuariosPage />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
