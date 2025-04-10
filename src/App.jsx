import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import TestConnection from './components/TestConnection';

// Import pages
import HomePage from './pages/HomePage.jsx';
import Posts from './Postfunc.jsx';
import SearchPage from './pages/searchPage.jsx';
import PostPage from './pages/PostPage.jsx';

import ImageProvider from './contextapi/imageapi.jsx';

function App() {
  return (
    <ImageProvider imagePost={[]}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/post" element={<PostPage />} />
        </Routes>
      </BrowserRouter>
      <TestConnection />
    </ImageProvider>    
  );
}

export default App;
