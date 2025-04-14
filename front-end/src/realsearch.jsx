import React from 'react';
import './index.css';

function Realsearch() {
  return (
    <form action="/search" method="get">
      <input type="text" name="query" placeholder="Search..." />
      <button type="submit">Search</button>
    </form>
  );
}

export default Realsearch;
