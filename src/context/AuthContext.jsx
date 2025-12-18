import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { loginUser, signupUser, logoutUser, getSessionUser } from '../services/auth';
import { validateAndUseSyncCode } from '../services/sessionSync';

const AuthContext = createContext({
  user: null,
  setUser: () => {},
  login: async () => {},
  signup: async () => {},
  logout: () => {},
  syncWithCode: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for sync code in URL
    const urlParams = new URLSearchParams(window.location.search);
    const syncCode = urlParams.get('sync');
    
    if (syncCode) {
      const result = validateAndUseSyncCode(syncCode);
      if (result.success) {
        setUser({
          username: result.username,
          profilePhoto: result.profilePhoto,
        });
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
      }
    }
    
    // Otherwise check normal session
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

  async function syncWithCode(code) {
    const result = validateAndUseSyncCode(code);
    if (result.success) {
      setUser({
        username: result.username,
        profilePhoto: result.profilePhoto,
      });
      return result;
    }
    return result;
  }

  const value = useMemo(() => ({ user, setUser, login, signup, logout, syncWithCode }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
