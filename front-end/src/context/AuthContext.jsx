// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // If you want to navigate from context functions

// API URL - Changed to be the base URL
// If VITE_API_URL is not set, it defaults to 'http://localhost:3000'.
// The specific endpoint paths like '/api/auth/login' will be appended where needed.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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
        // Clear potentially corrupted stored data
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
      // Construct the full login endpoint URL
      const loginEndpoint = `${API_BASE_URL}/api/auth/login`;
      console.log('AuthProvider: Attempting login to endpoint:', loginEndpoint);

      const response = await fetch(loginEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      // Check if the response is OK (status in the range 200-299)
      if (!response.ok) {
        // Attempt to parse error message from server if response is not JSON
        let errorMessage = `Login failed with status: ${response.status}`;
        try {
            const errorData = await response.json(); // Try to parse as JSON first
            errorMessage = errorData.message || errorMessage;
        } catch (e) {
            // If response is not JSON (e.g., HTML error page), use response text
            const textError = await response.text();
            console.error("AuthProvider: Non-JSON error response from server:", textError);
            errorMessage = `Login failed. Server returned non-JSON response. (Status: ${response.status})`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json(); // Now, this should be safe if response.ok

      // Assuming backend sends: { token: "...", user: { _id: "...", ... } }
      if (data.token && data.user) {
        localStorage.setItem('authToken', data.token);
        // Ensure password is not stored, even if backend mistakenly sends it
        const { password: _, ...userToStore } = data.user; // Use _ to indicate password is intentionally ignored
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
      console.error("AuthProvider: Login error in catch block", error);
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
    navigate('/login'); // Navigate to login page after logout (fixed path)
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
