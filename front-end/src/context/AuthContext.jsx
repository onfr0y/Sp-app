// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // If you want to navigate from context functions

// API URL for login
const API_URL = 'http://localhost:3000/api/auth'; // Adjust as needed

// Create the context
const AuthContext = createContext(null);

// Create a custom hook to easily use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

// Create the AuthProvider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken')); // Load token initially
  const [isLoading, setIsLoading] = useState(true); // To handle initial auth check

  const navigate = useNavigate(); // For navigation from login/logout functions

  // Effect to check for existing token and user data on initial load
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userJSON = localStorage.getItem('currentUser');

    if (token && userJSON) {
      try {
        const user = JSON.parse(userJSON);
        setAuthToken(token);
        setCurrentUser(user);
        console.log('AuthProvider: Session restored for user:', user);
      } catch (error) {
        console.error("AuthProvider: Error parsing stored user JSON", error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
      }
    }
    setIsLoading(false); // Finished initial loading/checking
  }, []);

  // Login function
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Assuming backend sends: { token: "...", user: { _id: "...", ... } }
      if (data.token && data.user) {
        localStorage.setItem('authToken', data.token);
        // Ensure password is not stored, even if backend mistakenly sends it
        const { password, ...userToStore } = data.user;
        localStorage.setItem('currentUser', JSON.stringify(userToStore));

        setAuthToken(data.token);
        setCurrentUser(userToStore);
        console.log('AuthProvider: Login successful for user:', userToStore);
        setIsLoading(false);
        return { success: true, user: userToStore };
      } else {
        throw new Error('Login response missing token or user data.');
      }
    } catch (error) {
      console.error("AuthProvider: Login error", error);
      setIsLoading(false);
      // Clear any potentially inconsistent stored items on login failure
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      setAuthToken(null);
      setCurrentUser(null);
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    setAuthToken(null);
    setCurrentUser(null);
    console.log('AuthProvider: User logged out.');
    navigate('/login'); // Navigate to login page after logout
  };

  // The value provided to consuming components
  const value = {
    currentUser,
    authToken,
    isAuthenticated: !!authToken && !!currentUser, // True if both token and user exist
    isLoading, // For UI to show loading state during auth operations or initial check
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
