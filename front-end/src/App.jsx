// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'; // Tailwind CSS or global styles

// --- Auth Context ---
import { AuthProvider, useAuth } from './context/AuthContext.jsx'; // <<<--- CORRECTED PATH AND EXTENSION

// --- Import pages ---
import HomePage from './pages/HomePage.jsx';
import SearchPage from './pages/SearchPage.jsx';
import PostPage from './pages/PostPage.jsx';
import PhotoPage from './pages/PhotoPage.jsx';
import AuthPage from './pages/AuthPage.jsx';

// --- Protected Route Component (Example) ---
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading authentication...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* <Navbar /> */}
        <Routes>
          <Route path="/login" element={<AuthPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <SearchPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/post"
            element={
              <ProtectedRoute>
                <PostPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/photopage"
            element={
              <ProtectedRoute>
                <PhotoPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        {/* <Footer /> */}
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
