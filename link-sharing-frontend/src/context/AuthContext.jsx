// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useCallback } from "react";
import { api, isTokenExpired, setLogoutHandler } from "../api/config.js";
import toast from "react-hot-toast";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem("token");
    if (token && isTokenExpired(token)) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return false;
    }
    return Boolean(token || localStorage.getItem("user"));
  });

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (e) {
        console.error("Failed to parse user from local storage", e);
        return null;
      }
    }
    return null;
  });

  // Verify / hydrate session with server on initial mount
  useEffect(() => {
    let mounted = true;
    api
      .get("/api/users/me")
      .then((res) => {
        if (mounted && res.data) {
          setUser(res.data);
          setIsAuthenticated(true);
          localStorage.setItem("user", JSON.stringify(res.data));
        }
      })
      .catch(() => {
        const token = localStorage.getItem("token");
        if (!token && mounted) {
          setIsAuthenticated(false);
          setUser(null);
          localStorage.removeItem("user");
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const login = useCallback((token, userData, csrfToken) => {
    if (token) localStorage.setItem("token", token);
    if (csrfToken) localStorage.setItem("csrf_token", csrfToken);
    if (userData) localStorage.setItem("user", JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData || null);
  }, []);

  const logout = useCallback((notify = true) => {
    api.post("/logout").catch(() => {});
    localStorage.removeItem("token");
    localStorage.removeItem("csrf_token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
    if (notify) {
      toast.error("Session ended. Please log in again.");
    }
  }, []);

  // Register the logout handler for the Axios interceptor
  useEffect(() => {
    setLogoutHandler(logout);
    return () => setLogoutHandler(null);
  }, [logout]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

