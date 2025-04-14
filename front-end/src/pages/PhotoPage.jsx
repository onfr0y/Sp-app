import React from 'react';
import { useNavigate } from 'react-router-dom';

// Placeholder SVGs for icons (replace with your preferred icon library or actual SVGs)
const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
  </svg>
);

const HeartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
  </svg>
);

const ShareIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
  </svg>
);

const CloseIcon = () => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 ml-1 text-gray-600 hover:text-gray-800">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
);

function PhotoPage() {
const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  // Placeholder image URLs - replace these
  const mainImageUrl = "https://via.placeholder.com/600x800/cccccc/000000?text=Main+Image+Placeholder";
  const relatedImage1Url = "https://via.placeholder.com/300x200/a98d7a/ffffff?text=Related+1";
  const relatedImage2Url = "https://via.placeholder.com/300x200/87ceeb/ffffff?text=Related+2";

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen font-sans">
      {/* Main Image Section */}
      <div className="relative">
        <img
          src={mainImageUrl}
          alt="Main content"
          className="w-full object-cover"
        />
        {/* Back Button */}
        <button
onClick={handleBack}
          className="absolute top-4 left-4 bg-gray-800 bg-opacity-60 text-white rounded-full p-2 hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
          aria-label="Go back"
        >
          <ArrowLeftIcon />
        </button>
      </div>

      {/* Action Bar Section */}
      <div className="flex items-center justify-between p-3 space-x-2">
        {/* Name Tag */}
        <div className="flex items-center bg-gray-200 rounded-full px-3 py-1 shadow-sm">
          <span className="text-sm font-medium text-gray-700">Name</span>
          <button className="ml-1 focus:outline-none" aria-label="Remove tag">
             <CloseIcon />
          </button>
        </div>

        {/* Icon Buttons */}
        <div className="flex items-center space-x-2">
          <button
            className="bg-gray-200 rounded-full p-2 text-gray-600 hover:bg-gray-300 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 shadow-sm"
            aria-label="Like"
          >
            <HeartIcon />
          </button>
          <button
            className="bg-gray-200 rounded-full p-2 text-gray-600 hover:bg-gray-300 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 shadow-sm"
            aria-label="Share"
          >
            <ShareIcon />
          </button>
        </div>
      </div>

      {/* Related Images Section */}
      <div className="grid grid-cols-2 gap-px bg-gray-200 pt-px">
        <div className="bg-white overflow-hidden rounded-t-lg">
           <img
            src={relatedImage1Url}
            alt="Related content 1"
            className="w-full h-auto object-cover aspect-[3/2]"
          />
        </div>
         <div className="bg-white overflow-hidden rounded-t-lg">
           <img
            src={relatedImage2Url}
            alt="Related content 2"
            className="w-full h-auto object-cover aspect-[3/2]"
          />
        </div>
              </div>
    </div>
  );
}

export default PhotoPage;
