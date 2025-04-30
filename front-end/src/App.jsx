import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'; // Make sure your Tailwind CSS is included here or in index.css

// --- Import pages ---
import HomePage from './pages/HomePage.jsx';
import SearchPage from './pages/SearchPage.jsx';
import PostPage from './pages/PostPage.jsx';
import PhotoPage from './pages/PhotoPage.jsx';
import AuthPage from './pages/AuthPage.jsx'; // <--- Import AuthPage

function App() {
  return (
    <BrowserRouter>
      {/* You might want a Navbar or Layout component here, outside Routes */}
      {/* Example: <Navbar /> */}

      <Routes>
        {/* --- Core application routes --- */}
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/post" element={<PostPage />} />
        <Route path="/photopage" element={<PhotoPage />} />

        {/* --- Authentication route --- */}
        <Route path="/login" element={<AuthPage />} /> {/* <--- Added AuthPage Route */}
        {/* You could also use /auth or another preferred path */}

       
      </Routes>

      {/* You might want a Footer component here, outside Routes */}
      {/* Example: <Footer /> */}
    </BrowserRouter>
  );
}

export default App;
