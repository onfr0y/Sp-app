// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'; // Tailwind CSS or global styles

// --- Auth Context ---
import { AuthProvider, useAuth } from './context/AuthContext.jsx';

// --- Import pages ---
import HomePage from './pages/HomePage.jsx';
import PostPage from './pages/PostPage.jsx';
import PhotoPage from './pages/PhotoPage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx'; // <-- IMPORT THE NEW REGISTER PAGE
import UserProfilePage from './pages/UserProfilePage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import SignOutPage from './pages/SignOutPage.jsx';
import SearchPage from './pages/searchPage.jsx';

// --- Protected Route Component ---
// ... (Keep existing ProtectedRoute component)
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-zinc-900">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        <p className="ml-3 text-gray-700 dark:text-gray-300">Loading session...</p>
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
        <Routes>
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signup" element={<RegisterPage />} /> {/* <-- ADDED REGISTER ROUTE */}
          {/* ... (keep other routes) ... */}
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
            path="/post" // For creating a new post
            element={
              <ProtectedRoute>
                <PostPage />
              </ProtectedRoute>
            }
          />
           {/* If you have a page to view a single post by its ID */}
           <Route
            path="/post/:postId" // Viewing a specific post
            element={
              <ProtectedRoute>
                {/* Replace with your actual SinglePostViewPage component if you have one */}
                {/* For now, could redirect or show a placeholder */}
                <div>Single Post View (Not Implemented)</div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/photopage" // This route might be legacy or for a different feature
            element={
              <ProtectedRoute>
                <PhotoPage />
              </ProtectedRoute>
            }
          />
          <Route // <-- New Route for User Profiles
            path="/profile/:userId"
            element={
              <ProtectedRoute>
                <UserProfilePage />
              </ProtectedRoute>
            }
          />
           <Route // <-- ADDED ROUTE FOR SIGN OUT PAGE
            path="/signout"
            element={
              <ProtectedRoute>
                <SignOutPage />
              </ProtectedRoute>
            }
          />
          <Route path="/settings/edit-profile" element={ <ProtectedRoute><div>Edit Profile Page (Not Implemented)</div></ProtectedRoute>} />
          <Route path="/not-found" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/not-found" replace />} /> {/* Catch-all for 404 */}
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;