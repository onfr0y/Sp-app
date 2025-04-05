import React from 'react';
import Posts from '../Postfunc.jsx';
import TextHeader from '../text-header.jsx';
import SearchBar from '../searchbar.jsx';

function HomePage() {
  return (
    <div>
      <TextHeader />
      <SearchBar />
      <Posts />
    </div>
  );
}

export default HomePage; 