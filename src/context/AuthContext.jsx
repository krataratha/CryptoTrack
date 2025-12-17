import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { loginUser, signupUser, logoutUser, getSessionUser } from '../services/auth';

const AuthContext = createContext({
  user: null,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const u = getSessionUser();
    if (u) setUser(u);
  }, []);

  async function login(username, password) {
    const u = await loginUser(username, password);
    setUser(u);
    return u;
  }

  async function signup(username, password) {
    const u = await signupUser(username, password);
    setUser(u);
    return u;
  }

  function logout() {
    logoutUser();
    setUser(null);
  }

  const value = useMemo(() => ({ user, login, signup, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
