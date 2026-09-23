import React, { createContext, useState, useEffect, useCallback } from "react";
import { api, setLogoutHandler } from "../api/config.js";
import toast from "react-hot-toast";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return Boolean(localStorage.getItem("user"));
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
        if (mounted) {
          setIsAuthenticated(false);
          setUser(null);
          localStorage.removeItem("user");
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const login = useCallback((arg1, arg2, arg3) => {
    let userData = null;
    let csrfToken = null;
    let token = null;

    if (typeof arg1 === "string" && typeof arg2 === "object") {
      userData = arg2;
      csrfToken = arg1;
      token = arg3;
    } else {
      userData = arg1;
      csrfToken = typeof arg2 === "string" ? arg2 : null;
      token = typeof arg3 === "string" ? arg3 : null;
    }

    if (userData) localStorage.setItem("user", JSON.stringify(userData));
    if (csrfToken) localStorage.setItem("csrf_token", csrfToken);
    if (token) localStorage.setItem("token", token);

    setIsAuthenticated(true);
    setUser(userData || null);
  }, []);

  const logout = useCallback((notify = true) => {
    api.post("/logout").catch(() => {});
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("csrf_token");
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
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

