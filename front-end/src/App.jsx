import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import TestConnection from './components/TestConnection';

// Import pages
import HomePage from './pages/HomePage.jsx';
// import Posts from './Postfunc.jsx'; // Removed as it wasn't used in Routes
import SearchPage from './pages/searchPage.jsx';
import PostPage from './pages/PostPage.jsx';
import PhotoPage from './pages/PhotoPage.jsx'; // Make sure this path is correct

import ImageProvider from './contextapi/imageapi.jsx'; // Make sure this path is correct

function App() {
  return (
    // Ensure the initial value passed to ImageProvider is what you intend
    <ImageProvider imagePost={[]}>
      <BrowserRouter>
        {/* Routes define the different pages accessible via URL paths */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/post" element={<PostPage />} />
          {/* Corrected syntax for the PhotoPage route */}
          <Route path='/PhotoPage' element={<PhotoPage />} />
        </Routes>

      </BrowserRouter>
      <TestConnection />
    </ImageProvider>
  );
}

export default App;
