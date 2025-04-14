import React from 'react';
import TextHeader from '../text-header.jsx';
import SearchBar from '../searchbar.jsx';
import Photobuble from '../photobuble.jsx';
import Catebub from '../cate-bub.jsx';
import DynamicActionBar from '../DynamicActionBar.jsx';

function HomePage() {
  return (
    <>
      <TextHeader />
      <div>
        <SearchBar />
        <Catebub />
      </div>
      <div>
        <Photobuble />
      </div>
 
        <DynamicActionBar />
     
    </>
  );
}

export default HomePage; 