import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

// Import pages
import HomePage from './pages/HomePage.jsx';
import Posts from './Postfunc.jsx';
import PostResult from './postresultbox.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/results" element={<PostResult posts={[]} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
