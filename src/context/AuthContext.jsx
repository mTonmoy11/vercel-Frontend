// src/context/AuthContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut} from "firebase/auth";
import app from "../Firebase/firebase.config"
const AuthContext = createContext();
const auth = getAuth(app);
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

  const [notifications, setNotifications] = useState([]);
  const createUser=(email, password)=>{
        setLoading(true); // Set loading to true before the operation
        return createUserWithEmailAndPassword(auth, email, password);
    }
    const signIn=(email, password)=>{
        setLoading(true); // Set loading to true before the operation
        return signInWithEmailAndPassword(auth, email, password);
    }
    const logout=()=>{
        setLoading(true); 
        setNotifications([]);// Set loading to true before the operation
        return signOut(auth);
    }
    useEffect(()=>{
        const unsubscribe= onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false); // Set loading to false after checking auth state
            
        });
        return ()=>{
            unsubscribe(); // Cleanup subscription on unmount
        }
    },[])



  const markNotificationAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const value = {
    user,
    loading,
    createUser,
    signIn,
    logout,
    notifications,
    markNotificationAsRead
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);