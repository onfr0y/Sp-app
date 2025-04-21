import React from 'react';
import TextHeader from '../components/text-header.jsx';
import SearchBar from '../components/searchbar.jsx';
import Photobuble from '../components/photobuble.jsx';
import Catebub from '../components/cate-bub.jsx';
import DynamicActionBar from '../components/DynamicActionBar.jsx';

// --- Define the data for the Photobuble component ---
const photoDataForBubble = [
    // (Keep your data array here)
    { id: 'img1', image: 'https://i.pinimg.com/736x/65/29/a0/6529a0cb924a5ed92a8ab6162f6b93dd.jpg', height: 400 },
    { id: 'img2', image: 'https://i.pinimg.com/736x/20/0c/3a/200c3ad369ae9c243d74f31619ee5198.jpg', height: 550 },
    { id: 'img3', image: 'https://i.pinimg.com/736x/9b/79/14/9b79145c91e0d0af4fe1aa8c5640a719.jpg', height: 450 },
    { id: 'img4', image: 'https://i.pinimg.com/736x/d4/5e/22/d45e22cda63faac4ef442092bc8e84ea.jpg', height: 380 },
    { id: 5, image: 'https://i.pinimg.com/736x/5b/19/fb/5b19fbc9e804ce748ca35c5b751b8e47.jpg', height: 350 },
    { id: 6, image: 'https://i.pinimg.com/736x/da/63/cb/da63cb793cf9423b4d142d73c6779b17.jpg', height: 450 },
    { id: 7, image: 'https://i.pinimg.com/736x/0e/9a/0b/0e9a0bd9c83867bd8dbea4e668fbbee9.jpg', height: 250 },
    { id: 8, image: 'https://i.pinimg.com/736x/52/1e/09/521e090d032cb8c355dc450afb9ceff6.jpg', height: 300 },
    { id: 9, image: 'https://i.pinimg.com/736x/67/80/69/678069795a0d29af5a26caa29799b5c7.jpg', height: 500 },
   { id: 10, image: 'https://i.pinimg.com/736x/7a/36/57/7a36577a251ce89dfc101d437d155bb1.jpg', height: 650 },
   { id: 11, image: 'https://i.pinimg.com/736x/7a/36/57/7a36577a251ce89dfc101d437d155bb1.jpg', height: 650 },
];
// --- End of data definition ---


function HomePage() {
  return (
    <>
      <TextHeader />

      {/* Container for Search and Categories */}
      <div> {/* You might want padding/margin here too */}
        <SearchBar />
        <Catebub />
      </div>

      {/* --- Container for the Photo Gallery --- */}
      {/* Add a top margin class (e.g., mt-6, mt-8) to this div */}
      <div className="mt-8"> {/* <-- Added top margin here (adjust value as needed) */}
        <Photobuble data={photoDataForBubble} />
      </div>

      <DynamicActionBar />
    </>
  );
}

export default HomePage;
