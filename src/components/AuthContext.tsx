import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';

// Define the types for the context
interface AuthContextProps {
  isAuthenticated: boolean;
  role: string | null; // Add role to the context
  user: User | null; // Add user to the context
  login: (role: string) => void; // Accept role when logging in
  logout: () => void;
}

// Create the AuthContext
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const storedAuth = localStorage.getItem('isAuthenticated');
    return storedAuth === 'true';  // Set initial state from localStorage
  });
  
  const [role, setRole] = useState<string | null>(() => {
    return localStorage.getItem('role'); // Set initial role from localStorage
  });

  const [user, setUser] = useState<User | null>(null); // State to store the current user

  // Listen for Firebase auth state changes
  useEffect(() => {
    const auth = getAuth();
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // Set the current user if authenticated
        setIsAuthenticated(true);
        // Optionally, fetch the user's role from Firestore or another source if needed
      } else {
        setUser(null); // Clear the user if not authenticated
        setIsAuthenticated(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Simulated login function that sets both authentication and role
  const login = (role: string) => {
    setIsAuthenticated(true);
    setRole(role); // Set the role when the user logs in
    localStorage.setItem('isAuthenticated', 'true');  // Persist authentication status
    localStorage.setItem('role', role); // Persist role in localStorage
  };
  
  // Logout function clears authentication and role
  const logout = () => {
    const auth = getAuth();
    auth.signOut().then(() => {
      setIsAuthenticated(false);
      setRole(null); // Clear the role when the user logs out
      setUser(null); // Clear the user when logged out
      localStorage.removeItem('isAuthenticated');  // Clear authentication status
      localStorage.removeItem('role'); // Clear role from localStorage
      console.log('Logged out');
    });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use the AuthContext
export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
