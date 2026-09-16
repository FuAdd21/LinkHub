// src/components/ProtectedRoute.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { isTokenExpired } from '../api/config.js';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, logout } = useContext(AuthContext);

  const token = localStorage.getItem("token");
  if (!isAuthenticated || !token || isTokenExpired(token)) {
    if (isAuthenticated) {
      // Token expired since last check — force logout
      logout();
    }
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;