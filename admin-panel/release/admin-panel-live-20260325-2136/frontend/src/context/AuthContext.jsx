import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { apiRequest } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [csrfToken, setCsrfToken] = useState("");
  const [loading, setLoading] = useState(true);

  const bootstrap = useCallback(async () => {
    try {
      const me = await apiRequest("/auth/me");
      setUser(me.data);
      const csrf = await apiRequest("/auth/csrf");
      setCsrfToken(csrf.data.csrfToken || "");
    } catch (_error) {
      setUser(null);
      setCsrfToken("");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  const login = useCallback(async (email, password) => {
    const payload = await apiRequest("/auth/login", {
      method: "POST",
      body: { email, password }
    });

    setUser({
      id: payload.data.id,
      name: payload.data.name,
      email: payload.data.email,
      role: payload.data.role
    });
    setCsrfToken(payload.data.csrfToken || "");
  }, []);

  const register = useCallback(async (name, email, password) => {
    await apiRequest("/auth/register", {
      method: "POST",
      body: { name, email, password }
    });
  }, []);

  const logout = useCallback(async () => {
    await apiRequest("/auth/logout", {
      method: "POST",
      csrfToken
    });
    setUser(null);
    setCsrfToken("");
  }, [csrfToken]);

  const value = useMemo(
    () => ({
      user,
      loading,
      csrfToken,
      login,
      register,
      logout,
      refreshAuth: bootstrap
    }),
    [user, loading, csrfToken, login, register, logout, bootstrap]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
