// src/context/AuthContext.js
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
} from "firebase/auth";
import app from "../Firebase/firebase.config";

const AuthContext = createContext(null);
const auth = getAuth(app);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [adminUser, setAdminUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  // Initialize auth state from localStorage
  useEffect(() => {
    try {
      const storedIsAdmin = localStorage.getItem("isAdmin") === "true";
      const storedAdminUser = localStorage.getItem("adminUser");

      if (storedIsAdmin && storedAdminUser) {
        setAdminUser(JSON.parse(storedAdminUser));
        setIsAdmin(true);
      }
    } catch (error) {
      console.error("Error loading admin session:", error);
      setAdminUser(null);
      setIsAdmin(false);
    }
  }, []);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u || null);
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  const createUser = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

  const signIn = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const signOut = async () => {
    try {
      await fbSignOut(auth);
    } catch (e) {
      console.error("User signOut error:", e);
    } finally {
      setUser(null);
    }
  };

  const loginAdmin = (admin) => {
    setAdminUser(admin);
    setIsAdmin(true);
    localStorage.setItem("isAdmin", "true");
    localStorage.setItem("adminUser", JSON.stringify(admin));
  };

  const logoutAdmin = () => {
    setAdminUser(null);
    setIsAdmin(false);
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("adminUser");
  };

  const logout = async () => {
    await signOut();
    logoutAdmin();
    sessionStorage.clear();
  };

  const isAuthenticated = !!user || isAdmin;

  const value = useMemo(
    () => ({
      user,
      createUser,
      signIn,
      signOut,
      logout,

      // Admin session
      isAdmin,
      adminUser,
      loginAdmin,
      logoutAdmin,

      // Flags
      authReady,
      isAuthenticated,
    }),
    [user, isAdmin, adminUser, authReady, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
