// src/components/PostPageHeader.jsx
import React from 'react';

const BackIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
    </svg>
);

const PostPageHeader = ({ title, onGoBack }) => {
  return (
    // Adjusted background for glassmorphism, text colors for contrast
    <div className="flex justify-between items-center px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 border-b border-white/40 dark:border-zinc-700/60 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm sticky top-0 z-10 sm:px-6">
      <button 
        onClick={onGoBack} 
        className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors p-1.5 -ml-1.5 rounded-md hover:bg-gray-500/10 dark:hover:bg-white/10"
        aria-label="Go back"
      >
        <BackIcon />
        <span>Back</span>
      </button>
      <span className="font-semibold text-gray-800 dark:text-gray-100">{title}</span>
      {/* Spacer to balance the back button */}
      <div className="w-16 h-5"></div> 
    </div>
  );
};

export default PostPageHeader;
