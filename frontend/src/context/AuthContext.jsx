import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import AuthService from "../services/AuthService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const me = await AuthService.session();
        if (mounted) setUser(me || null);
      } catch (e) {
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const login = async (email, password) => {
    setError("");
    try {
      const u = await AuthService.login(email, password);
      setUser(u);
      return { ok: true };
    } catch (e) {
      setError(e.message || "Login failed");
      return { ok: false, message: e.message };
    }
  };

  const register = async (name, email, password) => {
    setError("");
    try {
      const res = await AuthService.register(name, email, password);
      return { ok: true, message: res.message };
    } catch (e) {
      setError(e.message || "Register failed");
      return { ok: false, message: e.message };
    }
  };

  const logout = async () => {
    await AuthService.logout();
    setUser(null);
  };

  const updateProfile = async (partial) => {
    setError("");
    try {
      const updated = await AuthService.updateProfile(partial);
      setUser(updated);
      return { ok: true, user: updated };
    } catch (e) {
      setError(e.message || "Update failed");
      return { ok: false, message: e.message };
    }
  };

  const value = useMemo(
    () => ({ user, loading, error, login, register, logout, updateProfile }),
    [user, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
